const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: 50,
    height: 50,
    borderBottom: 'none', 
    borderLeft: 'none',
    borderRight: 'none'
  }),
  indicatorsContainer: (base) => ({
    ...base,
    minHeight: 50,
    height: 50,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    minHeight: 50,
    height: 50,
    padding: 0,
    margin: 0
  }),
  singleValue: (base) => ({
    ...base,
    marginLeft: '1rem',
    fontSize: '1.1rem'
  }),
  placeholder: (base) => ({
    ...base,
    marginLeft: '1rem',
    fontSize: '1.1rem'
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    marginLeft: '1rem',
    padding: 0,
    fontSize: '1.1rem'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
};

export default selectStyles;