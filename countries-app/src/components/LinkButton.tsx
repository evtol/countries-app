import React, { PropsWithChildren, ReactNode } from 'react';
import styles from 'components/styles/LinkButton.module.scss';
import { ReactComponent as BackIcon } from 'assets/svg/arrowBack.svg';

const ICONS = { backIcon: <BackIcon /> };

interface IProps {
  icon?: keyof typeof ICONS;
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>)=>void;
}

/**
 * Render the Header section of the page
 * @component
 */

function LinkButton({ children, onClick, icon }:PropsWithChildren<IProps>) {
  return (
    <button
      className={styles.container}
      onClick={onClick}
      type="button"
    >
      {icon && <div className={styles.iconContainer}>{ICONS[icon]}</div>}
      {children}
    </button>
  );
}

export default LinkButton;
