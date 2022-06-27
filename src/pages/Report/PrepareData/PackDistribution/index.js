import { useState } from 'react';
import { ActionBar } from '../../components/ActionBar';
import { Confirm } from './Confirm'
import { Text, Input } from '../../../../components/base';
import { ReactModal } from '../../../../components/Modal';
import styles from './styles.module.css';
import headerLogo from '../../../../assets/images/header-logo.svg';
import { declension } from '../../../../utils/declension'
import {
  getPacksValue,
  getPatientsValue,
  getIsPatientsError,
  getIsPacksError,
  convertByUnits,
} from './calculations'
import { isNaN } from 'formik';

export const PackDistribution = ({onPrevButtonClick, tradeNamesOptions, regionId, tradeIncrease, stepLabel}) => {
  const [packagesSelect, setPackagesSelect] = useState('percent');
  const [patientsSelect, setPatientsSelect] = useState('quantity');
  const [showModal, setShowModal] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [data, setData] = useState(() => {
    return tradeNamesOptions.map((option) => {
      let enabledInputs = 0
      const psaEnabled = (!option.psa.disabled && option.psa.checked)
      const raEnabled = (!option.ra.disabled && option.ra.checked)
      const spaEnabled = (!option.spa.disabled && option.spa.checked)

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
        packages: '',
        packagesTouched: false,
        patients: '',
        patientsTouched: false,
        packsPsa: '',
        packsRa: '',
        packsSpa: '',
        patientsPsa: '',
        patientsRa: '',
        patientsSpa: '',
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
          patients: newVal,
        }

        return {
          ...updatedData,
          ...getPacksValue(updatedData, patientsSelect),
          patientsTouched: isTouched
        }
      }
      return item
    })

    setData(newData)

  }

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
          packages: newVal,
        }

        return {
          ...updatedData,
          ...getPatientsValue(updatedData, packagesSelect),
          packagesTouched: isTouched,
        }
      }
      return item
    })

    setData(newData)
  }

  const totalPacks = data.reduce((acc, curr) => {
    return acc + Math.round(curr.packages)
  }, 0)

  const totalPatients = data.reduce((acc, curr) => {
    return acc + Math.round(curr.patients)
  }, 0)

  const handleDiseaseInput = (e, label) => {
    const val = e.target.value;
    const name = e.target.name;

    const newData = data.map((item) => {
      if (item.label === label) {
        const updatedData = {
          ...item,
          [name]: val === '' ? val : Number(val)
        }

        return {
          ...updatedData,
          ...getPatientsValue(updatedData, packagesSelect)
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
        Распределите для каждого ТН количество упаковок и пациентов по нозологиям
      </Text>
      <Text className={styles.description} size="l">
        Для заполнения количества упаковок используйте маркетинговые данные за последний год.

        Количество пациентов указывайте за первый год текущего распределения.
      </Text>
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th colSpan={3} className={styles['bordered']}>
              <Text size="text--xl-bold" color="info">
                Препараты
              </Text>
            </th>
            <th>
              <Text size="text--xl-bold" color="info">
                Упаковки
              </Text>
            </th>
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
            <th>
              <Text size="text--xl-bold" color="info">
                Пациенты
              </Text>
            </th>
            <th colSpan={3} className={styles['bordered']}>
              <select name="patients" onChange={handleSelect} value={patientsSelect} className={styles.select}>
                <option value="percent" selected={patientsSelect === 'patients'}>
                  Проценты
                </option>
                <option value="quantity" selected={patientsSelect === 'quantity'}>
                  Количество
                </option>
              </select>
            </th>
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
              Количество
              <br/>
              упаковок
            </th>
            <th>
              РА
            </th>
            <th>
              ПсА
            </th>
            <th className={styles['bordered']}>
              СпА
            </th>
            <th>
              Количество
              <br/>
              пациентов
            </th>
            <th>
              РА
            </th>
            <th>
              ПсА
            </th>
            <th className={styles['bordered']}>
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
                <td className={styles['bordered']}>
                  {tradeOption.mnn}
                </td>
                <td>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input type="number"
                           name="packages"
                           readOnly={tradeOption.patientsTouched}
                           value={tradeOption.packages === '' ? '' : Math.round(tradeOption.packages)}
                           onChange={(e) => handlePacks(e, tradeOption.label)}
                    />
                  </div>
                </td>
                <td>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input type="number"
                           name="packsRa"
                           readOnly={tradeOption.enabledInputs === 1}
                           onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                           disabled={tradeOption.ra.disabled}
                           error={getIsPacksError(tradeOption, packagesSelect)}
                           value={
                             (!tradeOption.ra.disabled && tradeOption.enabledInputs === 1) ?
                               packagesSelect === 'percent' ? 100 : Math.round(tradeOption.packages) :
                               (tradeOption.packsRa === '' ? '' : Math.round(tradeOption.packsRa))
                             } />
                    {packagesSelect === 'percent' && (
                      <div className={`${styles['percent-mark']} ${tradeOption.ra.disabled ? `${styles['percent-mark--disabled']}` : ''}`}>%</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`${styles['with-input']}`}>
                    <Input type="number"
                           onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                           name="packsPsa"
                           readOnly={tradeOption.enabledInputs === 1}
                           disabled={tradeOption.psa.disabled}
                           error={getIsPacksError(tradeOption, packagesSelect)}
                           value={
                             (!tradeOption.psa.disabled && tradeOption.enabledInputs === 1) ?
                               packagesSelect === 'percent' ? 100 : Math.round(tradeOption.packages) :
                               (tradeOption.packsPsa === '' ? '' : Math.round(tradeOption.packsPsa))
                           }
                      />
                    {packagesSelect === 'percent' && (
                      <div className={`${styles['percent-mark']} ${tradeOption.psa.disabled ? `${styles['percent-mark--disabled']}` : ''}`}>%</div>
                    )}
                  </div>
                </td>
                <td className={`${styles['bordered']}`}>
                  <div className={`${styles['with-input']}`}>
                    <Input type="number"
                           onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                           name="packsSpa"
                           readOnly={tradeOption.enabledInputs === 1}
                           disabled={tradeOption.spa.disabled}
                           error={getIsPacksError(tradeOption, packagesSelect)}
                           value={
                             (!tradeOption.spa.disabled && tradeOption.enabledInputs === 1) ?
                               packagesSelect === 'percent' ? 100 : Math.round(tradeOption.packages) :
                               (tradeOption.packsSpa === '' ? '' : Math.round(tradeOption.packsSpa))
                           }
                    />
                    {packagesSelect === 'percent' && (
                      <div className={`${styles['percent-mark']} ${tradeOption.spa.disabled ? `${styles['percent-mark--disabled']}` : ''}`}>%</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`${styles['with-input']} ${styles['with-input--wide']}`}>
                    <Input type="number"
                           name="patients"
                           readOnly={tradeOption.packagesTouched}
                           value={tradeOption.patients === '' ? '' : Math.floor(tradeOption.patients)}
                           onChange={(e) => handlePatients(e, tradeOption.label)}
                    />
                  </div>
                </td>
                <td>
                  <div className={`${styles['with-input']}`}>
                    <Input
                      onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                      type="number"
                      name="patientsRa"
                      readOnly={tradeOption.enabledInputs === 1}
                      disabled={tradeOption.ra.disabled}
                      error={getIsPatientsError(tradeOption, patientsSelect)}
                      value={
                        (!tradeOption.ra.disabled && tradeOption.enabledInputs === 1) ?
                          patientsSelect === 'percent' ? 100 : Math.floor(tradeOption.patients) :
                          (tradeOption.patientsRa === '' ? '' : Math.floor(tradeOption.patientsRa))
                      }
                    />
                    {patientsSelect === 'percent' && (
                      <div className={`${styles['percent-mark']} ${tradeOption.ra.disabled ? `${styles['percent-mark--disabled']}` : ''}`}>%</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`${styles['with-input']}`}>
                    <Input
                      onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                      name="patientsPsa"
                      readOnly={tradeOption.enabledInputs === 1}
                      type="number"
                      disabled={tradeOption.psa.disabled}
                      error={getIsPatientsError(tradeOption, patientsSelect)}
                      value={
                        (!tradeOption.psa.disabled && tradeOption.enabledInputs === 1) ?
                          patientsSelect === 'percent' ? 100 : Math.floor(tradeOption.patients) :
                          (tradeOption.patientsPsa === '' ? '' : Math.floor(tradeOption.patientsPsa))
                      }
                    />
                    {patientsSelect === 'percent' && (
                      <div className={`${styles['percent-mark']} ${tradeOption.psa.disabled ? `${styles['percent-mark--disabled']}` : ''}`}>%</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`${styles['with-input']}`}>
                    <Input
                      type="number"
                      name="patientsSpa"
                      readOnly={tradeOption.enabledInputs === 1}
                      onChange={(e) => handleDiseaseInput(e, tradeOption.label)}
                      disabled={tradeOption.spa.disabled}
                      error={getIsPatientsError(tradeOption, patientsSelect)}
                      value={
                        (!tradeOption.spa.disabled && tradeOption.enabledInputs === 1) ?
                          patientsSelect === 'percent' ? 100 : Math.floor(tradeOption.patients) :
                          (tradeOption.patientsSpa === '' ? '' : Math.floor(tradeOption.patientsSpa))
                      }
                    />
                    {patientsSelect === 'percent' && (
                      <div className={`${styles['percent-mark']} ${tradeOption.spa.disabled ? `${styles['percent-mark--disabled']}` : ''}`}>%</div>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={3} />
            <td colSpan={4} className={styles.bordered} >
              <div className={styles['table-summary']}>
                <Text>
                  {!isNaN(totalPacks) && (
                    <>
                      {totalPacks} {declension(['упаковка', 'упаковки', 'упаковок'],totalPacks)} в сумме
                    </>
                  )}
                </Text>
              </div>
            </td>
            <td colSpan={4} className={styles.bordered}>
              <div className={styles['table-summary']}>
                <Text>
                  {!isNaN(totalPatients) && (
                    <>
                      {totalPatients} {declension(['пациент', 'пацента', 'пациентов'],totalPatients)} в сумме
                    </>
                  )}
                </Text>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) =>{
          const date = +new Date()
          e.preventDefault()
          const newData = data.map((dataItem) => {
            return {
              ...dataItem,
              packsPsa: (!dataItem.psa.disabled && dataItem.enabledInputs === 1) ?
                packagesSelect === 'percent' ? 100 : Number(dataItem.packages) :
                (dataItem.packsPsa === '' ? '' : Number(dataItem.packsPsa)),
              packsRa: (!dataItem.ra.disabled && dataItem.enabledInputs === 1) ?
                packagesSelect === 'percent' ? 100 : Number(dataItem.packages) :
                (dataItem.packsRa === '' ? '' : Number(dataItem.packsRa)),
              packsSpa: (!dataItem.spa.disabled && dataItem.enabledInputs === 1) ?
                packagesSelect === 'percent' ? 100 : Number(dataItem.packages) :
                (dataItem.packsSpa === '' ? '' : Number(dataItem.packsSpa)),
              patientsPsa: (!dataItem.psa.disabled && dataItem.enabledInputs === 1) ?
                patientsSelect === 'percent' ? 100 : Number(dataItem.patients) :
                (dataItem.patientsPsa === '' ? '' : Number(dataItem.patientsPsa)),
              patientsRa: (!dataItem.ra.disabled && dataItem.enabledInputs === 1) ?
                patientsSelect === 'percent' ? 100 : Number(dataItem.patients) :
                (dataItem.patientsRa === '' ? '' : Number(dataItem.patientsRa)),
              patientsSpa: (!dataItem.spa.disabled && dataItem.enabledInputs === 1) ?
                patientsSelect === 'percent' ? 100 : Number(dataItem.patients) :
                (dataItem.patientsSpa === '' ? '' : Number(dataItem.patientsSpa))
            }
          })
          setReportId(date)
          localStorage.setItem(`${date}-report-id`, JSON.stringify({
            data: newData,
            regionId,
            tradeIncrease,
            stepLabel,
            packagesSelect,
            patientsSelect
          }))
          setShowModal(true)
        }}>
        <ActionBar
          onPrevButtonClick={onPrevButtonClick}
          prevBtnText="Назад"
          nextBtnText="Сохранить"
        />
      </form>
      {showModal && (
        <ReactModal onClose={() => setShowModal(false)}>
          <Confirm
            reportId={reportId}
          />
        </ReactModal>
      )}
    </>
  )
}