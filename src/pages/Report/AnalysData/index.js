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

  const handleReportSubmit = async (email, chartData) => {
    const content = document.getElementById('reportContent')
    const contentCopy = content.cloneNode(true)
    const script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.innerHTML = `

      const options = {
  indexAxis: 'y',
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const patientsOptions = {
  indexAxis: 'y',
  responsive: true,
};

const myChart = new Chart(document.getElementById('chart').getContext('2d'), {
  type: 'horizontalBar',
  data: {
    labels: ['Текущий', 'Планируемый'],
    datasets: ${JSON.stringify(chartData.chartData.datasets)},
  },
  options: options,
});

const myChart1 = new Chart(document.getElementById('chart-patient').getContext('2d'), {
  type: 'horizontalBar',
  data: {
      datasets: ${JSON.stringify(chartData.patientsData.datasets)},
      labels: ${JSON.stringify(chartData.patientsData.labels)}
  },
options: patientsOptions
})

const myChart2 = new Chart(document.getElementById('efficiency-patient').getContext('2d'), {
  type: 'horizontalBar',
  data: {
      datasets: ${JSON.stringify(chartData.efficiencyChartData.datasets)},
      labels: ${JSON.stringify(chartData.efficiencyChartData.labels)}
  },
options: patientsOptions
})

    `
    let div = document.createElement("div")
    div.append(contentCopy)
    div.append(script)

    fetch('http://erelzi.fibonacci.digital/api/v1/pdf', {
      headers: new Headers({
        'Accept': 'text/html;',
        'Content-Type': 'text/html;'
      }),
      mode: 'no-cors',
      method: 'POST',
      body: div.innerHTML
    })

    try {
      const res = await axios.post('http://erelzi.fibonacci.digital/api/v1/history', {
        email,
        report: data
      })
      if (res.status === 200) {
        setReportSendStatus('success')
      } else {
        setReportSendStatus('error')
        setTimeout(() => {
          setReportSendStatus('not-sent')
        }, 3000)
      }
    } catch (e) {
      setReportSendStatus('error')
      setTimeout(() => {
        setReportSendStatus('not-sent')
      }, 3000)

    }
  }

  useEffect(() => {
    if (window.localStorage.getItem(`${reportId}-report-id`)) {
      const reportLabel = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`)).stepLabel
      const activeIndex = steps.findIndex((item) => item.label === reportLabel)
      if (activeIndex !== -1) {
        setActiveStepIndex(activeIndex)
      }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStepIndex])


  return (
    <div className={styles.wrap}>
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
        onSubmit={(data) => {
          setData(data)
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
        onSubmit={(email, data, chartData) => {
          setData(setData)
          handleReportSubmit(email, chartData)
        }}
        onPrevClick={() => {}}
        reportSendStatus={reportSendStatus}
      />}
    </div>
  )
}