import { useState } from 'react';
import { Text, Button } from '../../components/base';
import { PrepareStep } from './PrepareStep';
import visual from '../../assets/images/index/index-visual.png'

import styles from './styles.module.css'
import { ReactModal } from '../../components/Modal';

export const Home = ({userEmail, setUserEmail}) => {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div className={styles.wrap}>
      <Text className={styles.title} size="3xl" color="blue">
        Фармакоэкономическая модель для оценки лечения ревматоидного артрита (РА),  псориатического артрита (ПсА)
        и спондилоартрита (СпА) современными ГИБП
      </Text>
      <div className={styles.btn}>
        <Button onClick={() => setModalOpen(!modalOpen)} theme="primary">
          Приступить к работе
        </Button>
      </div>
      <div className={styles.visual}>
        <img src={visual} alt=""/>
      </div>
      {modalOpen &&
      <ReactModal onClose={() => setModalOpen(false)}>
        <PrepareStep userEmail={userEmail} setUserEmail={setUserEmail} />
      </ReactModal>
      }
    </div>
  )
}