import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import useGetAllCountries from './useGetAllCountries';

const queryClient = new QueryClient();

function Wrapper({ children }: {children?: React.ReactNode}) {
  return (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
}

describe('useGetAllCountries', () => {
  it('gets results successfully', async () => {
    const { result } = renderHook(() => useGetAllCountries(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.countries).not.toBe(null), { timeout: 15000 });
  });
});
