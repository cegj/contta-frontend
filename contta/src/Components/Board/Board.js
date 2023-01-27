import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import Chart from 'react-apexcharts'
import { GET_BALANCE } from '../../api'
import useDate from '../../Hooks/useDate'
import useFetch from '../../Hooks/useFetch'

const Board = () => {

  const {setPageName, setPageSubName, year, typeOfDateBalance, includeExpectedOnBalance, setLoading} = React.useContext(AppContext)
  const {getLastDay} = useDate();
  const {request, fetchLoading} = useFetch();


  React.useEffect(() => {setPageName("Painel"); setPageSubName(null)}, [setPageName, setPageSubName])
  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const [annualHistoryChart, setAnnualHistoryChart] = React.useState({
    options: {
      chart: {
        id: 'annualHistoryChart'
      },
      stroke: {width: [0, 4]},
      xaxis: {
        categories: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
      },
      noData: {
        text: "Carregando..."
      },
    },
    series: [{
      name: 'Receitas',
      color: '#b5db94',
      type: 'column',
      data: []
    },
    {
      name: 'Despesas',
      color: '#e86d5a',
      type: 'line',
      data: []
    }]
  })

  React.useEffect(() => {

  async function getBalances(){
    const token = window.localStorage.getItem('token')
    const balances = {incomes: [], expenses: []};

    for (let i = 1; i <= 12; i++){
      const {url, options} = GET_BALANCE(token, {date: getLastDay(year, i), typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance})
      const {response, json} = await request(url, options)
      if (response.ok){
        balances.incomes.push((json.month_to_date.incomes / 100).toFixed(2))
        balances.expenses.push((json.month_to_date.expenses * -1 / 100).toFixed(2))
      }
    }

    setAnnualHistoryChart({
      options: {
        ...annualHistoryChart.options
      },
      series: [
      {...annualHistoryChart.series[0],
      data: balances.incomes},
      {...annualHistoryChart.series[1],
      data: balances.expenses}
      ]})
  }

  getBalances()

  //eslint-disable-next-line
}, [typeOfDateBalance, includeExpectedOnBalance, year, request])

  return (
    <>
    <Header />
    <div className="grid g-one">
    <span className="noTransactions">O painel está em desenvolvimento.</span>
    <Chart options={annualHistoryChart.options} series={annualHistoryChart.series} width={"100%"} height={350} />
    </div>
    </>
  )
}

export default Board