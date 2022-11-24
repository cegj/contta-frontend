import React from 'react'
import TransactionsContext from '../../Contexts/TransactionsContext'
import styles from './StatementFilterBar.module.css'
import Select from 'react-select'
import selectStylesFilterBar from '../../options/selectStyles-FilterBar'
import {ReactComponent as FilterIcon} from '../../assets/icons/filter_icon.svg'

const StatementFilterBar = ({typeFilter, setTypeFilter, categoryFilter, setCategoryFilter, accountFilter, setAccountFilter}) => {

  const {typeOptions, categoryOptions, accountOptions} = React.useContext(TransactionsContext)

  return (
    <div className={styles.statementFilterBar}>
      <div className={styles.filterIcon}>
        <FilterIcon />
      </div>
      <div className={styles.filterControl}>
        <label htmlFor="typeFilter">Tipo</label>
        <Select
          name="typeFilter"
          id="typeFilter"
          placeholder="Selecione..."
          isClearable={true}
          styles={selectStylesFilterBar}
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
        />
      </div>
      <div className={styles.filterControl}>
        <label htmlFor="typeFilter">Categoria</label>
        <Select
          name="typeFilter"
          id="typeFilter"
          placeholder="Selecione..."
          isClearable={true}
          styles={selectStylesFilterBar}
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
        />
      </div>
      <div className={styles.filterControl}>
        <label htmlFor="typeFilter">Conta</label>
        <Select
          name="typeFilter"
          id="typeFilter"
          placeholder="Selecione..."
          isClearable={true}
          styles={selectStylesFilterBar}
          value={accountFilter}
          onChange={setAccountFilter}
          options={accountOptions}
        />
      </div>
    </div>
  )
}

export default StatementFilterBar