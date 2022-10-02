import React, { PropsWithChildren, ReactNode } from 'react';
import Header from 'components/Header';
import styles from 'components/styles/PageTemplate.module.scss';
import Spinner from './Spinner';

interface IProps {
    children: ReactNode;
    showSpinner?: boolean
}

/**
 * The general template of a page with heading and page container.
 * @component
 */

function PageTemplate({ children, showSpinner = false }:PropsWithChildren<IProps>) {
  return (
    <div className={styles.container}>
      <Header>Where in the world?</Header>

      <div className={styles.childrenContainer} data-testid="main-page-container">
        {children}
      </div>
      <Spinner show={showSpinner} isOverlay={false} />
    </div>
  );
}

export default PageTemplate;
