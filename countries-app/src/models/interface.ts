// ======== endpoint-related interfaces ==========

/**
 * The following interfaces represent the structure of the data
 * as the come from the endpoint.
 */

export interface NativeName {
    official: string;
    common: string;
}

export interface Name {
    common: string;
    official: string;
    nativeName: {[key: string]:NativeName};
}

export interface Currency{
    name: string;
    symbol: string;
}

interface Country {
    name: Name;
    population: number;
    region: string;
    subregion: string;
    capital: string[];
    cca3: string;
    tld: string[]; // top level domain
    currencies: {[key: string]:Currency};
    languages: {[key: string]:string};
    borders: string[];
    flags: {
        png: string;
        svg: string;
    };
    cioc: string;
}

// ======== app-related interfaces ==========

/**
 * data structure to represent key-value pairs
 * in the info section of the /details page.
 */
export interface Info
{
    label: string;
    value: string;
}

/**
 * Enumerator representing the sort options for the country list
 */
export enum SORT {
    ascending='0',
    descending='1'
}

export default Country;
