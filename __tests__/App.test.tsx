import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);

    expect(screen.getByText(/Question Responses/i)).toBeInTheDocument();
  });

  it('renders profile header', () => {
    render(<App />);

    // Should render any profile role text (Patient or Caregiver will be in parentheses)
    const container = screen.getByRole('heading', { level: 1 });
    expect(container).toBeInTheDocument();
  });

  it('renders score cards', () => {
    render(<App />);

    // Should render health score section title
    expect(screen.getByText(/Future Health/i)).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(<App />);

    const filterButton = screen.getByText(/Filter:/i);
    expect(filterButton).toBeInTheDocument();
  });

  it('opens filter dropdown when filter button is clicked', () => {
    render(<App />);

    const filterButton = screen.getByText(/Filter:/i);
    fireEvent.click(filterButton);

    // Filter options should appear - using getAllByText since "All" might appear multiple times
    const allOptions = screen.getAllByText('All');
    expect(allOptions.length).toBeGreaterThan(0);
  });

  it('renders Omni Assistant button', () => {
    render(<App />);

    const omniButton = screen.getByText(/Ask Omni Assistant/i);
    expect(omniButton).toBeInTheDocument();
  });

  it('opens chat interface when Omni button is clicked', () => {
    render(<App />);

    const omniButton = screen.getByText(/Ask Omni Assistant/i);
    fireEvent.click(omniButton);

    // Chat interface should be rendered (it has an overlay)
    const overlay = document.querySelector('[class*="backdrop-blur"]');
    expect(overlay).toBeInTheDocument();
  });
});
