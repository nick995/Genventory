import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StrainsTable from '../StrainsTable'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('StrainsTable Component', () => {
    
  it('fetches strains on component mount and displays them', async () => {
    const mockStrains = [
      { id: 1, name: 'Strain A', description: 'Description A' },
      { id: 2, name: 'Strain B', description: 'Description B' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockStrains));

    render(<StrainsTable />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Strain A')).toBeInTheDocument();
      expect(screen.getByText('Strain B')).toBeInTheDocument();
    });
  });

  it('navigates to the add strain page on button click', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<StrainsTable />, { wrapper: MemoryRouter });

    const addButton = screen.getByRole('button', { name: /add strain/i });
    userEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/model/strains/create');
  });

  // Additional tests can be written for editing, deletion, and error handling
});
