import React from 'react'
import Chart from 'react-apexcharts'
import { GET_BALANCE } from '../../api'
import useDate from '../../Hooks/useDate'
import useFetch from '../../Hooks/useFetch'
import AppContext from '../../Contexts/AppContext'

const AnnualHistoryChart = ({style}) => {

  const {year, typeOfDateBalance, includeExpectedOnBalance, setLoading} = React.useContext(AppContext)
  const {getLastDay} = useDate();
  const {request, fetchLoading} = useFetch();

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const [chartConfig, setChartConfig] = React.useState({
    options: {
      chart: {
        id: 'annualHistoryChart'
      },
      stroke: {width: [0, 4]},
      xaxis: {
        categories: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
      },
      noData: {
        text: "Carregando gráfico..."
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

    setChartConfig({
      options: {
        ...chartConfig.options
      },
      series: [
      {...chartConfig.series[0],
      data: balances.incomes},
      {...chartConfig.series[1],
      data: balances.expenses}
      ]})
  }

  getBalances()

  //eslint-disable-next-line
}, [typeOfDateBalance, includeExpectedOnBalance, year, request])


  return (
    <div style={{gridColumn: "span 2"}}>
      <h2>Receitas e despesas ao longo do ano</h2>
      <Chart options={chartConfig.options} series={chartConfig.series} width={"100%"} height={350} />
    </div>
  )
}

export default AnnualHistoryChart