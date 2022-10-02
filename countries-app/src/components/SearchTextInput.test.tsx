import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import SearchTextInput from 'components/SearchTextInput';

test('renders the SearchTextInput', () => {
  render(<SearchTextInput placeholder="search..." />);
  const element = screen.getByTestId(/SearchInput/i);
  expect(element).toBeInTheDocument();
});

test('accepts a search text', () => {
  render(<SearchTextInput placeholder="search..." />);
  const input = screen.getByRole('textbox');
  const typedText = 'Greece';
  user.type(input, typedText);
  expect(input).toHaveDisplayValue(typedText);
});

test('callback is called after 300ms user finished typing', async () => {
  const mockCallback = jest.fn();
  render(<SearchTextInput
    placeholder="search..."
    searchCallback={mockCallback}
  />);
  const input = screen.getByRole('textbox');
  user.type(input, 'J Doe');
  expect(mockCallback).not.toHaveBeenCalled();
  await waitFor(
    () => expect(mockCallback).toHaveBeenCalled(),
    { timeout: 400 },
  );
  jest.clearAllMocks();
});
