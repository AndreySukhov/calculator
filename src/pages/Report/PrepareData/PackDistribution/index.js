import { useState } from 'react';
import { ActionBar } from '../../components/ActionBar';
import { Confirm } from './Confirm'
import { Text, Input } from '../../../../components/base';
import { ReactModal } from '../../../../components/Modal';
import styles from './styles.module.css';
import headerLogo from '../../../../assets/images/header-logo.svg';
import { declension } from '../../../../utils/declension'
import { getPacksValue, getPatientsValue, getIsPatientsError, getIsPacksError } from './calculations'

export const PackDistribution = ({onPrevButtonClick, tradeNamesOptions, regionId, tradeIncrease, stepLabel}) => {
  const [packagesSelect, setPackagesSelect] = useState('percent');
  const [patientsSelect, setPatientsSelect] = useState('quantity');
  const [showModal, setShowModal] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [data, setData] = useState(() => {
    return tradeNamesOptions.map((option) => {
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
        packages: 0,
        patients: 0,
        packsPsa: 0,
        packsRa: 0,
        packsSpa: 0,
        patientsPsa: 0,
        patientsRa: 0,
        patientsSpa: 0,
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
    const val = e.target.value
    if (e.target.name === 'packages') {
      setPackagesSelect(val)
      // const newData = data.map((item) => {
      //   if (val === 'percent') {
      //     return {
      //       ...item,
      //       packages: item.packages > 100 ? 100 : item.packages
      //     }
      //   } else {
      //     return {
      //       ...item,
      //       packages: item.packages > 1_000_000_000 ? 1_000_000_000 : item.packages
      //     }
      //   }
      // })
      // setData(newData)
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
          patients: newVal,
        }

        return {
          ...updatedData,
          ...getPacksValue(updatedData)
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
        if (val < 0) {
          newVal = 0
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
          ...getPatientsValue(updatedData)
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
        return {
          ...item,
          [name]: parseInt(val, 10)
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
                           value={Math.round(tradeOption.packages)}
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
                             Math.round(tradeOption.packages) :
                             Math.round(tradeOption.packsRa)
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
                               Math.round(tradeOption.packages) :
                               Math.round(tradeOption.packsPsa)
                           }
                      />
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
                               Math.round(tradeOption.packages) :
                               Math.round(tradeOption.packsSpa)
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
                           value={Math.round(tradeOption.patients)}
                           onChange={(e) => handlePatients(e, tradeOption.label)}
                    />
                    {patientsSelect === 'percent' && <div className={styles['percent-mark']}>%</div>}
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
                          Math.round(tradeOption.patients) :
                          Math.round(tradeOption.patientsRa)
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
                      type="number" disabled={tradeOption.psa.disabled}
                      error={getIsPatientsError(tradeOption, patientsSelect)}
                      value={
                        (!tradeOption.psa.disabled && tradeOption.enabledInputs === 1) ?
                          Math.round(tradeOption.patients) :
                          Math.round(tradeOption.patientsPsa)
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
                          Math.round(tradeOption.patients) :
                          Math.round(tradeOption.patientsSpa)
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
      </div>
      <form
        className={styles.form}
        onSubmit={(e) =>{
          const date = +new Date()
          e.preventDefault()
          setReportId(date)
          localStorage.setItem(`${date}-report-id`, JSON.stringify({
            data,
            regionId,
            tradeIncrease,
            stepLabel
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