import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../styles/css/react-select.css";

function MySelect({ options, defaultValue, classPrefix, maxHeight, ...props }) {
  options = options.map(option => {
    return {
      label: option.name || option.label,
      value: option
    };
  });

  const [selectedValue, setValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue === null) setValue(defaultValue);
  }, [defaultValue]);

  const onSelectChange = value => {
    setValue(value);
    if (value) props.onChange(value.value);
    else props.onChange(value);
  };

  return (
    <Select
      className="react-select"
      classNamePrefix={classPrefix}
      noOptionsMessage={() => 'Ничего не найдено...'}
      maxMenuHeight={maxHeight}
      placeholder={props.placeholder}
      value={selectedValue}
      onChange={onSelectChange}
      options={options}
      isClearable={true}
      isSearchable={true}
      getOptionLabel={props.getOptionLabel}
      isOptionDisabled={props.isOptionDisabled}
    />
  );
}

MySelect.defaultProps = {
  onChange: option => console.log(option),
  getOptionLabel: option => option.label,
  isOptionDisabled: option => false,
  classPrefix: '',
  maxHeight: 300, // maxMenuHeight
  placeholder: "Выберите вариант..."
};

export default MySelect;
