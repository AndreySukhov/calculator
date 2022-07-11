import { useState } from 'react';

import { Input, Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import headerLogo from '../../../../assets/images/header-logo.svg';
import styles from './styles.module.css'
import { declension } from '../../../../utils/declension';
import { ReactComponent as Clear } from '../../../../assets/images/clear-bordered.svg';
import { ReactComponent as Chart } from '../../../../assets/images/chart-bordered.svg';
import {
  getPlanPacksValue,
  getFormattedNumber,
  valueToPercent, percentToValue,
} from '../../PrepareData/PackDistribution/calculations';
import { isNaN } from 'formik';
import { getIncreaseVal } from '../calculations';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';

const formatByUnit = ({val, data, unit, base}) => {
  if (unit === base) {
    return getFormattedNumber(val)
  } else if (unit === 'quantity') {
    return getFormattedNumber(percentToValue(val, data.packages))
  }

  return val
}

const formatPatientsByUnit = ({val, data, unit, base}) => {
  if (unit === base) {
    return val
  } else if (unit === 'percent') {
    return Math.round(valueToPercent(val, data.patients))
  }
  return val
}

export const PackDistribution = ({ onSubmit, reportData, reportId, stepLabel, onBackStep}) => {
  const [isFull, setIsFull] = useState(false)
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

      const newVal = Math.floor(option.patients)
      const diffCoef = option.patients === 0 ? 0 : newVal / option.patients
      const updatedData = {
        ...option,
        planPatients: !reportData.clearStoredAnalys && option.planPatients ? option.planPatients : newVal,
        patients: newVal,
        packages: option.packages * diffCoef,
        planPackages: !reportData.clearStoredAnalys && option.planPackages ? option.planPackages : option.packages * diffCoef,
        patientsRa: option.patientsRa * diffCoef,
        patientsPsa: option.patientsPsa * diffCoef,
        patientsSpa: option.patientsSpa * diffCoef,
      }

      return {
        enabledInputs,
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
        ...option,
        ...updatedData,
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
  }

  const totalPatients = data.reduce((acc, curr) => {
    if (isNaN(curr.planPatients) || curr.planPatients === '') {
      return getFormattedNumber(acc)
    }
    return getFormattedNumber(acc) + getFormattedNumber(curr.planPatients)
  }, 0)

  const totalFactPatients = data.reduce((acc, curr) => {
    if (isNaN(curr.patients) || curr.patients === '') {
      return getFormattedNumber(acc)
    }
    return getFormattedNumber(acc) + getFormattedNumber(curr.patients)
  }, 0)

  const handlePatients = (e, label) => {
    let val = e.target.value === '' ? '' : parseInt(e.target.value, 10)

    const newData = data.map((item) => {
      if (item.label === label) {
        const res = {...item}
        let newVal = val
        if (val < 0) {
          newVal = ""
        }

        if (patientsSelect === 'quantity' && val > 1_000_000_000) {
          newVal = 1_000_000_000
        }

        let updatedData = {
          ...res,
          planPatients: newVal,
        }

        let itemRes = {
          ...updatedData
        }

        const planPackages = getPlanPacksValue(updatedData, patientsSelect)

        const planPackagesData = {
          planPackages: planPackages.packages,
        }

        return {
          ...itemRes,
          ...planPackagesData,
        }
      }
      return item
    })

    setData(newData)
  }

  const totalFactPacks = data.reduce((acc, curr) => {
    return acc + parseInt(curr.packages, 10)
  }, 0)

  const patientsDiff = getFormattedNumber(totalFactPatients) - getFormattedNumber(totalPatients)

  const handleSubmit = (e) => {
    e.preventDefault()
    const storedData = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`))
    const newData = data.map((item) => {
    const planPackages = getPlanPacksValue(item, patientsSelect)
    const diff = item.planPatients / item.patients
      return {
        ...item,
        planPacksPsa: planPackages.packsPsa,
        planPacksRa: planPackages.packsRa,
        planPacksSpa: planPackages.packsSpa,
        planPatientsPsa: item.patientsPsa * diff,
        planPatientsRa: item.patientsRa * diff,
        planPatientsSpa: item.patientsSpa * diff
      }
    })

    const updatedData = {
      ...storedData,
      data: newData,
      stepLabel,
      clearStoredAnalys: false,
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
        {isFull ? 'Скрыть' : 'Показать'} {' '} распределение по нозологиям
      </button>
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th colSpan={isFull ? 3 : 4} className={styles['bordered']}>
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
                Количество
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
            {!isFull && (
              <th>
                Стоимость
              </th>
            )}
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
                {!isFull && (
                  <td>
                    {getLocalCurrencyStr(getIncreaseVal(Number(tradeOption.pricePerPack), Number(reportData.tradeIncrease)))}
                  </td>
                )}
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
                           readOnly
                           value={Math.round(tradeOption.planPackages)} />
                  </div>
                </td>
                {isFull && (
                  <>
                    <td>
                      <Text size="m">
                        {tradeOption.ra.disabled ? '-' : <>{formatByUnit({
                          val: tradeOption.packsRa,
                          data: tradeOption,
                          unit: packagesSelect,
                          base: 'percent',
                        })}</>}
                      </Text>
                    </td>
                    <td>
                      <Text size="m">
                        {tradeOption.psa.disabled ? '-' : <>{formatByUnit({
                          val: tradeOption.packsPsa,
                          data: tradeOption,
                          unit: packagesSelect,
                          base: 'percent'
                        })}</>}
                      </Text>
                    </td>
                    <td className={`${styles['bordered']}`}>
                      <Text size="m">
                        {tradeOption.spa.disabled ? '-' : <>{formatByUnit({
                          val: tradeOption.packsSpa,
                          data: tradeOption,
                          unit: packagesSelect,
                          base: 'percent'
                        })}</>}
                      </Text>
                    </td>
                  </>
                )}
                <td className={`${styles['bordered']}`}>
                  {getFormattedNumber(tradeOption.patients)}
                </td>
                <td>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input
                      type="number"
                      name="patients"
                      value={getFormattedNumber(tradeOption.planPatients)}
                      onChange={(e) => handlePatients(e, tradeOption.label)}
                    />
                  </div>
                </td>
                {isFull && (
                  <>
                    <td>
                      <Text size="m">
                        {tradeOption.ra.disabled ? '-' : <>{formatPatientsByUnit({
                          val: getFormattedNumber(tradeOption.patientsRa),
                          data: tradeOption,
                          unit: patientsSelect,
                          base: 'quantity'
                        })}</>}
                      </Text></td>
                    <td>
                      <Text size="m">
                        {tradeOption.psa.disabled ? '-' : <>{formatPatientsByUnit({
                          val: getFormattedNumber(tradeOption.patientsPsa),
                          data: tradeOption,
                          unit: patientsSelect,
                          base: 'quantity'
                        })}</>}
                      </Text>
                    </td>
                    <td className={`${styles['bordered']}`}>
                      <Text size="m">
                        {tradeOption.spa.disabled ? '-' : <>{formatPatientsByUnit({
                          val: getFormattedNumber(tradeOption.patientsSpa),
                          data: tradeOption,
                          unit: patientsSelect,
                          base: 'quantity'
                        })}</>}
                      </Text>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
          <tr>
            <td colSpan={isFull ? 3 : 4} className={styles.bordered} />
            <td colSpan={2} className={isFull ? '' : styles.bordered} style={{
              verticalAlign: 'top'
            }}>
              <div className={styles['table-summary']}>
                {totalFactPacks > 0 ? (
                  <Text size="m--bold">
                    {totalFactPacks} {declension(['упаковка', 'упаковки', 'упаковок'],totalFactPacks)} в сумме
                  </Text>
                ) : ''}
              </div>
            </td>
            {isFull && <td colSpan={3} className={styles.bordered} />}
            <td colSpan={4} className={styles.bordered} style={{
              verticalAlign: 'top'
            }}>
              <div className={styles['table-summary']}>
                {totalPatients > 0 ? (
                  <Text size="m--bold">
                    {getFormattedNumber(totalPatients)} {declension(['пациент', 'пациента', 'пациентов'],parseInt(totalPatients, 10))} в сумме
                  </Text>
                ) : ''}
                {patientsDiff !== 0 && !isNaN(patientsDiff) && (
                  <>
                    <br/>
                    <Text color="error" size="m--bold">
                      {patientsDiff > 0 ? 'Добавьте' : 'Уберите'} {Math.abs(getFormattedNumber(patientsDiff))} {declension(['пациента', 'пациентов', 'пациентов'],parseInt(patientsDiff, 10))}
                    </Text>
                  </>
                )}
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
          nextBtnDisabled={patientsDiff !== 0 }
          onPrevButtonClick={onBackStep}
          prevBtnText="Отмена"
          nextBtnText="Перейти к анализу затрат"
        />
      </form>
    </>
  )
}