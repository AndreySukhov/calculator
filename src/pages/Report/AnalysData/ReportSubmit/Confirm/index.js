import { useState } from 'react';
import { Button, Text, Input } from '../../../../../components/base';
import styles from './styles.module.css'

export const Confirm = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('')
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