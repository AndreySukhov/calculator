import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text, Input } from '../../../../../components/base';
import styles from './styles.module.css'

export const Confirm = ({ reportSendStatus, onSubmit, onCancel }) => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate();

  if (reportSendStatus === 'error') {
    return (
      <div className={styles.tc}>
        <Text color="error" size="xxl" className={styles.title}>
          Ошибка при отправке отчета
        </Text>
      </div>
    )
  }

  if (reportSendStatus === 'success') {
    return (
      <div className={styles.tc}>
        <Text color="info" size="xxl" className={styles.title}>
          Отчет отправлен
        </Text>
        <div className={styles['button-row']}>
          <Button onClick={() => navigate('/')} theme="primary" disabled={!email}>
            На главную
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tc}>
      <Text color="blue" size="xxl" className={styles.title}>
        Укажите почту, на которую требуется отправить сгенерированный отчёт
      </Text>
      <div className={styles.text}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Ваш Email"
        />
      </div>
      <div className={styles['button-row']}>
        <Button onClick={onCancel} theme="bordered">
          Отмена
        </Button>
        <Button onClick={() => onSubmit(email)} theme="primary" disabled={!email}>
          Подтвердить
        </Button>
      </div>
    </div>
  )
}