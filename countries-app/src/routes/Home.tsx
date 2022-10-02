import React, {
  useState, useMemo, useEffect,
} from 'react';
import styles from 'routes/styles/Home.module.scss';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { STALE_TIME, getAllCountries } from 'utils/API';
import Country, { SORT } from 'models/interface';
import SearchTextInput from 'components/SearchTextInput';
import SelectCustom, { SelectOption, SortSelectOption } from 'components/SelectCustom';
import CountryTile from 'components/CountryTile';
import PageTemplate from 'components/PageTemplate';
import NoDataImage from 'components/NoDataErrorImg';
import Countries from 'models/Countries';

const selectOptionAscending: SortSelectOption = {
  label: 'ascending',
  value: SORT.ascending,
};
const selectOptionDescending: SortSelectOption = {
  label: 'descending',
  value: SORT.descending,
};
const sortSelectOptions: SortSelectOption[] = [
  selectOptionAscending,
  selectOptionDescending,
];

/**
 * The home page
 * @component
 */

function Home() {
  // the county name the user types in the input field
  const [searchTerm, setSearchTerm] = useState<string>('');
  // the region selected by the user
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  // result order preference (based on country population)
  const [order, setOrder] = useState<SORT>(SORT.descending);
  // object containing the countries data and utils
  const [countries, setCountries] = useState<Countries|null>(null);

  const queryClient = useQueryClient();
  const searchQueryKey = [searchTerm];

  // get all countries api call with cashing and data-slate options.
  const query = useQuery(
    ['all'],
    () => getAllCountries(),
    {
      cacheTime: 60 * 60 * 1000,
      staleTime: STALE_TIME,
    },
  );

  let filteredCountries: Country[] = [];

  // with this use effect we make sure new Countries() is called only once
  // when data is available.
  useEffect(() => {
    if (query.data) {
      const localCountries = new Countries(query.data);
      localCountries.saveToLocalStorage();
      setCountries(localCountries);
    }
  }, [query.data]);

  // memoize search results for better performance
  const memoizedSelectedRegion = selectedRegion || '';
  filteredCountries = useMemo(() => (query.isFetched && countries
    ? countries.getFinalResults(
      memoizedSelectedRegion,
      searchTerm,
      order,
    ) : []), [
    countries,
    memoizedSelectedRegion,
    searchTerm,
    order,
    query.isFetched,
  ]);

  // create a unique array with all the regions from the countries returned
  // memoized it, so we don't generate this array on every re-render.
  const regionSelectOptions = useMemo(
    () => (query.isFetched && countries ? countries.getAllRegionsSelectOptions() : []),
    [query.isFetched, countries],
  );

  // get the SortSelection object based on user selection.
  const sortSelectedOption = sortSelectOptions.find(
    (option) => option.value === order,
  ) ?? sortSelectOptions[0];

  return (
    <PageTemplate showSpinner={query.isLoading}>
      <div className={styles.filtersContainer}>
        <div className={styles.searchContainer}>
          <SearchTextInput
            placeholder="Search for a country..."
            searchCallback={async (value) => {
              // in the case the previous call is very slow cancel
              // the previous query before performing a new call
              await queryClient.cancelQueries(searchQueryKey);
              setSearchTerm(value);
            }}
          />
        </div>
        <div className={styles.selectContainer}>
          <div>
            <SelectCustom
              placeholder="Filter by Region"
              options={regionSelectOptions}
              isClearable
              onChange={(option: SelectOption) => {
                setSelectedRegion(option ? option.value : null);
              }}
            />
          </div>
          <div>
            <SelectCustom
              placeholder="Sort"
              options={sortSelectOptions}
              value={sortSelectedOption}
              onChange={(option: SortSelectOption) => {
                setOrder(option.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* render the countries here or show error */}
      {query.error
        ? (<h3 className={styles.error}>Something went wrong</h3>) : (
          <div className={styles.tileContainer}>
            {/* Don't lazy load images that are already in viewport */}
            {filteredCountries.map((country, index) => (
              <CountryTile
                key={country.cca3}
                country={country}
                isLazyLaded={index > 4}
              />
            ))}
            {/* If no results are available show a nice image */}
            {countries !== null && filteredCountries.length === 0 && !query.isLoading && (
              <NoDataImage />
            )}
          </div>
        )}
    </PageTemplate>
  );
}

export default Home;
