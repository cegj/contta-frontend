import React from 'react'
import Chart from 'react-apexcharts'
import AppContext from '../../Contexts/AppContext'
import useDate from '../../Hooks/useDate';
import useFetch from '../../Hooks/useFetch';
import { GET_BALANCE } from '../../api';

const MonthCategoryChart = () => {

  const {year, month, typeOfDateBalance, includeExpectedOnBalance, setLoading, categories} = React.useContext(AppContext)
  const {getLastDay} = useDate();
  const {request, fetchLoading} = useFetch();

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const [chartConfig, setChartConfig] = React.useState({      
    series: [],
    options: {
      labels: [],
      chart: {
        type: 'donut',
        id: 'monthCategoryChart',
        events: {
          click: function(event, chartContext, config) {
            // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
            console.log('event', event)
            console.log('chartContext', chartContext)
            console.log('config', config)
          }    
        }
      },
      noData: {
        text: "Carregando gráfico..."
      },
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  })

  React.useEffect(() => {

    async function getBalances(){
      const token = window.localStorage.getItem('token')
      const balances = {labels: [], values: []};

      const promises = categories.map(async(group) => {
        const {url, options} = GET_BALANCE(token, {date: getLastDay(year, month), typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, group: group.id})
        const {response, json} = await request(url, options);
        if (response.ok) {
          balances.labels.push(group.name)
          balances.values.push((json.month_to_date.balance) < 0 ? (json.month_to_date.balance / 100) * -1 : 0)}
      })

      await Promise.all(promises) 
      setChartConfig({
        series: [...balances.values],
        options: {
          ...chartConfig.options,
          labels: [...balances.labels],
        }
      })
    }
  
    getBalances()
  
    //eslint-disable-next-line
  }, [typeOfDateBalance, includeExpectedOnBalance, year, month, request])  

  return (
    <div>
      <h2>Gastos por grupos de categorias no mês atual</h2>
      <Chart options={chartConfig.options} series={chartConfig.series} type="donut" width={"100%"} height={350} />
    </div>
  )
}

export default MonthCategoryChart