import { useQuery } from '@tanstack/react-query';
import { getAllCountries, STALE_TIME } from './API';
import Countries from '../models/Countries';

export type UseGetAllCountries = ()=>{
  countries: Countries|null,
  isLoading: boolean,
  error?: unknown
};

const useGetAllCountries:UseGetAllCountries = () => {
  // get all countries api call with cashing and data-slate options.
  const query = useQuery(
    ['all'],
    () => getAllCountries(),
    {
      cacheTime: 60 * 60 * 1000,
      staleTime: STALE_TIME,
    },
  );

  return {
    countries: query.data ? new Countries(query.data) : null,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export default useGetAllCountries;
