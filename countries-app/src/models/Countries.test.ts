import Countries from 'models/Countries';
import Country, { SORT } from './interface';

const testCountries: Country[] = [
  {
    name: {
      common: 'Canada',
      official: 'Canada',
      nativeName: {
        eng: {
          official: 'Canada',
          common: 'Canada',
        },
        fra: {
          official: 'Canada',
          common: 'Canada',
        },
      },
    },
    tld: [
      '.ca',
    ],
    cca3: 'CAN',
    cioc: 'CAN',
    currencies: {
      CAD: {
        name: 'Canadian dollar',
        symbol: '$',
      },
    },
    capital: [
      'Ottawa',
    ],
    region: 'Americas',
    subregion: 'North America',
    languages: {
      eng: 'English',
      fra: 'French',
    },
    borders: [
      'USA',
    ],
    population: 38005238,
    flags: {
      png: 'https://flagcdn.com/w320/ca.png',
      svg: 'https://flagcdn.com/ca.svg',
    },
  },
  {
    name: {
      common: 'Greece',
      official: 'Hellenic Republic',
      nativeName: {
        ell: {
          official: 'Ελληνική Δημοκρατία',
          common: 'Ελλάδα',
        },
      },
    },
    tld: [
      '.gr',
    ],
    cca3: 'GRC',
    cioc: 'GRE',
    currencies: {
      EUR: {
        name: 'Euro',
        symbol: '€',
      },
    },
    capital: [
      'Athens',
    ],
    region: 'Europe',
    subregion: 'Southern Europe',
    languages: {
      ell: 'Greek',
    },
    borders: [
      'ALB',
      'BGR',
      'TUR',
      'MKD',
    ],
    population: 10715549,
    flags: {
      png: 'https://flagcdn.com/w320/gr.png',
      svg: 'https://flagcdn.com/gr.svg',
    },
  },
];

test('getAllRegionsSelectOptions should return Europe and Americas formatted', () => {
  const countries = new Countries(testCountries);
  const selectOptions = countries.getAllRegionsSelectOptions();
  const expected = [
    { label: 'Americas', value: 'Americas' },
    { label: 'Europe', value: 'Europe' }];

  expect(selectOptions.length).toEqual(expected.length);
  expected.forEach((option, i) => {
    expect(selectOptions[i]).toEqual(option);
  });
});

test('getFilteredData with region Europe should return only greece', () => {
  const countries = new Countries(testCountries);
  const result = countries.getFilteredData('Europe', '');
  expect(result.length).toEqual(1);
  expect(result[0].cca3).toEqual('GRC');
});

test(
  'getFilteredData with searchTerm cana should return only Canada',
  () => {
    const countries = new Countries(testCountries);
    const result = countries.getFilteredData('', 'cana');
    expect(result.length).toEqual(1);
    expect(result[0].cca3).toEqual('CAN');
  },
);

test(
  'getFilteredData with searchTerm cana and selectedRegion Europe '
  + 'should return empty array',
  () => {
    const countries = new Countries(testCountries);
    const result = countries.getFilteredData('Europe', 'cana');
    expect(result.length).toEqual(0);
  },
);

test(
  'getFilteredData with searchTerm cana and selectedRegion Americas '
  + 'should return only Canada',
  () => {
    const countries = new Countries(testCountries);
    const result = countries.getFilteredData('Americas', 'cana');
    expect(result.length).toEqual(1);
    expect(result[0].cca3).toEqual('CAN');
  },
);

test(
  'getFilteredData with searchTerm empty string and selectedRegion empty string '
  + 'should return both Canada and Greece',
  () => {
    const countries = new Countries(testCountries);
    const result = countries.getFilteredData('', '');
    expect(result.length).toEqual(2);
    expect(result[0].cca3).toEqual('CAN');
    expect(result[1].cca3).toEqual('GRC');
  },
);

test(
  'getFinalResults with sort order ascending should return Greece and then Canada',
  () => {
    const countries = new Countries(testCountries);
    const result = countries.getFinalResults('', '', SORT.ascending);
    expect(result.length).toEqual(2);
    expect(result[0].cca3).toEqual('GRC');
    expect(result[1].cca3).toEqual('CAN');
  },
);

test(
  'getFinalResults with sort order descending should return Canada and then Greece',
  () => {
    const countries = new Countries(testCountries);
    const result = countries.getFinalResults('', '', SORT.descending);
    expect(result.length).toEqual(2);
    expect(result[0].cca3).toEqual('CAN');
    expect(result[1].cca3).toEqual('GRC');
  },
);
