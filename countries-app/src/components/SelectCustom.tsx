import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { SORT } from 'models/interface';

export interface SelectOption {
    label: string;
    value: string;
}

export interface SortSelectOption{
  label: string,
  value: SORT,
}

interface IProps {
    options: SelectOption[];
    placeholder: string;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    onChange: (option: any) => void;
    isClearable?: boolean;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    value?: any;
}

function IndicatorSeparator() {
  return <span> </span>;
}

const colourStyles: StylesConfig = {
  control: (styles) => ({
    ...styles,
    padding: '.5em',
    borderWidth: 0,
    boxShadow: '0 0 12px 5px rgb(0 0 0 / 10%)',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#000000', // Custom colour
  }),
};

/**
 * Render the custom select element
 * @component
 */

function SelectCustom(props:IProps) {
  const {
    options, placeholder, onChange, isClearable, value,
  } = props;
  return (
    <Select
      placeholder={placeholder}
      options={options}
      components={{ IndicatorSeparator }}
      styles={colourStyles}
      isClearable={isClearable}
      value={value}
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      onChange={(option: any) => {
        onChange(option);
      }}
    />
  );
}

export default SelectCustom;
