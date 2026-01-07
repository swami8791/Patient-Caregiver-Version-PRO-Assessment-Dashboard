import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../../components/ProfileHeader';
import { Profile } from '../../types';

const mockProfile: Profile = {
  name: 'John Doe',
  role: 'Patient',
  relationship: 'Self',
  submissionDate: '2024-01-15',
  avatarUrl: 'https://example.com/avatar.jpg',
};

describe('ProfileHeader', () => {
  it('renders profile information correctly', () => {
    render(<ProfileHeader profile={mockProfile} />);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient/i)).toBeInTheDocument();
    expect(screen.getByText(/Relationship: Self/i)).toBeInTheDocument();
    expect(screen.getByText(/Submission Date: 2024-01-15/i)).toBeInTheDocument();
  });

  it('renders avatar with correct alt text', () => {
    render(<ProfileHeader profile={mockProfile} />);

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockProfile.avatarUrl);
  });

  it('renders back button', () => {
    render(<ProfileHeader profile={mockProfile} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
