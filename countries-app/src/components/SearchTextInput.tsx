import React, {
  useRef, PropsWithChildren, useCallback, useMemo,
} from 'react';
import debounce from 'lodash.debounce';
import styles from 'components/styles/SearchTextInput.module.scss';
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg';

interface IProps {
    /**
     * How long to wait for new input before calling the
     * search callback (in milliseconds).
     */
    debounceWaitTime?: number;
    /**
     * Callback called after the user typed a search term
     * @param searchText - term provided by the user.
     */
    // eslint-disable-next-line no-unused-vars
    searchCallback?: (searchText:string)=>void;
    /**
     * Text to be shown when input is empty.
     */

    placeholder: string;
}

/**
 * Component to prompt the type a search term.
 * @component
 */

function SearchTextInput({ debounceWaitTime = 300, searchCallback, placeholder }
                             :PropsWithChildren<IProps>) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // call searchCallback when user finished typing.
  const debouncedSearch = useMemo(() => debounce(() => {
    if (searchCallback) searchCallback(searchInputRef.current?.value ?? '');
  }, debounceWaitTime), [searchInputRef, debounceWaitTime, searchCallback]);

  const debouncedFilter = useCallback(debouncedSearch, [debouncedSearch]);

  return (
    <div className={styles.container} data-testid="SearchInput">
      <span className={styles.iconContainer}>
        <SearchIcon className={styles.icon} />
      </span>
      <input
        ref={searchInputRef}
        className={styles.input}
        type="text"
        placeholder={placeholder}
        onChange={debouncedFilter}
      />
    </div>
  );
}

export default SearchTextInput;
