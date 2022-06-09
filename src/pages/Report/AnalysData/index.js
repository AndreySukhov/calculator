import { Stepper } from '../components/Stepper';
import { useEffect, useState } from 'react';
import { PackDistribution } from './PackDistribution';
import { ExpensesAnalys } from './ExpensesAnalys';
import { BalanceReminder } from './BalanceReminder';
import { ReportPreview } from './ReportPreview';
import { ReportSubmit } from './ReportSubmit';
import styles from './styles.module.css';


const steps = [{
  id: 0,
  label: 'Перераспределение упаковок и пациентов',
}, {
  id: 1,
  label: 'Анализ затрат'
}, {
  id: 2,
  label: 'Распределение остатка'
}, {
  id: 3,
  label: 'Предпросмотр отчёта'
}, {
  id: 4,
  label: 'Отправление отчёта'
}]

const stub = [{"packages":0,"patients":0,"packsPsa":"","packsRa":"","packsSpa":"","patientsPsa":"","patientsRa":"","patientsSpa":"","label":"Актемра","psa":{"disabled":false,"defaultChecked":false,"checked":true},"ra":{"disabled":false,"defaultChecked":false,"checked":false},"spa":{"disabled":false,"defaultChecked":false,"checked":false},"mnn":"Тоцилизумаб","application":"Подкожно","productionForm":"162мг/0,9мл","itemsInPack":4,"pricePerPack":"53053.50"},{"packages":0,"patients":0,"packsPsa":"","packsRa":"","packsSpa":"","patientsPsa":"","patientsRa":"","patientsSpa":"","label":"Артлегиа","psa":{"disabled":false,"defaultChecked":false,"checked":true},"ra":{"disabled":true,"defaultChecked":false,"checked":false},"spa":{"disabled":true,"defaultChecked":false,"checked":false},"mnn":"Олокизумаб","application":"Подкожно","productionForm":"160мг/мл 0,4мл","itemsInPack":1,"pricePerPack":"39000"},{"packages":0,"patients":0,"packsPsa":"","packsRa":"","packsSpa":"","patientsPsa":"","patientsRa":"","patientsSpa":"","label":"Далибра","psa":{"disabled":true,"defaultChecked":true,"checked":true},"ra":{"disabled":true,"defaultChecked":true,"checked":true},"spa":{"disabled":true,"defaultChecked":true,"checked":true},"mnn":"Адалимумаб","application":"Подкожно","productionForm":"40мг/0,8мл 0,8мл","itemsInPack":2,"pricePerPack":"33873.31"}]

export const AnalysData = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [packDistribution, setPackDistribution] = useState([]);
  const [disabledStepper, setDisabledStepper] = useState(false);

  const handleSetStep = (id) => {
    const activeStep = steps.findIndex((step) => step.id === id)
    setActiveStepIndex(activeStep)
  }

  useEffect(() => {
    if (activeStepIndex === 0) {
      setPackDistribution([])
    }
  }, [activeStepIndex])

  useEffect(() => {
    if (activeStepIndex === 4) {
      setDisabledStepper(true)
    }
  }, [activeStepIndex])

  return (
    <div className={styles.wrap}>
      <Stepper
        steps={steps}
        activeStepIndex={activeStepIndex}
        onStepClick={handleSetStep}
        prevStepsDisabled={disabledStepper}
      />
      {activeStepIndex === 0 && <PackDistribution
        onSubmit={(data) => {
          setActiveStepIndex(1)
          setPackDistribution(data)
        }}
        tradeNamesOptions={stub}
      /> }
      {activeStepIndex === 1 && <ExpensesAnalys
        onSubmit={(data) => {
          setActiveStepIndex(2)
        }}
        onPrevClick={() => {
          setActiveStepIndex(1)
        }}
      />}
      {activeStepIndex === 2 && <BalanceReminder
        onSubmit={(data) => {
          setActiveStepIndex(3)
        }}
        onPrevClick={() => {
          setActiveStepIndex(2)
        }}
      />}
      {activeStepIndex === 3 && <ReportPreview
        data={stub}
        onSubmit={(data) => {
          setActiveStepIndex(4)
        }}
        onPrevClick={() => {
          setActiveStepIndex(3)
        }}
      />}
      {activeStepIndex === 4 && <ReportSubmit data={stub} />}
    </div>
  )
}