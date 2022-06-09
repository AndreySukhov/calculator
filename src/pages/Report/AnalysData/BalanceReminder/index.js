import { Text, Button } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { useState } from 'react';
import { RadioGroup } from '../../../../components/base/forms/RadioGroup'
import { ReactModal } from '../../../../components/Modal';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import styles from './styles.module.css'
import headerLogo from '../../../../assets/images/header-logo.svg';
import { NosologiaChoice } from './NosologiaChoice';

export const BalanceReminder = ({onSubmit, onPrevClick}) => {
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
          {getLocalCurrencyStr(18398394)}
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
              setNosologiaType(val)
              onSubmit(val)
            }}
            defaultNosologiaType={nosologiaType}
          />
        </ReactModal>
      )}

    </>
  )
}