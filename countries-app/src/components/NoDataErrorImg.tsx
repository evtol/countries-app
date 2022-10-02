import React from 'react';
import styles from 'components/styles/NoDataErrorImg.module.scss';
import NoDataImg from 'assets/img/no-results.png';

/**
 * Render the no data available image
 * @component
 */

function NoDataErrorImg() {
  return (
    <img
      className={styles.noDataImg}
      src={NoDataImg}
      alt="no data"
    />
  );
}

export default NoDataErrorImg;
