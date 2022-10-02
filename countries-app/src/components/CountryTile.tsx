import React, { PropsWithChildren } from 'react';
import Country, { Info } from 'models/interface';
import { Link } from 'react-router-dom';
import styles from 'components/styles/CountryTile.module.scss';

interface IProps {
    /**
     * country model containing country information.
     */
    country: Country;
    isLazyLaded?: boolean;
}

const linkCssReset = { textDecoration: 'none', color: 'initial' };

/**
 * Render basic information (Flag, Name, Population, Region, Capital)
 * of a country in a tile format
 * @component
 */

function CountryTile({ country, isLazyLaded = false }
                         :PropsWithChildren<IProps>) {
  const info: Info[] = [
    {
      label: 'Population',
      value: `${country.population.toLocaleString()}`,
    },
    {
      label: 'Region',
      value: `${country.region}`,
    },
    {
      label: 'Capital',
      value: `${country.capital}`,
    },
  ];
  return (
    <Link to={`/detail/${country.cca3}`} style={linkCssReset}>
      <div
        className={styles.container}
        data-testid={`CountryTile-${country.name.official}`}
      >
        {/* I chose for png because in some complex flags the svg are big */}
        <img
          src={country.flags.png}
          className={styles.image}
          alt={`${country.name.common} flag`}
          width={260}
          height={173}
          loading={isLazyLaded ? 'lazy' : 'eager'}
        />
        <div className={styles.infoContainer}>
          <h3>{country.name.common}</h3>
          <div className={styles.tableContainer}>
            {info.map((inf: Info) => (
              inf.value !== 'undefined' && (
              <div key={inf.label}>
                <span className={styles.label}>
                  {`${inf.label}: `}
                </span>
                {inf.value}
              </div>
              )
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CountryTile;
