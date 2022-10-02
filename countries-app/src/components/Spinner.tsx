import React from 'react';
import classnames from 'classnames';
import styles from 'components/styles/Spinner.module.scss';

interface IProps {
    show: boolean;
    isOverlay: boolean;
}

function Spinner({ show, isOverlay }: IProps) {
  return (
    <div
      style={{ display: show ? 'flex' : 'none' }}
      className={classnames({
        [styles.spinnerContainerOverlay]: isOverlay,
        [styles.spinnerContainerInline]: !isOverlay,
      })}
    >
      <div className={
        classnames(styles.spinner, { [styles.spinnerInline]: !isOverlay })
      }
      />
    </div>
  );
}

export default Spinner;
