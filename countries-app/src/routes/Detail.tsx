import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { searchByCode, searchByCodes } from 'utils/API';
import Country, { Info } from 'models/interface';
import Countries from 'models/Countries';
import PageTemplate from 'components/PageTemplate';
import LinkButton from 'components/LinkButton';
import NoDataErrorImg from 'components/NoDataErrorImg';
import gsap from 'gsap';
import styles from 'routes/styles/Detail.module.scss';

interface InfoSection {
  id: number;
  info: Info[];
}

function getCountryCodeMap(countries: Country[]) {
  const countryCodeToNameDic:{[key: string]: string | undefined} = {};
  countries.forEach((country) => {
    countryCodeToNameDic[country.cca3] = country?.name?.common;
  });
  return countryCodeToNameDic;
}

function getInfoSectionA(country: Country): InfoSection {
  // get the first native language available.
  const fistNativeLanguageKey = Object.keys(country.name.nativeName)[0];
  return {
    id: 1,
    info: [
      {
        label: 'Native Name',
        value: `${country.name.nativeName[fistNativeLanguageKey].common}`,
      },
      {
        label: 'Population',
        value: `${country.population.toLocaleString()}`,
      },
      {
        label: 'Region',
        value: `${country.region}`,
      },
      {
        label: 'Sub Region',
        value: `${country.region}`,
      },
      {
        label: 'Capital',
        value: `${country.capital}`,
      },
    ],
  };
}

function getInfoSectionB(country: Country): InfoSection {
  const languagesKeys = Object.keys(country.languages);
  const currencies = country.currencies ? Object.keys(country.currencies) : [];
  // get the first currency available
  const currencyKey = currencies?.[0];
  const currencyName = country.currencies?.[currencyKey]?.name;
  return {
    id: 2,
    info: [
      {
        label: 'Top Level Domain',
        value: country.tld.join(', '),
      },

      {
        label: 'Currencies',
        value: currencyName,
      },

      {
        label: 'Languages',
        value: languagesKeys.map((languageKey) => country.languages[languageKey]).join(', '),
      },

    ],
  };
}
const tl = gsap.timeline();

/**
 * The country details page
 * @component
 */

function Detail() {
  const { cca3 = '' } = useParams();
  const [country, setCounty] = useState<Country|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const borderedButtonsContainerRef = useRef<HTMLDivElement>(null);

  /* when we navigate from one detail page to another.
   * e.g. from Greece to Albania there is no remount.
   * Therefore we need to make sure that the country state
   * is the one corresponding to the url. We achieve this with
   * the following comparison
   */
  const isCountryStateWithParamSynced = cca3 === country?.cca3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c] = await searchByCode(cca3);
        setCounty(c);
      } catch (e) {
        throw new Error('Something went wrong retrieving country data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [cca3]);

  useEffect(() => {
    // if there is no fresh data from the api call check if there are
    // cached in local storage
    if (!isCountryStateWithParamSynced) {
      const countryFromLocalStorage = Countries.getCountryWithCcaFromLS(cca3);
      if (countryFromLocalStorage) {
        setCounty(countryFromLocalStorage);
        setIsLoading(false);
      }
    }
  }, [cca3, isCountryStateWithParamSynced]);

  let sections: InfoSection[] = [];
  let borders:string[] = [];
  if (country?.cca3 === cca3) {
    sections = [getInfoSectionA(country), getInfoSectionB(country)];
    borders = country.borders;
  }

  // When the country border-codes (see the enabled option)
  // are ready get information for all those countries.
  const borderCountriesQuery = useQuery(
    [cca3, 'borders'],
    () => searchByCodes(borders),
    {
      enabled: !!borders.length,
    },
  );

  const borderCountries: Country[] = borderCountriesQuery.data || [];
  // create a map of country code -> country name.
  const borderCountriesMappings = getCountryCodeMap(borderCountries);
  const filteredBorders = borders.filter(
    (countryCode) => !!borderCountriesMappings[countryCode],
  );
  const animateBorderCountries = useCallback(() => {
    if (borderedButtonsContainerRef?.current?.children && filteredBorders.length) {
      tl.fromTo(
        borderedButtonsContainerRef.current?.children,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          stagger: 0.11,
          ease: 'expo',
          transform: 'translateY(0px)',
        },
      );
    }
  }, [filteredBorders.length]);

  useEffect(() => {
    animateBorderCountries();
  }, [animateBorderCountries]);

  const errorSection = isLoading ? null : <NoDataErrorImg />;

  return (
    <PageTemplate showSpinner={isLoading}>
      <div className={styles.buttonContainer}>
        <LinkButton
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          icon="backIcon"
        >
          Back
        </LinkButton>
      </div>
      {country ? (
        <div className={styles.countryInfoContainer}>
          <div className={styles.leftColumn}>
            <img
              src={country.flags.png}
              className={styles.image}
              alt={`${country.name.common} flag`}
            />
          </div>
          <div className={styles.rightColumn}>
            <h2 className={styles.heading}>
              {country.name.common}
            </h2>
            <div className={styles.tableContainer}>
              {sections.map((infoSection) => (
                <div key={infoSection.id} className={styles.infoSectionContainer}>
                  {infoSection.info.map((inf: Info) => (
                    <div key={inf.label}>
                      <span className={styles.label}>
                        {`${inf.label}: `}
                      </span>
                      {inf.value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className={styles.borderCountriesSection}>
              <h3 className={styles.borderCountriesHeading}>Border Countries: </h3>
              <div ref={borderedButtonsContainerRef} className={styles.borderButtonsContainer}>
                {filteredBorders.map(
                  (countryCode) => (
                    <LinkButton
                      key={countryCode}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/detail/${countryCode}`);
                      }}
                    >
                      {borderCountriesMappings[countryCode]}
                    </LinkButton>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : errorSection}

    </PageTemplate>
  );
}

export default Detail;
