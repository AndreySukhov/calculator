import { Stepper } from '../components/Stepper';
import { useEffect, useState } from 'react';
import { PackDistribution } from './PackDistribution';
import { ExpensesAnalys } from './ExpensesAnalys';
import { BalanceReminder } from './BalanceReminder';
import { ReportPreview } from './ReportPreview';
import { ReportSubmit } from './ReportSubmit';
import styles from './styles.module.css';
import axios from 'axios';


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


export const AnalysData = ({reportId}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [disabledStepper, setDisabledStepper] = useState(false);
  const [data, setData] = useState(null)
  const [reportSendStatus, setReportSendStatus] = useState('not-sent')

  const handleReportSubmit = async (email) => {
    const res = await axios.post('http://erelzi.fibonacci.digital/api/v1/history', {
      email,
      report: data
    })

    if (res.status === 200) {
      setReportSendStatus('success')
    } else {
      setReportSendStatus('error')
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem(`${reportId}-report-id`)) {
      const reportLabel = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`)).stepLabel
      const activeIndex = steps.findIndex((item) => item.label === reportLabel)
      setActiveStepIndex(activeIndex)
      setData(JSON.parse(window.localStorage.getItem(`${reportId}-report-id`)))
    }
  }, [reportId])

  const handleSetStep = (id) => {
    const activeStep = steps.findIndex((step) => step.id === id)
    setActiveStepIndex(activeStep)
  }

  useEffect(() => {
    if (activeStepIndex === 4) {
      setDisabledStepper(true)
    }
  }, [activeStepIndex])

  return (
    <div className={styles.wrap} id="reportContent">
      <Stepper
        steps={steps}
        activeStepIndex={activeStepIndex}
        onStepClick={handleSetStep}
        prevStepsDisabled={disabledStepper}
      />
      {data && activeStepIndex === 0 && <PackDistribution
        reportData={data}
        reportId={reportId}
        stepLabel={steps[activeStepIndex].label}
        onSubmit={(data) => {
          setActiveStepIndex(1)
          setData(data)
        }}
      /> }
      {data && activeStepIndex === 1 && <ExpensesAnalys
        reportData={data}
        reportId={reportId}
        tradeIncrease={data.tradeIncrease}
        onSubmit={() => {
          setActiveStepIndex(2)
        }}
        onPrevClick={() => {
          setActiveStepIndex(0)
        }}
      />}
      {data && activeStepIndex === 2 && <BalanceReminder
        reportData={data}
        reportId={reportId}
        tradeIncrease={data.tradeIncrease}
        onSubmit={() => {
          setActiveStepIndex(3)
        }}
        onPrevClick={() => {
          setActiveStepIndex(1)
        }}
      />}
      {data && activeStepIndex === 3 && <ReportPreview
        reportData={data}
        reportId={reportId}
        regionId={data.regionId}
        tradeIncrease={data.tradeIncrease}
        stepLabel={steps[activeStepIndex].label}
        onSubmit={() => {
          setActiveStepIndex(4)
        }}
        onPrevClick={() => {
          setActiveStepIndex(2)
        }}
      />}
      {data && activeStepIndex === 4 && <ReportSubmit
        reportData={data}
        reportId={reportId}
        regionId={data.regionId}
        tradeIncrease={data.tradeIncrease}
        stepLabel={steps[activeStepIndex].label}
        onSubmit={(email) => handleReportSubmit(email)}
        onPrevClick={() => {}}
        reportSendStatus={reportSendStatus}
      />}
    </div>
  )
}