import { useState, useEffect } from 'react';

import { Text } from '../../components/base';
import styles from './styles.module.css'
import { Table } from '../../components/base/Table';
import { tradeNamesData } from '../../data';
import headerLogo from '../../assets/images/header-logo.svg';
import { RadioGroup } from '../../components/base/forms/RadioGroup';

export const Packages = () => {
  const [nosologia, setNosologia] = useState('ra');
  const [healType, setHealType] = useState('initial');
  const [data, setData] = useState(null)

  const handleFilter = (e) => {
    if (e.target.name === 'nosologia') {
      setNosologia(e.target.value)
    }

    if (e.target.name === 'heal_type') {
      setHealType(e.target.value)
    }
  }

  useEffect(() => {
    const res = tradeNamesData.map((pack) => {
      const temp = {
        label: pack.label,
        mnn: pack.mnn,
      }
      const filtered = pack[nosologia][healType]

      return {
        ...temp,
        ...filtered
      }
    }).map((pack, i) => [i + 1, ...Object.values(pack)])

    setData(res)
  }, [nosologia, healType])

  return (
    <div>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Упаковки по годам
      </Text>
      <div className={styles['filters-wrap']}>
        <ul className={styles['filters-list']}>
          <li className={styles['filters-list__item']}>
            <RadioGroup
              name="nosologia"
              label="Нозология"
              onChange={(e) => handleFilter(e)}
              value={nosologia}
              options={[
                {
                  value: 'ra',
                  label: 'РА'
                },
                {
                  value: 'psa',
                  label: 'ПсА'
                },
                {
                  value: 'spa',
                  label: 'СпА'
                }
              ]}
            />
          </li>
          <li className={styles['filters-list__item']}>
            <RadioGroup
              name="heal_type"
              label="Статус пациентов"
              onChange={(e) => handleFilter(e)}
              value={healType}
              options={[
                {
                  value: 'initial',
                  label: 'Получают лечение впервые'
                },
                {
                  value: 'secondary',
                  label: 'Продолжают лечение'
                }
              ]}
            />
          </li>
        </ul>
      </div>
      {data && <Table heading={['№', 'ТН', 'МНН', '1 год', '2 год', '3 год']} data={data} />}
    </div>
  )
}