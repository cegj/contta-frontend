import React from 'react'
import styles from './SideList.module.css'
import groupBy from '../../Helpers/groupBy'
import TransactionsContext from '../../Contexts/TransactionsContext'

const SideList = ({items, group}) => {

  const grouped = groupBy(items, group)
  const {getBalance} = React.useContext(TransactionsContext)

  const groupedWithBalance = Object.entries(grouped).forEach((group) => {
    group[1].forEach(async(item) => {
      item.balance = "";
      // const balance = await getBalance({date: "2022-11-30", account: item.id})
      // item.balance = balance.all_to_date;
      console.log(item)
    })
  });

  console.log(groupedWithBalance)

  // const criateElementsToRender = React.useCallback(() => {
  //   const render = []
  //   Object.entries(grouped).forEach((group, i) => {
  //     const element = []
  //     element.push(
  //       <div key={i}>
  //         <h3>{group[0]}</h3>
  //         <ul>
  //           {group[1].forEach(async(item) => {
  //           element.push(<li key={item.id}><span>{item.name}</span></li>)
  //           })}
  //         </ul>
  //       </div>)
  //     render.push(element);
  //   })
  //   return render
  //   }, [grouped])

  // const elementsToRender = criateElementsToRender()

  return (
    <section className={styles.sideList}>
      {/* {elementsToRender && elementsToRender.map((element) => {return element})} */}
    </section>
  )
}

export default SideList