import React from 'react'
import TransactionsContext from '../../Contexts/TransactionsContext'
import styles from './StatementFilterBar.module.css'
import Select from 'react-select'
import selectStylesFilterBar from '../../options/selectStyles-FilterBar'
import {ReactComponent as FilterIcon} from '../../assets/icons/filter_icon.svg'
import {ReactComponent as FilterOffIcon} from '../../assets/icons/filter_off_icon.svg'

const StatementFilterBar = ({typeFilter, setTypeFilter, categoryFilter, setCategoryFilter, accountFilter, setAccountFilter, statusFilter, setStatusFilter, hasFilter}) => {

  const {typeOptions, categoryOptions, accountOptions} = React.useContext(TransactionsContext)

  const statusOptions = [{label: 'Previsto', value: 1}, {label: 'Consolidado', value: 0}]

  function clearAllFilters(){
    setTypeFilter(null)
    setCategoryFilter(null)
    setAccountFilter(null)
    setStatusFilter(null)
  }

  return (
    <div className={styles.statementFilterBar}>
      <div data-tip={hasFilter ? 'Limpar filtros' : null} className={`${styles.filterIcon} ${hasFilter ? styles.hasFilter : ''}`} onClick={hasFilter ? clearAllFilters : null}>
        {!hasFilter ? <FilterIcon /> : <FilterOffIcon />} 
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
      <div className={styles.filterControl}>
        <label htmlFor="statusFilter">Situação</label>
        <Select
          name="statusFilter"
          id="statusFilter"
          placeholder="Selecione..."
          isClearable={true}
          styles={selectStylesFilterBar}
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
      </div>
    </div>
  )
}

export default StatementFilterBar