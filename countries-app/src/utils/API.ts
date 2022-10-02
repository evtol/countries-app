import urljoin from 'url-join';

/**
 * helper function to perform the HTTP GET requests to JSON endpoints.
 *
 * @param url the url of the endoint to be called.
 */

function getData(url: string) {
  return fetch(url).then((resp) => {
    if (!resp.ok) {
      throw Error('problem fetching data');
    }
    return resp.json();
  });
}

/**
 * generic function that setup all the HTTP GET calls to the countries API
 *
 * @param endpoint i.e.: /alpha
 * @param data the data to be passed in the HTTP GET request.
 */
function getCountriesAPIData(endpoint: string, data: string) {
  if (!process.env.REACT_APP_API_URL) {
    throw Error('No .env variable * API_URL * provided');
  }
  // we use .env{development/production} file to set up the endpoints.
  const url = urljoin(process.env.REACT_APP_API_URL, endpoint, data);
  return getData(url);
}

/**
 * gets any type of country code (cca2, ccn3, cca3 or cioc) and returns a promise to
 * perform the call
 * @param code country code
 */

export function searchByCode(code:string) {
  return getCountriesAPIData('alpha/', code);
}

export function searchByCodes(code:string[]) {
  return getCountriesAPIData('alpha/', `?codes=${code.join(',')}`);
}

export function getAllCountries() {
  return getCountriesAPIData('all', '');
}

export const STALE_TIME = process.env.REACT_APP_AJAX_CALL_STALE
  ? parseInt(process.env.REACT_APP_AJAX_CALL_STALE, 10) : 60;
