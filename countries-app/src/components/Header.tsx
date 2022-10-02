import React, { PropsWithChildren, ReactNode } from 'react';
import styles from 'components/styles/Header.module.scss';

interface IProps {
    children: ReactNode;
}

/**
 * Render the Header section of the page
 * @component
 */

function Header({ children }:PropsWithChildren<IProps>) {
  return (
    <div className={styles.container} data-testid="header">
      <div className={styles.headingContainer}>
        <h1 className={styles.textContainer}>{children}</h1>
      </div>
    </div>
  );
}

export default Header;
