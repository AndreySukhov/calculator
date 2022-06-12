import { useParams } from 'react-router-dom';
import { PrepareData } from './PrepareData';
import { AnalysData } from './AnalysData';
import { Text } from '../../components/base';

import styles from './styles.module.css'

export const Report = () => {

  let { id } = useParams();
  const  step = id === 'new' ? 'prepareData' : 'analys'

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
            {step === 'prepareData' && <PrepareData />}
            {step === 'analys' && <AnalysData reportId={id} />}
          </div>
        </div>
      </div>
    </>
  )
}