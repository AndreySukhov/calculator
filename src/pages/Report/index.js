import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PrepareData } from './PrepareData';
import { AnalysData } from './AnalysData';
import { Text } from '../../components/base';

import styles from './styles.module.css'

export const Report = () => {

  let { id } = useParams();
  const [step, setStep] = useState(id === 'new' ? 'prepareData' : 'analys')
  const [prepareStepData, setPrepareStepData] = useState({})

  const isPrepare = step === 'prepareData'

  return (
    <>
      <div className={styles.nav}>
        <div className={`${styles['nav-item']} ${!isPrepare ? `${styles['nav-item--disabled']}` : ''}`}>
          <Text color={isPrepare ? 'primary' : 'disabled'} size="xl">
            Подготовка данных
          </Text>
        </div>
        <div className={`${styles['nav-item']} ${isPrepare ? `${styles['nav-item--disabled']}` : ''}`}>
          <Text color={!isPrepare ? 'primary' : 'disabled'} size="xl">
            Анализ данных
          </Text>
        </div>
      </div>
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.main}>
            {step === 'prepareData' && <PrepareData onComplete={(data) => {
              setStep('analys')
              setPrepareStepData(data)
            }} />}
            {step === 'analys' && <AnalysData />}
          </div>
        </div>
      </div>
    </>
  )
}