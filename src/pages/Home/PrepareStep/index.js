import { Link } from 'react-router-dom';
import { Text, Input, Button } from '../../../components/base';
import styles from './styles.module.css'
import pen from '../../../assets/images/index/pen.svg'
import report from '../../../assets/images/index/report.svg'
import { useState } from 'react';

export const PrepareStep = () => {
  return (
    <div className={styles.component}>
      <Text size="xxl" color="blue" className={styles.title}>
        Выберите данные для работы с моделью
      </Text>
      <Text className={styles.text} size="l-regular">
        Вы можете создать отчёт на основе данных из другого готового отчёта,
        <br/>
        либо заполнить данные с нуля, вручную.
      </Text>
      <div>
        <Link to="/reports/new" className={styles.link}>
          <img src={pen} alt=""/>
          <Text size="xl">
            Ввести данные вручную
          </Text>
        </Link>
        <Link to="/reports?useReady=1" className={styles.link}>
          <img src={report} alt=""/>
          <Text size="xl">
            Использовать готовый отчёт
          </Text>
        </Link>
      </div>
    </div>
  )
}