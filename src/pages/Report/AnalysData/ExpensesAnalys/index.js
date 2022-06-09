import { ActionBar } from '../../components/ActionBar';
import { Text, Button } from '../../../../components/base';
import { RadioGroup } from '../../../../components/base/forms/RadioGroup';
import { Checkbox } from '../../../../components/base/forms/Checkbox';
import { useState } from 'react';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import styles from './styles.module.css'
import headerLogo from '../../../../assets/images/header-logo.svg';
import { ReactComponent as Clear } from '../../../../assets/images/clear-bordered.svg';
import { ReactComponent as Chart } from '../../../../assets/images/chart-bordered.svg';


export const ExpensesAnalys = ({ onSubmit, onPrevClick }) => {
  const [nosologia, setNosologia] = useState('ra')
  const [healYear, setHealYear] = useState([1])
  const [showValOnHover, setShowValOnHover] = useState(false)
  const [showDiagramValOnHover, setShowDiagramValOnHover] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)
  const [patientStatus, setPatientStatus] = useState('first')

  const handleNosologiaFilter = (e) => {
    setNosologia(e.target.value)
  }

  const handleYearFilter = (e) => {
    const val = parseInt(e.target.value, 10)

    if (healYear.includes(val)) {
      setHealYear(healYear.filter((year) => year !== val))
    } else {
      setHealYear([...healYear, val])
    }
  }

  const handlePatientStatus = (e) => {
    setPatientStatus(e.target.value)
  }

  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Анализ данных
      </Text>
      <div className={`${styles['radio-grid']} ${styles['radio-row']}`}>
        <div>
          <RadioGroup
            label="Нозология"
            name="nosologia"
            value={nosologia}
            options={[
              {
                value: 'ra',
                label: 'РА'
              },
              {
                value: 'psa',
                label: 'ПсА'
              },
              {
                value: 'spa',
                label: 'СпА'
              }
            ]}
            onChange={(e) => handleNosologiaFilter(e)}
          />
        </div>
        <div className={styles['choice-group']}>
          <div className={styles['choice-group-label']}>
            <Text size="xl-bold">
              Год лечения
            </Text>
          </div>
          <div className={styles['choice-group-body']}>
            <ul className={styles['checkbox-list']}>
              <li className={styles['checkbox-list-item']}>
                <Checkbox
                  name="healYear"
                  value={1}
                  checked={healYear.includes(1)}
                  onChange={(e) => handleYearFilter(e)}
                />
                <Text className={styles['checkbox-label']} size="m">
                  Первый
                </Text>
              </li>
              <li className={styles['checkbox-list-item']}>
                <Checkbox
                  name="healYear"
                  value={2}
                  checked={healYear.includes(2)}
                  onChange={(e) => handleYearFilter(e)}
                />
                <Text className={styles['checkbox-label']} size="m">
                  Второй
                </Text>
              </li>
              <li className={styles['checkbox-list-item']}>
                <Checkbox
                  name="healYear"
                  value={3}
                  checked={healYear.includes(3)}
                  onChange={(e) => handleYearFilter(e)}
                />
                <Text className={styles['checkbox-label']} size="m">
                  Третий
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.summary}>
        <Text className={styles['summary-row']} size="xl-bold">
          Высвободившийся бюджет для лечения РА
        </Text>
        <div className={`${styles['summary-row']} ${styles['summary-row--flex']}`}>
          <Text className={styles['summary-row-title']} size="l-regular">
            Текущий
          </Text>
          <Text className={styles['summary-row-body']} size="l-regular">
            {getLocalCurrencyStr(10153859151)}
          </Text>
        </div>
        <div className={`${styles['summary-row']} ${styles['summary-row--flex']}`}>
          <Text className={styles['summary-row-title']} size="l-regular">
            Планируемый
          </Text>
          <Text className={styles['summary-row-body']} size="l-regular">
            {getLocalCurrencyStr(9252714786)}
          </Text>
        </div>
        <div className={`${styles['summary-row']} ${styles['summary-row--flex']}`}>
          <Text className={styles['summary-row-title']} size="l-regular">
            Освобождено
          </Text>
          <Text className={styles['summary-row-body']} size="l">
            {getLocalCurrencyStr(901144365)}
          </Text>
          <Text size="l">
            8,9%
          </Text>
        </div>
      </div>
      <div className={styles['checkbox-list-item']}>
        <Checkbox
          onChange={() => setShowValOnHover(!showValOnHover)}
          value={showValOnHover}
        />
        <Text className={styles['checkbox-label']} size="m">
          Показывать значения при наведении
        </Text>
      </div>
      <div>
        <button onClick={() => setShowDiagram(!showDiagram)} className={styles['toggle-view']}>
          {showDiagram ? (
              <Clear />
            ) :
            <Chart />
          }
          {showDiagram ? 'Скрыть' : 'Показать'} {' '} данные о форме выпуска
        </button>
      </div>
      {showDiagram && (
        <div className={styles['toggle-body']}>
          <div className={styles['accordion-radio-body']}>
            <RadioGroup
              label="Статус пациентов"
              name="patientStatus"
              value={nosologia}
              options={[
                {
                  value: 'first',
                  label: 'Получают лечение впервые (новички)'
                },
                {
                  value: 'next',
                  label: 'Продолжают лечение'
                }
              ]}
              onChange={(e) => handlePatientStatus(e)}
            />
          </div>
          <div className={styles['show-on-hover-check']}>
            <div className={styles['checkbox-list-item']}>
              <Checkbox
                onChange={() => setShowDiagramValOnHover(!showValOnHover)}
                value={showDiagramValOnHover}
              />
              <Text className={styles['checkbox-label']} size="m">
                Показывать значения при наведении
              </Text>
            </div>
          </div>
        </div>
      )}
      <form
        className={styles.form}
        onSubmit={() => {
        onSubmit()
      }}>
        <ActionBar
          onPrevButtonClick={onPrevClick}
          prevBtnText="Назад"
          nextBtnText="Перейти к распределению остатка"
        />
      </form>
    </>
  )
}