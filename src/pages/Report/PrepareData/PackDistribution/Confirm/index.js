import { Text, Button } from '../../../../../components/base';

import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom';

export const Confirm = ({reportId}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <Text className={styles.title} color="blue" size="xxl" >
        Сохранение данных
      </Text>
      <Text className={styles.description} size="l-regular" color="info">
        Данные для проведения анализа успешно сохранены
      </Text>
      <div className={styles.buttons}>
        <Button theme="bordered" onClick={() => navigate('/')}>
          На главную
        </Button>
        <Button theme="primary" onClick={() => navigate(`/reports/${reportId}`)}>
          Перейти к анализу данных
        </Button>
      </div>
    </div>
  )
}