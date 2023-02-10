import React from 'react'
import Chart from 'react-apexcharts'
import AppContext from '../../Contexts/AppContext'
import useDate from '../../Hooks/useDate';
import useFetch from '../../Hooks/useFetch';
import { GET_BALANCE } from '../../api';
import styles from './Board.module.css'


const MonthCategoryChartTreemap = () => {

  const {year, month, typeOfDateBalance, includeExpectedOnBalance, setLoading, categories} = React.useContext(AppContext)
  const {getLastDay} = useDate();
  const {request, fetchLoading} = useFetch();

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const [chartConfig, setChartConfig] = React.useState({      
    series: [{data: []}],
    options: {
      chart: {
        type: 'treemap',
        id: 'monthCategoryChart',
      },
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 'regular',
          fontFamily: 'Open Sans, sans-serif'
        },
        formatter: function(text, op) {
          return [text, op.value]
        },
        offsetY: -4
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
      const balances = [];

      const promises = categories.map(async(group) => {
        const {url, options} = GET_BALANCE(token, {date: getLastDay(year, month), typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, group: group.id})
        const {response, json} = await request(url, options);
        if (response.ok) {
          if (json.month_to_date.balance < 0)
          balances.push({
            x: group.name,
            y: json.month_to_date.balance / 100 * -1})
      }})

      await Promise.all(promises) 
      setChartConfig({
        series: [
          {data: [...balances]}
        ],
        options: {
          ...chartConfig.options
        }
      })
    }
  
    getBalances()
  
    //eslint-disable-next-line
  }, [typeOfDateBalance, includeExpectedOnBalance, year, month, request])  

  return (
    <div>
      <h3 className={styles.chartTitle}>Volume por grupos no mês atual</h3>
      <Chart options={chartConfig.options} series={chartConfig.series} type="treemap" width={"100%"} height={300} />
    </div>
  )
}

export default MonthCategoryChartTreemap