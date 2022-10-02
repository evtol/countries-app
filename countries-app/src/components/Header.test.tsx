import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from 'components/Header';

test('renders header', () => {
  render(<Header>Test</Header>);
  const headerElement = screen.getByTestId(/header/i);
  expect(headerElement).toBeInTheDocument();
  expect(screen.getByText('Test')).toBeInTheDocument();
});
