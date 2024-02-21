import {
  render, screen, within,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SetupServer, setupServer } from 'msw/node';
import { rest } from 'msw';
import App from './app';
import API_DATA from './mock-data';

const queryClient = new QueryClient();
const allCountriesUrl = `${process.env.REACT_APP_API_URL}all/`;

function Wrapper({ children }: { children?: React.ReactNode }) {
  return (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
}

const server: SetupServer = setupServer(
  rest.get(
    allCountriesUrl,
    (_, res, context) => res(context.json(API_DATA)),
  ),
);

describe('app', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => { server.close(); });

  describe('on successful api response', () => {
    beforeEach(() => {
      render(<App />, {
        wrapper: Wrapper,
      });
    });
    afterEach(() => { server.resetHandlers(); queryClient.clear(); });
    it('has the correct title', async () => {
      await screen.findByRole('heading', { name: 'Where in the world?' });
    });
    it('displays common elements', async () => {
      await screen.findByPlaceholderText('Search for a country...');
      screen.getByLabelText('Filter by Region');
      screen.getByLabelText('Sort');
    });
    describe('countries display', () => {
      it.each(API_DATA)('display country "$name.common" with the correct information', async ({
        name, population, region, capital,
      }) => {
        const tile = await screen.findByTestId(name.common);
        const withinTile = within(tile);

        withinTile.getByRole('heading', { name: name.common });
        const infoList = withinTile.getAllByRole('listitem');
        const listText = infoList.map((item) => item.textContent);
        const expected = [
          `Population: ${population.toLocaleString()}`,
          `Region: ${region}`,
          `Capital: ${capital}`];
        listText.forEach((text, i) => expect(text).toBe(expected[i]));
      });
    });
  });

  describe('on failed API response', () => {
    afterEach(() => {
      server.resetHandlers();
      queryClient.clear();
    });
    it('should show an error message: ', async () => {
      server.use(
        rest.get(
          allCountriesUrl,
          (_, res, ctx) => res.once(
            ctx.json([]),
          ),
        ),
      );
      render(<App />, { wrapper: Wrapper });
      await screen.findByAltText('no data');
    });
  });
});
