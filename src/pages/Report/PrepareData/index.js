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

export const PrepareData = ({onComplete}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [regionId, setRegionId] = useState(null)
  const [tradeNamesOptions, setTradeNamesOptions] = useState([])
  const [tradeIncrease, setTradeIncrease] = useState(0)

  const handleSetStep = (id) => {
    const activeStep = steps.findIndex((step) => step.id === id)
    setActiveStepIndex(activeStep)
  }

  useEffect(() => {
    if (activeStepIndex === 0 || activeStepIndex === 1) {
      setTradeNamesOptions([])
      setTradeIncrease(0)
    }
    if (activeStepIndex === 0 || activeStepIndex === 1 || activeStepIndex === 2) {
      setTradeIncrease(0)
    }
  }, [activeStepIndex])

  return (
    <div className={styles.wrap}>
      <Stepper
        steps={steps}
        activeStepIndex={activeStepIndex}
        onStepClick={handleSetStep}
      />
      {activeStepIndex === 0 && <ChooseRegion onSubmit={(id) => {
        setRegionId(id)
        setActiveStepIndex(1)
      }} />}
      {activeStepIndex === 1 && <TradeNameChoose
        onSubmit={(options) => {
          setTradeNamesOptions(options)
          setActiveStepIndex(2)
        }}
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
      />}
      {activeStepIndex === 3 && <PackDistribution
        onPrevButtonClick={() => {
          setActiveStepIndex(2)
        }}
        onSubmit={() => {
          onComplete({
            regionId,
            tradeNamesOptions,
            tradeIncrease
          })
        }}
        tradeNamesOptions={tradeNamesOptions}
      />}
    </div>
  )
}