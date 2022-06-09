import { useState } from 'react';

import { Input, Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { useNavigate } from 'react-router-dom';
import headerLogo from '../../../../assets/images/header-logo.svg';
import styles from './styles.module.css'
import { declension } from '../../../../utils/declension';
import { ReactComponent as Clear } from '../../../../assets/images/clear-bordered.svg';
import { ReactComponent as Chart } from '../../../../assets/images/chart-bordered.svg';

export const PackDistribution = ({tradeNamesOptions, onSubmit}) => {
  const [isFull, setIsFull] = useState(false)
  const navigate = useNavigate();
  const [packagesSelect, setPackagesSelect] = useState('percent');
  const [patientsSelect, setPatientsSelect] = useState('quantity');

  const [data, setData] = useState(() => {
    return tradeNamesOptions.map((option) => {
      return {
        packages: 0,
        patients: 0,
        packsPsa: '',
        packsRa: '',
        packsSpa: '',
        patientsPsa: '',
        patientsRa: '',
        patientsSpa: '',
        ...option
      }
    })
  });

  const handleSelect = (e) => {

    const val = e.target.value
    if (e.target.name === 'packages') {
      setPackagesSelect(val)
      const newData = data.map((item) => {
        if (val === 'percent') {
          return {
            ...item,
            packages: item.packages > 100 ? 100 : item.packages
          }
        } else {
          return {
            ...item,
            packages: item.packages > 1_000_000_000 ? 1_000_000_000 : item.packages
          }
        }
      })

      setData(newData)

    }

    if (e.target.name === 'patients') {
      setPatientsSelect(val)

      const newData = data.map((item) => {
        if (val === 'percent') {
          return {
            ...item,
            patients: item.patients > 100 ? 100 : item.patients
          }
        } else {
          return {
            ...item,
            patients: item.patients > 1_000_000_000 ? 1_000_000_000 : item.patients
          }
        }
      })

      setData(newData)
    }
  }

  const handleTotal = (e, label) => {

    const val = parseInt(e.target.value, 10)
    const name = e.target.name
    const newData = data.map((item) => {

      if (item.label === label) {
        const res = {...item}
        let newVal = val
        if (val < 0) {
          newVal = 0
        }
        if (name === 'packages') {
          if (packagesSelect === 'percent' && val > 100) {
            newVal = 100
          } else if (packagesSelect === 'quantity' && val > 1_000_000_000) {
            newVal = 1_000_000_000
          }
        } else {
          if (patientsSelect === 'percent' && val > 100) {
            newVal = 100
          } else if (patientsSelect === 'quantity' && val > 1_000_000_000) {
            newVal = 1_000_000_000
          }
        }
        if (name === 'packages') {
          return {
            ...res,
            packages: newVal
          }
        }
        return {
          ...res,
          patients: newVal
        }

      }
      return item
    })

    setData(newData)
  }

  const totalPacks = data.reduce((acc, curr) => {
    return acc + parseInt(curr.packages, 10)
  }, 0)

  const totalPatients = data.reduce((acc, curr) => {
    return acc + parseInt(curr.patients, 10)
  }, 0)

  const handleDiseaseInput = (e, label) => {
    const val = e.target.value;
    const name = e.target.name;

    const newData = data.map((item) => {
      if (item.label === label) {
        return {
          ...item,
          [name]: val
        }
      }

      return {
        ...item
      }
    })

    setData(newData)
  }

  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Перераспределение упаковок и пациентов по нозологиям для оценки лечения современными ГИБП
      </Text>
      <button onClick={() => setIsFull(!isFull)} className={styles['toggle-view']}>
        {isFull ? (
            <Clear />
          ) :
          <Chart />
        }
        {isFull ? 'Скрыть' : 'Показать'} {' '} данные о форме выпуска
      </button>
      <table className={styles.table}>
        <thead>
        <tr>
          <th colSpan={3} className={styles['bordered']}>
            <Text size="text--xl-bold" color="info">
              Препараты
            </Text>
          </th>
          <th colSpan={2} className={isFull ? '' : styles.bordered}>
            <Text size="text--xl-bold" color="info">
              Упаковки
            </Text>
          </th>
          {isFull && (
            <th colSpan={3} className={styles['bordered']}>
              <select name="packages" onChange={handleSelect} value={packagesSelect} className={styles.select}>
                <option value="percent" selected={packagesSelect === 'percent'}>
                  Проценты
                </option>
                <option value="quantity" selected={packagesSelect === 'quantity'}>
                  Количество
                </option>
              </select>
            </th>
          )}
          <th colSpan={2}>
            <Text size="text--xl-bold" color="info">
              Пациенты
            </Text>
          </th>
          {isFull && (
            <th colSpan={3}>
              <select name="patients" onChange={handleSelect} value={patientsSelect} className={styles.select}>
                <option value="percent" selected={patientsSelect === 'patients'}>
                  Проценты
                </option>
                <option value="quantity" selected={patientsSelect === 'quantity'}>
                  Количество
                </option>
              </select>
            </th>
          )}
        </tr>
        <tr>
          <th>
            №
          </th>
          <th>
            ТН
          </th>
          <th className={styles['bordered']}>
            МНН
          </th>
          <th>
            Факт
          </th>
          <th className={isFull ? '' : styles.bordered}>
            План
          </th>
          {isFull && (
            <>
              <th>
                РА
              </th>
              <th>
                ПсА
              </th>
              <th className={styles.bordered}>
                СпА
              </th>
            </>
          )}
          <th>
            Факт
          </th>
          <th className={isFull ? '' : styles.bordered}>
            План
          </th>
          {isFull && (
            <>
              <th>
                РА
              </th>
              <th>
                ПсА
              </th>
              <th>
                СпА
              </th>
            </>
          )}
        </tr>
        </thead>
        <tbody>
        {data.map((tradeOption, i) => {
          return (
            <tr key={tradeOption.label}>
              <td>
                {i + 1}
              </td>
              <td>
                {tradeOption.label}
              </td>
              <td className={styles['bordered']}>
                {tradeOption.mnn}
              </td>
              <td>
                100
              </td>
              <td className={isFull ? '' : styles.bordered}>
                <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                  <Input type="number"
                         name="packsRa"
                         onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                         disabled={tradeOption.ra.disabled} value={tradeOption.packsRa} />
                </div>
              </td>
              {isFull && (
                <>
                  <td>-</td>
                  <td>-</td>
                  <td className={`${styles['bordered']}`}>-</td>
                </>
              )}
              <td className={`${styles['bordered']}`}>
                -
              </td>
              <td>
                <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                  <Input type="number"
                         name="patients"
                         value={tradeOption.patients}
                         onChange={(e) => handleTotal(e, tradeOption.label)}
                  />
                </div>
              </td>
              {isFull && (
                <>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </>
              )}
            </tr>
          )
        })}
        <tr>
          <td colSpan={3} />
          <td colSpan={4} className={styles.bordered} >
            <div className={styles['table-summary']}>
              {totalPacks > 0 ? (
                <Text>
                  {totalPacks} {declension(['упаковка', 'упаковки', 'упаковок'],totalPacks)} в сумме
                </Text>
              ) : ''}
            </div>
          </td>
          <td colSpan={4} className={styles.bordered}>
            <div className={styles['table-summary']}>
              {totalPatients > 0 ? (
                <Text>
                  {totalPatients} {declension(['пациент', 'пацента', 'пациентов'],totalPatients)} в сумме
                </Text>
              ) : ''}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <form
        className={styles.form}
        onSubmit={() => {
        onSubmit()
      }}>
        <ActionBar
          onPrevButtonClick={() => navigate('/reports')}
          prevBtnText="Отмена"
          nextBtnText="Перейти к анализу затрат"
        />
      </form>
    </>
  )
}