import { Text, Button } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { useState } from 'react';
import { RadioGroup } from '../../../../components/base/forms/RadioGroup'
import { ReactModal } from '../../../../components/Modal';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import styles from './styles.module.css'
import headerLogo from '../../../../assets/images/header-logo.svg';
import { NosologiaChoice } from './NosologiaChoice';

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
import {
  getExpenseCurrentBudget,
  getExpensePercentDiff,
  getExpensePlanBudget,
  getSavedPerPatientMoney
} from '../calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true
};

export const BalanceReminder = ({onSubmit, onPrevClick, tradeIncrease, reportData, reportId}) => {
  const [nosologia, setNosologia] = useState('ra')
  const [patientStatus, setPatientStatus] = useState('first')
  const [showNosologiaChoice, setShowNosologiaChoice] = useState(false)
  const [nosologiaType, setNosologiaType] = useState('ra')

  const handleNosologiaFilter = (e) => {
    setNosologia(e.target.value)
  }

  const handlePatientStatus = (e) => {
    setPatientStatus(e.target.value)
  }

  const currentBudget = getExpenseCurrentBudget({
    nosologia,
    healYear: [1],
    data: reportData.data,
    tradeIncrease,
  });
  const planBudget = getExpensePlanBudget({
    nosologia,
    healYear: [1],
    data: reportData.data,
    tradeIncrease,
  });

  const patientsLabels = reportData.data.map(({label}) => label)

  const patientsData = {
    labels: patientsLabels,
    datasets: [
      {
        label: 'кол-во пациентов',
        data: patientsLabels.map((label) => {
          const current = reportData.data.find((reportItem) => reportItem.label === label)
          return getSavedPerPatientMoney({
            item: current,
            nosologia,
            patientStatus,
            tradeIncrease,
          })
        }),
        backgroundColor: '#4461A1',
      }
    ],
  };

  const dataSets = patientsLabels.map((label) => {
    const current = reportData.data.find((reportItem) => reportItem.label === label)

    return {
      label: current.label,
      backgroundColor: '#4461A1',
      data: [getSavedPerPatientMoney({
        item: current,
        nosologia,
        patientStatus,
        tradeIncrease,
      })]
    }
  })

  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Количество новых пациентов в рамках высвободившегося бюджета на планируемый период
      </Text>
      <div className={styles.row}>
        <Text size="m" className={styles['row-label']}>
          Высвобожденный бюджет
        </Text>
        <Text size="l">
          {getLocalCurrencyStr(currentBudget - planBudget)}
        </Text>
      </div>
      <div className={styles.row}>
        <div className={styles['radio-grid']}>
          <div>
            <RadioGroup
              label="Нозология"
              name="nosologia"
              onChange={(e) => handleNosologiaFilter(e)}
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
            />
          </div>
          <div>
            <RadioGroup
              label="Статус пациентов"
              name="patientStatus"
              onChange={(e) => handlePatientStatus(e)}
              value={patientStatus}
              options={[
                {
                  value: 'first',
                  label: 'Получают лечение впервые'
                },
                {
                  value: 'next',
                  label: 'Продолжают лечение'
                }
              ]}
            />
          </div>
        </div>
      </div>
      <div className={styles.chart}>
        <Bar options={options} data={patientsData} />
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
        e.preventDefault()
        setShowNosologiaChoice(true)
      }}>
        <ActionBar
          onPrevButtonClick={onPrevClick}
          prevBtnText="Назад"
          nextBtnText="Сгенерировать отчёт"
        />
      </form>
      {showNosologiaChoice && (
        <ReactModal onClose={() => setShowNosologiaChoice(false)}>
          <NosologiaChoice
            onCancel={() => setShowNosologiaChoice(false)}
            onSubmit={(val) => {
              const storedData = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`))

              const updatedData = {
                ...storedData,
                data: reportData.data,
                rootNosologia: val,
              }

              if (storedData) {
                window.localStorage.setItem(`${reportId}-report-id`, JSON.stringify(updatedData))
              }
              onSubmit(updatedData)
            }}
            defaultNosologiaType={nosologiaType}
          />
        </ReactModal>
      )}

    </>
  )
}