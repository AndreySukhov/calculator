import { ActionBar } from '../../components/ActionBar';
import { Text } from '../../../../components/base';
import { RadioGroup } from '../../../../components/base/forms/RadioGroup';
import { Checkbox } from '../../../../components/base/forms/Checkbox';
import { useState } from 'react';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import styles from './styles.module.css'
import headerLogo from '../../../../assets/images/header-logo.svg';
import { ReactComponent as Clear } from '../../../../assets/images/clear-bordered.svg';
import { ReactComponent as Chart } from '../../../../assets/images/chart-bordered.svg';
import {
  getExpenseCurrentBudget,
  getExpensePercentDiff,
  getExpensePlanBudget,
  getExpensePlanBudgetItem,
  getExpenseCurrentBudgetItem, getPricePackPerPatient,
  getFormattedNumber
} from '../calculations';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CHART_HEX } from '../../../../utils/chartHex';
import { NOSOLOGY_DICTIONARY } from '../../../../utils/nosologyDictionary';
import { getPatientStatusText } from '../../../../utils/getPatientStatus'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['Текущий', 'Планируемый'];

export const ExpensesAnalys = ({ onSubmit, onPrevClick, reportData, tradeIncrease }) => {
  const [nosologia, setNosologia] = useState('ra')
  const [healYear, setHealYear] = useState([1])
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

  const currentBudget = getExpenseCurrentBudget({
    nosologia,
    healYear,
    data: reportData.data,
    tradeIncrease,
    packagesUnit: reportData.packagesSelect,
    patientsUnit: reportData.patientsSelect,
  });
  const planBudget = getExpensePlanBudget({
    nosologia,
    healYear,
    data: reportData.data,
    tradeIncrease,
    packagesUnit: reportData.packagesSelect,
    patientsUnit: reportData.patientsSelect,
  });

  const budgetDiff = getExpensePercentDiff(currentBudget, planBudget);
  const includeFirst = healYear.includes(1)
  const includeSecond = healYear.includes(2)
  const includeThird = healYear.includes(3)


  const dataSets = reportData.data
    .map((item) => {
    return {
      label: item.label,
      backgroundColor: CHART_HEX[item.label],
      data: [getExpenseCurrentBudgetItem({
        item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird, packagesUnit: reportData.packagesSelect,
        patientsUnit: reportData.patientsSelect,
      }), getExpensePlanBudgetItem({
        item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird, packagesUnit: reportData.packagesSelect,
        patientsUnit: reportData.patientsSelect,
      })]
    }
  })

  const chartData = {
    labels,
    datasets: dataSets,
  };
  const patientsLabels = reportData.data.map(({label}) => label)

  const patientsDataSets = healYear.map((year) => {

    if (year === 1) {
      return {
        label: patientStatus === 'first' ? 'Первый год' : 'Продолжающие лечение',
        backgroundColor: '#c09d55',
        data: patientsLabels.map((label) => {
          const current = reportData.data.find((reportItem) => reportItem.label === label)
          return getPricePackPerPatient({
            item: current,
            nosologia,
            tradeIncrease,
            patientStatus,
            year
          })
        })
      }
    }

    if (year === 2) {
      return {
        label: 'Второй',
        backgroundColor: '#4055ff',
        data: patientsLabels.map((label) => {
          const current = reportData.data.find((reportItem) => reportItem.label === label)
          return getPricePackPerPatient({
            item: current,
            nosologia,
            tradeIncrease,
            patientStatus,
            year
          })
        })
      }
    }
    if (year === 3) {
      return {
        label: 'Третий',
        backgroundColor: '#ff22ff',
        data: patientsLabels.map((label) => {
          const current = reportData.data.find((reportItem) => reportItem.label === label)
          return getPricePackPerPatient({
            item: current,
            nosologia,
            tradeIncrease,
            patientStatus,
            year
          })
        })
      }
    }
  })
  const patientChartsData = {
    labels: patientsLabels,
    datasets: patientsDataSets
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value) {
            if (value === 0) {
              return value
            }
            return getLocalCurrencyStr(value)
          }
        }
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label
            const current = reportData.data.find((reportItem) => reportItem.label === label)
            if (context.label === 'Планируемый') {
              let patientsNum = 0
              if (nosologia === 'ra') {
                patientsNum = current.planPatientsRa
              } else if (nosologia === 'psa') {
                patientsNum = current.planPatientsPsa
              } else {
                patientsNum = current.planPatientsSpa
              }

              return ` ${label} ${getLocalCurrencyStr(context.raw)} ${getFormattedNumber(patientsNum)} чел.`
            }

            let patientsNum = 0
            if (nosologia === 'ra') {
              patientsNum = current.patientsRa
            } else if (nosologia === 'psa') {
              patientsNum = current.patientsPsa
            } else {
              patientsNum = current.patientsSpa
            }

            return ` ${label} ${getLocalCurrencyStr(context.raw)} ${getFormattedNumber(patientsNum)} чел.`
          }
        }
      }
    }
  };

  const patientsChartoptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value) {
            if (value === 0) {
              return value
            }
            return getLocalCurrencyStr(value)
          }
        }
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${NOSOLOGY_DICTIONARY[nosologia].short} ${getPatientStatusText(patientStatus)} ${context.dataset.label} год ${getLocalCurrencyStr(context.raw)}
            `
          }
        }
      }
    }
  };

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
          Высвободившийся бюджет для лечения {NOSOLOGY_DICTIONARY[nosologia].short}
        </Text>
        <div className={`${styles['summary-row']} ${styles['summary-row--flex']}`}>
          <Text className={styles['summary-row-title']} size="l-regular">
            Текущий
          </Text>
          <Text className={styles['summary-row-body']} size="l-regular">
            {getLocalCurrencyStr(currentBudget)}
          </Text>
        </div>
        <div className={`${styles['summary-row']} ${styles['summary-row--flex']}`}>
          <Text className={styles['summary-row-title']} size="l-regular">
            Планируемый
          </Text>
          <Text className={styles['summary-row-body']} size="l-regular">
            {getLocalCurrencyStr(planBudget)}
          </Text>
        </div>
        <div className={`${styles['summary-row']} ${styles['summary-row--flex']}`}>
          <Text className={styles['summary-row-title']} size="l-regular">
            Освобождено
          </Text>
          <Text className={styles['summary-row-body']} size="l">
            {currentBudget - planBudget > 0 ? getLocalCurrencyStr(currentBudget - planBudget) : 0}
          </Text>
          {budgetDiff && (
            <Text size="l">
              {budgetDiff}%
            </Text>
          )}
        </div>
      </div>
      <div className={styles.chart}>
        <Bar options={options} data={chartData} />
      </div>
      <div>
        <br/>
        <br/>
        <br/>
        <Text className={styles['summary-row']} size="xl-bold">
          Затраты на одного пациента
        </Text>
        <button onClick={() => setShowDiagram(!showDiagram)} className={styles['toggle-view']}>
          {showDiagram ? (
              <Clear />
            ) :
            <Chart />
          }
          {showDiagram ? 'Скрыть' : 'Показать'} {' '} диаграмму
        </button>
      </div>
      {showDiagram && (
        <div className={styles['toggle-body']}>
          <div className={styles['accordion-radio-body']}>
            <RadioGroup
              label="Статус пациентов"
              name="patientStatus"
              value={patientStatus}
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
          <div className={styles.chart}>
            <Bar options={patientsChartoptions} data={patientChartsData} />
          </div>
        </div>
      )}
      <form
        className={styles.form}
        onSubmit={onSubmit}>
        <ActionBar
          onPrevButtonClick={onPrevClick}
          prevBtnText="Назад"
          nextBtnText="Перейти к распределению остатка"
        />
      </form>
    </>
  )
}