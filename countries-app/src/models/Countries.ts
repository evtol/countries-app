import Country, { SORT } from 'models/interface';
import uniq from 'lodash.uniq';
import { SelectOption } from 'components/SelectCustom';
import Utils from '../utils/utils';

const sortFunction = {
  [SORT.descending]: (a:Country, b: Country) => (
    b.population - a.population),
  [SORT.ascending]: (a: Country, b: Country) => (
    a.population - b.population),
};

const LOCAL_STORAGE_ITEM_NAME = '_allCountries';

/**
 * Class responsible for filtering, soring, soring the list of countries
 */

export default class Countries {
  model: Country[] = [];

  constructor(countries: Country[]) {
    this.model = countries.filter((c) => Utils.isCountryValid(c));
  }

  /**
   *  Sorts the countries based on their population in as ascending or descending order
   * @param countries
   * @param order
   */
  static sort(countries:Country[], order: SORT) {
    return countries.sort(
      sortFunction[order],
    );
  }

  /**
   * Handles saving the countries to the browser local storage.
   */
  saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_ITEM_NAME, JSON.stringify(this.model));
  }

  /**
   * Handles the data retrieval from the browser local storage.
   */
  static getFromLocalStorage(): Country[] {
    const modelFromStorage = localStorage.getItem(LOCAL_STORAGE_ITEM_NAME);
    return JSON.parse(modelFromStorage || '[]');
  }

  /**
   * Gets the country of a given cca3 from Local storage or undefined if not found
   * @param cca3 country id
   */

  static getCountryWithCcaFromLS(cca3: string): Country|undefined {
    const countries = Countries.getFromLocalStorage();
    let countryFromStorage;
    if (countries.length) {
      countryFromStorage = countries.find((country) => country.cca3 === cca3);
    }
    return countryFromStorage;
  }

  /**
   *
   * generate unique Select-options for the regions select component
   *
   */

  getAllRegionsSelectOptions():SelectOption[] {
    return uniq(this.model
      .map(
        (c): string => (c.region),
      ))
      .map((region): SelectOption => ({
        label: region,
        value: region,
      }));
  }

  /**
   * Creates a new array with all the Country elements that satisfy the filtering criteria.
   * @param selectedRegion return countries that belong to a specific region
   * @param searchTerm return countries with common and official country-name
   * that match the search term (case-insensitive)
   *
   */

  getFilteredData(selectedRegion: string, searchTerm: string): Country[] {
    let filteredCountries = this.model;
    // if region filter exists (is selected) apply the filter
    if (selectedRegion) {
      filteredCountries = filteredCountries.filter(
        (country: Country) => country.region === selectedRegion,
      );
    }
    // if the search term is selected apply the filter
    if (searchTerm) {
      const upperSearchTerm = searchTerm.toUpperCase();
      filteredCountries = filteredCountries.filter(
        (country) => country.name.common.toUpperCase()
          .includes(upperSearchTerm) || country.name.official
          .toUpperCase().includes(upperSearchTerm),
      );
    }
    // sort countries from high -> low population
    filteredCountries.sort(
      (countryA, countryB) => (
        countryB.population - countryA.population),
    );
    return filteredCountries;
  }

  /**
   * sorts and filters the list of countries
   * @param selectedRegion the region selected
   * @param searchTerm the term
   * @param order
   */

  getFinalResults(selectedRegion: string, searchTerm: string, order: SORT): Country[] {
    // if there is no filters (region, search) return all data
    const filteredCountries = !!searchTerm || !!selectedRegion
      ? this.getFilteredData(selectedRegion, searchTerm) : this.model;
    Countries.sort(filteredCountries, order);
    return filteredCountries;
  }
}
