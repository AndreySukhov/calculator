import React, { useState } from 'react'

import { Text, Button, Input } from '../../components/base';

import styles from './styles.module.css';

export const Profile = () => {

  const [email, setEmail] = useState(() => {
    if (window.localStorage.getItem('userEmail')) {
      return window.localStorage.getItem('userEmail')
    }

    return ''
  })


  return (
    <>
      <Text size="l" className={styles.title}>
        Укажите почту для сохранения отчетов
      </Text>
      <div className={styles.controls}>
        <Input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button theme="primary" onClick={() => {
          window.localStorage.setItem('userEmail', email)
        }}>
          Сохранить
        </Button>
      </div>
    </>
  )
}