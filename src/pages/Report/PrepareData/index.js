import { useState, useEffect } from 'react';
import { Stepper } from '../components/Stepper';
import { ChooseRegion } from './ChooseRegion';
import { TradeNameChoose } from './TradeNameChoose';
import { SetPrice } from './SetPrice';
import { PackDistribution } from './PackDistribution';

import styles from './styles.module.css'

const steps = [{
  id: 0,
  label: 'Выбор уровня исследования',
}, {
  id: 1,
  label: 'Выбор ТН для анализа'
}, {
  id: 2,
  label: 'Установка цен'
}, {
  id: 3,
  label: 'Распределение упаковок и пациентов по нозологиям'
}]

export const PrepareData = ({reportId}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [regionId, setRegionId] = useState(null)
  const [tradeNamesOptions, setTradeNamesOptions] = useState([])
  const [tradeIncrease, setTradeIncrease] = useState(0)
  const isNew = reportId === 'new'

  useEffect(() => {
    if (window.localStorage.getItem(`${reportId}-report-id`)) {
      setTimeout(() => {
        const report = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`))
        setActiveStepIndex(3)
        setRegionId(report.regionId)
        setTradeIncrease(Number(report.tradeIncrease))
        setTradeNamesOptions(report.data)
      }, 100)
    }
  }, [reportId])

  const handleSetStep = (id) => {
    const activeStep = steps.findIndex((step) => step.id === id)
    setActiveStepIndex(activeStep)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStepIndex, reportId])

  return (
    <div className={styles.wrap}>
      <Stepper
        steps={steps}
        activeStepIndex={activeStepIndex}
        onStepClick={handleSetStep}
      />
      {activeStepIndex === 0 && <ChooseRegion
        isNew={isNew}
        rootRegion={regionId}
          onSubmit={(id) => {
          setRegionId(id)
          setActiveStepIndex(1)
        }} />}
      {activeStepIndex === 1 && <TradeNameChoose
        onSubmit={(options) => {
          setTradeNamesOptions(options)
          setActiveStepIndex(2)
        }}
        tradeNamesOptions={tradeNamesOptions}
        onPrevButtonClick={() => {
          setActiveStepIndex(0)
        }}
      />}
      {activeStepIndex === 2 && <SetPrice
        onSubmit={(increase) => {
          setTradeIncrease(increase)
          setActiveStepIndex(3)
        }}
        onPrevButtonClick={() => {
          setActiveStepIndex(1)
        }}
        tradeNamesOptions={tradeNamesOptions}
        regionId={regionId}
        rootIncrease={tradeIncrease}
      />}
      {activeStepIndex === 3 && <PackDistribution
        onPrevButtonClick={() => {
          setActiveStepIndex(2)
        }}
        regionId={regionId}
        tradeIncrease={tradeIncrease}
        tradeNamesOptions={tradeNamesOptions}
        stepLabel={steps[activeStepIndex].label}
      />}
    </div>
  )
}