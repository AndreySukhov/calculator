import { useState } from 'react';

import { Input, Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { useNavigate } from 'react-router-dom';
import headerLogo from '../../../../assets/images/header-logo.svg';
import styles from './styles.module.css'
import { declension } from '../../../../utils/declension';
import { ReactComponent as Clear } from '../../../../assets/images/clear-bordered.svg';
import { ReactComponent as Chart } from '../../../../assets/images/chart-bordered.svg';
import {
  getPlanPacksValue,
  getPlanPatientsValue
} from '../../PrepareData/PackDistribution/calculations';

export const PackDistribution = ({ onSubmit, reportData, reportId, stepLabel}) => {
  const [isFull, setIsFull] = useState(false)
  const navigate = useNavigate();
  const [packagesSelect, setPackagesSelect] = useState('percent');
  const [patientsSelect, setPatientsSelect] = useState('quantity');

  const [data, setData] = useState(() => {
    return reportData.data.map((option) => {

      let enabledInputs = 0
      const psaEnabled = !option.psa.disabled && option.psa.checked
      const raEnabled = !option.ra.disabled && option.ra.checked
      const spaEnabled = !option.spa.disabled && option.spa.checked

      if (psaEnabled) {
        enabledInputs += 1
      }
      if (raEnabled) {
        enabledInputs += 1
      }
      if (spaEnabled) {
        enabledInputs += 1
      }

      return {
        enabledInputs,
        planPatients: option.patients,
        planPackages: option.packages,
        psa: {
          ...option.psa,
          disabled: !psaEnabled
        },
        ra: {
          ...option.ra,
          disabled: !raEnabled
        },
        spa: {
          ...option.spa,
          disabled: !spaEnabled
        },
        ...option
      }
    })
  });


  const handleSelect = (e) => {

    const val = e.target.value
    if (e.target.name === 'packages') {
      setPackagesSelect(val)
    }
    if (e.target.name === 'patients') {
      setPatientsSelect(val)
    }
  }

  const handlePatients = (e, label) => {
    const val = parseInt(e.target.value, 10)

    const newData = data.map((item) => {
      if (item.label === label) {
        const res = {...item}
        let newVal = val
        if (val < 0) {
          newVal = 0
        }

        if (patientsSelect === 'quantity' && val > 1_000_000_000) {
          newVal = 1_000_000_000
        }

        const updatedData = {
          ...res,
          planPatients: newVal,
        }

        return {
          ...updatedData,
          planPackages: getPlanPacksValue(updatedData).packages
        }
      }
      return item
    })

    setData(newData)

  }

  const totalPacks = data.reduce((acc, curr) => {
    return acc + parseInt(curr.planPackages, 10)
  }, 0)

  const totalPatients = data.reduce((acc, curr) => {
    return acc + parseInt(curr.planPatients, 10)
  }, 0)

  const handlePacks = (e, label) => {
    const val = parseInt(e.target.value, 10)

    const newData = data.map((item) => {
      if (item.label === label) {
        const res = {...item}
        let newVal = val
        if (val < 0) {
          newVal = 0
        }
        if (packagesSelect === 'quantity' && val > 1_000_000_000) {
          newVal = 1_000_000_000
        }
        const updatedData = {
          ...res,
          planPackages: newVal,
        }
        return {
          ...updatedData,
          planPatients: getPlanPatientsValue(updatedData).patients
        }
      }
      return item
    })

    setData(newData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const storedData = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`))

    const updatedData = {
      ...storedData,
      data,
      stepLabel,
    }

    if (storedData) {
      window.localStorage.setItem(`${reportId}-report-id`, JSON.stringify(updatedData))
    }

    onSubmit(updatedData)
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
      <div className={styles['table-wrap']}>
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
                  {Math.round(tradeOption.packages)}
                </td>
                <td className={isFull ? '' : styles.bordered}>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input type="number"
                           name="packsRa"
                           onChange={(e) => handlePacks(e, tradeOption.label)}
                           value={Math.round(tradeOption.planPackages)} />
                  </div>
                </td>
                {isFull && (
                  <>
                    <td>
                      <Text size="m">
                      {tradeOption.ra.disabled ? '-' : <>{tradeOption.packsRa}</>}
                    </Text></td>
                    <td>
                      <Text size="m">
                        {tradeOption.psa.disabled ? '-' : <>{tradeOption.packsPsa}</>}
                      </Text>
                    </td>
                    <td className={`${styles['bordered']}`}>
                      <Text size="m">
                        {tradeOption.spa.disabled ? '-' : <>{tradeOption.packsSpa}</>}
                      </Text>
                    </td>
                  </>
                )}
                <td className={`${styles['bordered']}`}>
                  {tradeOption.patients}
                </td>
                <td>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input type="number"
                           name="patients"
                           value={Math.round(tradeOption.planPatients)}
                           onChange={(e) => handlePatients(e, tradeOption.label)}
                    />
                  </div>
                </td>
                {isFull && (
                  <>
                    <td>
                      <Text size="m">
                        {tradeOption.ra.disabled ? '-' : <>{tradeOption.packsRa}</>}
                      </Text></td>
                    <td>
                      <Text size="m">
                        {tradeOption.psa.disabled ? '-' : <>{tradeOption.packsPsa}</>}
                      </Text>
                    </td>
                    <td className={`${styles['bordered']}`}>
                      <Text size="m">
                        {tradeOption.spa.disabled ? '-' : <>{tradeOption.packsSpa}</>}
                      </Text>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
          <tr>
            <td colSpan={3} className={styles.bordered} />
            <td colSpan={2} className={isFull ? '' : styles.bordered} >
              <div className={styles['table-summary']}>
                {totalPacks > 0 ? (
                  <Text>
                    {totalPacks} {declension(['упаковка', 'упаковки', 'упаковок'],totalPacks)} в сумме
                  </Text>
                ) : ''}
              </div>
            </td>
            {isFull && <td colSpan={3} className={styles.bordered} />}
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
      </div>
      <form
        className={styles.form}
        onSubmit={handleSubmit}>
        <ActionBar
          onPrevButtonClick={() => navigate('/reports')}
          prevBtnText="Отмена"
          nextBtnText="Перейти к анализу затрат"
        />
      </form>
    </>
  )
}