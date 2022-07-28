import { useState } from 'react';

import { Input, Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import headerLogo from '../../../../assets/images/header-logo.svg';
import styles from './styles.module.css'
import { declension } from '../../../../utils/declension';
import {
  getPlanPacksValue,
  getFormattedNumber,
  valueToPercent, percentToValue, getPlanPatientsValue, getPacksValue,
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

      console.log(option, 'option')

      const updatedData = {
        ...option,
        planPatients: !reportData.clearStoredAnalys && (option.planPatients || option.planPatients === 0) ? option.planPatients : newVal,
        patients: newVal,
        packages: option.packages * diffCoef,
        planPackages: !reportData.clearStoredAnalys && (option.planPackages || option.planPackages === 0) ? option.planPackages : option.packages * diffCoef,
        patientsRa: option.patientsRa * diffCoef,
        patientsPsa: option.patientsPsa * diffCoef,
        patientsSpa: option.patientsSpa * diffCoef,
        planPatientsRa: option.planPatientsRa ? option.planPatientsRa : option.patientsRa * diffCoef,
        planPatientsPsa: option.planPatientsPsa ? option.planPatientsPsa : option.patientsPsa * diffCoef,
        planPatientsSpa: option.planPatientsSpa ? option.planPatientsSpa : option.patientsSpa * diffCoef,
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

  const handleNosologiaItem = (e, label) => {
    let val = e.target.value === '' ? '' : Number(e.target.value)
    const name = e.target.name

    const newData = data.map((item) => {
      if (item.label === label) {
        let updatedData = {...item}

        if (name.includes('plan')) {
          const newVal = {
            planPatientsRa: item.planPatientsRa,
            planPatientsPsa: item.planPatientsPsa,
            planPatientsSpa: item.planPatientsSpa,
          }

          newVal[name] = val

          let total = 0
          if (newVal.planPatientsRa || newVal.planPatientsRa === 0) {
            total = total + newVal.planPatientsRa
          }
          if (newVal.planPatientsPsa || newVal.planPatientsPsa === 0) {
            total = total + newVal.planPatientsPsa
          }
          if (newVal.planPatientsSpa || newVal.planPatientsSpa === 0) {
            total = total + newVal.planPatientsSpa
          }

          newVal.planPatients = total

          updatedData = {
            ...updatedData,
            ...newVal
          }

          const planPackages = getPlanPacksValue(updatedData, patientsSelect)


          const planPackagesData = {
            planPackages: planPackages.packages,
            planPacksRa: valueToPercent(planPackages.packsRa, planPackages.packages),
            planPacksPsa: valueToPercent(planPackages.packsPsa, planPackages.packages),
            planPacksSpa: valueToPercent(planPackages.packsSpa, planPackages.packages),
          }

          updatedData = {
            ...updatedData,
            ...planPackagesData
          }

        } else {
          const newVal = {
            patientsRa: item.patientsRa,
            patientsPsa: item.patientsPsa,
            patientsSpa: item.patientsSpa,
            [name]: val
          }

          let total = 0
          if (newVal.patientsRa || newVal.patientsRa === 0) {
            total += newVal.patientsRa
          }
          if (newVal.patientsPsa || newVal.patientsPsa === 0) {
            total += newVal.patientsPsa
          }
          if (newVal.patientsSpa || newVal.patientsSpa === 0) {
            total += newVal.patientsSpa
          }
          newVal.patients = total

          updatedData = {
            ...updatedData,
            ...newVal,
          }

          const packages = getPacksValue(updatedData, patientsSelect)

          const packagesData = {
            packages: packages.packages,
            packsPsa: valueToPercent(packages.packsPsa, packages.packages),
            packsRa: valueToPercent(packages.packsRa, packages.packages),
            packsSpa: valueToPercent(packages.packsSpa, packages.packages)
          }

          updatedData = {
            ...updatedData,
            ...packagesData
          }
        }

        return updatedData
      }

      return item
    })

    setData(newData)
  }

  const patientsDiff = getFormattedNumber(totalFactPatients) - getFormattedNumber(totalPatients)

  const handleSubmit = (e, goBack) => {
    e.preventDefault()
    const storedData = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`))

    const updatedData = {
      ...storedData,
      data,
      stepLabel,
      clearStoredAnalys: false,
    }

    if (storedData) {
      window.localStorage.setItem(`${reportId}-report-id`, JSON.stringify(updatedData))
    }

    if (goBack) {
      onBackStep()
    } else {
      onSubmit(updatedData)
    }
  }

  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Перераспределение упаковок и пациентов по нозологиям для оценки лечения современными ГИБП
      </Text>
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th colSpan={4} className={styles['bordered']}>
              <Text size="text--xl-bold" color="info">
                Препараты
              </Text>
            </th>
            <th colSpan={2}>
              <Text size="text--xl-bold" color="info">
                Пациенты
              </Text>
            </th>
            <th colSpan={2} className={styles.bordered}>
              Количество
            </th>
            <th colSpan={2}>
              <Text size="text--xl-bold" color="info">
                Пациенты
              </Text>
            </th>
            <th colSpan={2}>
              Количество
            </th>
          </tr>
          <tr>
            <th>
              №
            </th>
            <th>
              ТН
            </th>
            <th>
              Стоимость
            </th>
            <th className={styles['bordered']}>
              МНН
            </th>
            <th>
              Факт
            </th>
            <th>
              РА
            </th>
            <th>
              ПсА
            </th>
            <th className={styles.bordered}>
              СпА
            </th>
            <th>
              План
            </th>
            <th>
              РА
            </th>
            <th>
              ПсА
            </th>
            <th>
              СпА
            </th>
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
                <td>
                  {getLocalCurrencyStr(getIncreaseVal(Number(tradeOption.pricePerPack), Number(reportData.tradeIncrease)))}
                </td>
                <td className={styles['bordered']}>
                  {tradeOption.mnn}
                </td>
                <td className={`${styles['bordered']}`}>
                  {getFormattedNumber(tradeOption.patients)}
                </td>
                <td>
                  <Text size="m">
                    {tradeOption.ra.disabled ? '-' : <Input
                      type="number"
                      name="patientsRa"
                      value={getFormattedNumber(tradeOption.patientsRa)}
                      onChange={(e) => handleNosologiaItem(e, tradeOption.label)}
                    />}
                  </Text>
                </td>
                <td>
                  <Text size="m">
                    {tradeOption.psa.disabled ? '-' : <Input
                      type="number"
                      name="patientsPsa"
                      value={getFormattedNumber(tradeOption.patientsPsa)}
                      onChange={(e) => handleNosologiaItem(e, tradeOption.label)}
                    />}
                  </Text>
                </td>
                <td className={`${styles['bordered']}`}>
                  <Text size="m">
                    {tradeOption.spa.disabled ? '-' : <Input
                      type="number"
                      name="patientsSpa"
                      value={getFormattedNumber(tradeOption.patientsSpa)}
                      onChange={(e) => handleNosologiaItem(e, tradeOption.label)}
                    />}
                  </Text>
                </td>
                <td className={styles.bordered}>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    {getFormattedNumber(tradeOption.planPatients)}
                  </div>
                </td>
                <td>
                  <Text size="m">
                    {tradeOption.ra.disabled ? '-' :
                      <Input
                        type="number"
                        name="planPatientsRa"
                        value={getFormattedNumber(tradeOption.planPatientsRa)}
                        onChange={(e) => handleNosologiaItem(e, tradeOption.label)}
                      /> }
                  </Text>
                </td>
                <td>
                  <Text size="m">
                    {tradeOption.psa.disabled ? '-' :
                      <Input
                        type="number"
                        name="planPatientsPsa"
                        value={getFormattedNumber(tradeOption.planPatientsPsa)}
                        onChange={(e) => handleNosologiaItem(e, tradeOption.label)}
                      />}
                  </Text>
                </td>
                <td className={`${styles['bordered']}`}>
                  {tradeOption.spa.disabled ? '-' :
                    <Input
                      type="number"
                      name="planPatientsSpa"
                      value={getFormattedNumber(tradeOption.planPatientsSpa)}
                      onChange={(e) => handleNosologiaItem(e, tradeOption.label)}
                    />
                  }
                </td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={4} className={styles.bordered} />
            <td colSpan={4} className={styles.bordered} style={{
              verticalAlign: 'top'
            }}>
              <div className={styles['table-summary']}>
                {totalFactPatients > 0 ? (
                  <Text size="m--bold">
                    {getFormattedNumber(totalFactPatients)} {declension(['пациент', 'пациента', 'пациентов'],totalFactPatients)} в сумме
                  </Text>
                ) : ''}
              </div>
            </td>
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
                      Разница план факт {Math.abs(getFormattedNumber(patientsDiff))} {declension(['пациента', 'пациентов', 'пациентов'],parseInt(patientsDiff, 10))}
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
          onPrevButtonClick={(e) => handleSubmit(e,true)}
          prevBtnText="Отмена"
          nextBtnText="Перейти к анализу затрат"
        />
      </form>
    </>
  )
}