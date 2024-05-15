// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';

// Mock components to simplify the tests
jest.mock('../components/NavBar', () => () => <div>NavBar</div>);
// ... Mock other components similarly

describe('App Component', () => {
  test('redirects to /login from root', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('WelcomeCard')).toBeInTheDocument();
  });

  test('renders WelcomeCard on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('WelcomeCard')).toBeInTheDocument();
  });

  // Dashboard route
  test('renders Dashboard on /model/dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/model/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('WelcomeCard')).toBeInTheDocument();
  });

  // Alleles route
  test('renders AllelesTable on /model/alleles route', () => {
    render(
      <MemoryRouter initialEntries={['/model/alleles']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('AllelesTable')).toBeInTheDocument();
  });

  // Plasmids route
  test('renders PlasmidsTable on /model/plasmids route', () => {
    render(
      <MemoryRouter initialEntries={['/model/plasmids']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('PlasmidsTable')).toBeInTheDocument();
  });

  // ... Add more tests for other routes
});

