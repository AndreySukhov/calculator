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
  convertByUnits,
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
        planPatientsTouched: false,
        planPackages: option.packages,
        planPackagesTouched: false,
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

    const val = e.target.value;
    const name = e.target.name;
    if (name === 'packages') {
      setPackagesSelect(val)
    }
    if (name === 'patients') {
      setPatientsSelect(val)
    }

    const newData = convertByUnits(data,name, val)
    setData(newData)
  }

  const handlePatients = (e, label) => {
    const val = parseInt(e.target.value, 10)

    const newData = data.map((item) => {
      if (item.label === label) {
        const res = {...item}
        let isTouched = true
        if (!val) {
          isTouched = false
        }
        let newVal = val
        if (val < 0) {
          newVal = 0
          isTouched = false
        }

        if (patientsSelect === 'quantity' && val > 1_000_000_000) {
          newVal = 1_000_000_000
        }

        const updatedData = {
          ...res,
          planPatients: newVal,
        }

        const planPackages = getPlanPacksValue(updatedData, patientsSelect)
        const planPackagesData = {
          planPackages: planPackages.packages,
          planPacksRa: planPackages.packsRa,
          planPacksPsa: planPackages.packsPsa,
          planPacksSpa: planPackages.packsSpa,
        }


        return {
          ...updatedData,
          ...planPackagesData,
          planPatientsTouched: isTouched
        }
      }
      return item
    })

    setData(newData)

  }

  const totalPacks = data.reduce((acc, curr) => {
    return acc + parseInt(curr.planPackages, 10)
  }, 0)

  const totalFactPacks = data.reduce((acc, curr) => {
    return acc + parseInt(curr.packages, 10)
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
        let isTouched = true
        if (!val) {
          isTouched = false
        }

        if (val < 0) {
          newVal = 0
          isTouched = false
        }
        if (packagesSelect === 'quantity' && val > 1_000_000_000) {
          newVal = 1_000_000_000
        }
        const updatedData = {
          ...res,
          planPackages: newVal,
        }

        const planPatients = getPlanPatientsValue(updatedData, packagesSelect)
        const planPatientsData = {
          planPatients: planPatients.patients,
          planPatientsRa: planPatients.patientsRa,
          planPatientsPsa: planPatients.patientsPsa,
          planPatientsSpa: planPatients.patientsSpa,
        }

        return {
          ...updatedData,
          ...planPatientsData,
          planPackagesTouched: isTouched
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
      stepLabel
    }

    if (storedData) {
      window.localStorage.setItem(`${reportId}-report-id`, JSON.stringify(updatedData))
    }

    onSubmit(updatedData)
  }

  const packsDiff = totalFactPacks - totalPacks

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
        {isFull ? 'Скрыть' : 'Показать'} {' '} распределение по нозологиям
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
                           name="planPackages"
                           readOnly={tradeOption.planPatientsTouched}
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
                  {Math.floor(tradeOption.patients)}
                </td>
                <td>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input type="number"
                           name="patients"
                           readOnly={tradeOption.planPackagesTouched}
                           value={Math.floor(tradeOption.planPatients)}
                           onChange={(e) => handlePatients(e, tradeOption.label)}
                    />
                  </div>
                </td>
                {isFull && (
                  <>
                    <td>
                      <Text size="m">
                        {tradeOption.ra.disabled ? '-' : <>{Math.floor(tradeOption.patientsRa)}</>}
                      </Text></td>
                    <td>
                      <Text size="m">
                        {tradeOption.psa.disabled ? '-' : <>{Math.floor(tradeOption.patientsPsa)}</>}
                      </Text>
                    </td>
                    <td className={`${styles['bordered']}`}>
                      <Text size="m">
                        {tradeOption.spa.disabled ? '-' : <>{Math.floor(tradeOption.patientsPsa)}</>}
                      </Text>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
          <tr>
            <td colSpan={3} className={styles.bordered} />
            <td colSpan={2} className={isFull ? '' : styles.bordered} style={{
              verticalAlign: 'top'
            }}>
              <div className={styles['table-summary']}>
                {totalFactPacks > 0 ? (
                  <Text size="m--bold">
                    {totalFactPacks} {declension(['упаковка', 'упаковки', 'упаковок'],totalFactPacks)} в сумме
                  </Text>
                ) : ''}
                {packsDiff !== 0 && !isNaN(packsDiff) && (
                  <>
                    <br/>
                    <Text color="error" size="m--bold">
                      {packsDiff > 0 ? 'Добавьте' : 'Уберите'} {Math.abs(packsDiff)} {declension(['упаковка', 'упаковки', 'упаковок'],packsDiff)}
                    </Text>
                  </>
                )}
              </div>
            </td>
            {isFull && <td colSpan={3} className={styles.bordered} />}
            <td colSpan={4} className={styles.bordered} style={{
              verticalAlign: 'top'
            }}>
              <div className={styles['table-summary']}>
                {totalPatients > 0 ? (
                  <Text size="m--bold">
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
          nextBtnDisabled={packsDiff !== 0 }
          onPrevButtonClick={() => navigate('/reports')}
          prevBtnText="Отмена"
          nextBtnText="Перейти к анализу затрат"
        />
      </form>
    </>
  )
}