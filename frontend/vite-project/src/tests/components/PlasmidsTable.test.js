import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PlasmidsTable from '../PlasmidsTable';
import fetchMock from 'jest-fetch-mock';

// Setup fetch mock
beforeEach(() => {
  fetchMock.resetMocks();
});

describe('PlasmidsTable', () => {
  test('fetches plasmids on component mount and displays them', async () => {
    const mockPlasmids = [
      { id: 1, name: 'Plasmid 1', description: 'Description 1' },
      { id: 2, name: 'Plasmid 2', description: 'Description 2' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockPlasmids));

    render(
      <MemoryRouter>
        <PlasmidsTable />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Plasmid 1')).toBeInTheDocument();
      expect(screen.getByText('Plasmid 2')).toBeInTheDocument();
    });
  });

  test('navigates to add plasmid page on button click', async () => {
    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigate,
    }));

    render(
      <MemoryRouter>
        <PlasmidsTable />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: 'Add Plasmid' });
    userEvent.click(addButton);

    expect(navigate).toHaveBeenCalledWith('/model/plasmids/create');
  });

  // Additional tests for editing and deleting plasmids
});
