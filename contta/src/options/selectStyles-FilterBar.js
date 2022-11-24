const selectStylesFilterBar = {
  control: (base) => ({
    ...base,
    minHeight: 30,
    height: 30,
    borderColor: '#D4D4D4',
    backgroundColor: "#fafafa",
    outline: 'none',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#D4D4D4',
    }
  }),
  indicatorsContainer: (base) => ({
    ...base,
    minHeight: 30,
    height: 30,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    minHeight: 30,
    height: 30,
    padding: 0,
    margin: 0,
  }),
  singleValue: (base) => ({
    ...base,
    marginLeft: '1rem',
    fontSize: '.8rem'
  }),
  placeholder: (base) => ({
    ...base,
    marginLeft: '1rem',
    fontSize: '.8rem'
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    marginLeft: '1rem',
    padding: 0,
    fontSize: '.8rem',
    outline: 'none'
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

export default selectStylesFilterBar;