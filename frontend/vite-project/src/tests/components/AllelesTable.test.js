import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllelesTable from '../../components/AllelesTable';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual for all non-hook parts
  useNavigate: jest.fn(),
}));
global.fetch = require('jest-fetch-mock');

describe('AllelesTable Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders without error', async () => {
    fetch.mockResponseOnce(JSON.stringify([])); // Mock fetch response for initial load
    render(
      <MemoryRouter>
        <AllelesTable />
      </MemoryRouter>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Wait for fetch to be called
  });

  test('fetches alleles on mount and displays them', async () => {
    const mockAlleles = [
      { id: 1, name: 'Allele 1', gene: 'Gene A' },
      // Add more mock allele objects as needed
    ];
    fetch.mockResponseOnce(JSON.stringify(mockAlleles));
    render(
      <MemoryRouter>
        <AllelesTable />
      </MemoryRouter>
    );

    await waitFor(() => {
      mockAlleles.forEach(allele => {
        expect(screen.getByText(allele.name)).toBeInTheDocument();
      });
    });
  });

  // Add more tests here for button clicks, AlertDialog interactions, etc.
});
