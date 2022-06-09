import { Button, Text } from '../../../../../components/base';
import styles from './styles.module.css'

export const Confirm = ({ onSubmit, onCancel }) => {
  return (
    <div className={styles.tc}>
      <Text color="blue" size="xxl" className={styles.title}>
        Подтверждение согласования отчёта
      </Text>
      <Text color="info" size="l-regular" className={styles.text}>
        После согласования данные редактировать нельзя
      </Text>
      <div className={styles['button-row']}>
        <Button onClick={onCancel} theme="bordered">
          Отмена
        </Button>
        <Button onClick={onSubmit} theme="primary">
          Подтвердить
        </Button>
      </div>
    </div>
  )
}