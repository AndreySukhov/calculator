import { useState, useMemo } from 'react';
import { Text, Input } from '../../../../components/base';
import { regionsData } from '../../../../data';
import { ActionBar } from '../../components/ActionBar';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import styles from './styles.module.css';
import headerLogo from '../../../../assets/images/header-logo.svg';

import { ReactComponent as Clear } from '../../../../assets/images/clear-bordered.svg';
import { ReactComponent as Chart } from '../../../../assets/images/chart-bordered.svg';

const getIncreaseVal = (price, increase) => {
  if (increase <= 0) {
    return Number(price)
  }
  return Number(price) + Number(price*increase/100)
}

const getPriceWithIncrease = (price, increase) => {

  return getLocalCurrencyStr(getIncreaseVal(price, increase));
}

const getPriceWithNds = (price, increase) => {
  return getLocalCurrencyStr(getIncreaseVal(price, increase) * 1.1);
}

export const SetPrice = ({regionId, onPrevButtonClick, tradeNamesOptions, onSubmit, rootIncrease = 0}) => {

  const [tradeIncrease, setTradeIncrease] = useState(rootIncrease);
  const [isFull, setIsFull] = useState(false);
  const regionTitle = useMemo(() => {
    const regionData = regionsData.find((region) => {
      return region.id === regionId
    })

    if (!regionData) {
      return 'Федеральный уровень'
    }
    return regionData.label
  }, [regionId])

  const isFederal = regionId === 0
  const hasTradeIncrease = !!(tradeIncrease && tradeIncrease !== 0) || isFederal

  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Установите цены на ТН ЛП
      </Text>
      <Text className={styles.description} size="text--l-regular" color="info">
        Итоговые цены из этого раздела будут использоваться в анализе затрат и влияния на бюджет.
        В расчёте итоговой цены ТН ЛП используется НДС 10% и оптовая надбавка для анализируемого региона.
      </Text>
      <div className={styles['increase-wrap']}>
        <Text size="xl-bold" color="info" className={styles['increase-title']}>
          Оптовая надбавка
        </Text>
        <div className={styles['increase-body']}>
          <Text size="l-regular" color="info" className={styles['increase-region']}>
            ({regionTitle})
          </Text>
          {!isFederal && (
            <div className={styles['increase-input']}>
              <Input
                readOnly={regionId === 0}
                type="number"
                min={0}
                max={100}
                disabled={regionId === 0}
                value={hasTradeIncrease ? tradeIncrease : '-'} onChange={(e) => {
                const val = e.target.value

                if (val < 0  || val > 100) {
                  return false
                }

                setTradeIncrease(e.target.value)
              }}
              />
            </div>
          )}
          <Text size="xl" color="info">
            {isFederal && '0 '}%
          </Text>
        </div>
      </div>
      <Text size="xl-bold" color="info">
        Итоговая цена за упаковку ТН ЛП
      </Text>
      <button onClick={() => setIsFull(!isFull)} className={styles['toggle-view']}>
        {isFull ? (
          <Clear />
        ) :
          <Chart />
        }
        {isFull ? 'Скрыть' : 'Показать'} {' '} данные о форме выпуска
      </button>
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th>
              <Text size="l">
                №
              </Text>
            </th>
            <th>
              <Text size="l">
                ТН
              </Text>
            </th>
            {isFull && (
              <>
                <th>
                  <Text size="l">
                    МНН
                  </Text>
                </th>
                <th>
                  <Text size="l">
                    Введение
                  </Text>
                </th>
                <th>
                  <Text size="l">
                    Форма выпуска
                  </Text>
                </th>
                <th>
                  <Text size="l">
                    Кол-во единиц в упаковке
                  </Text>
                </th>
              </>
            )}
            <th>
              <Text size="l">
                Цена за упаковку (ЖНВЛП)
              </Text>
            </th>
            {!isFederal && (
              <th>
                <Text size="l">
                  Локальная цена (с опт. надбавкой)
                </Text>
              </th>
            )}
            <th>
              <Text size="l">
                Итоговая цена (с НДС)
              </Text>
            </th>
          </tr>
          </thead>
          <tbody>
          {tradeNamesOptions.map((option, i) => {
            return (
              <tr key={option.label}>
                <td>
                  <Text size="m" color="info">
                    {i + 1}
                  </Text>
                </td>
                <td>
                  <Text size="m" color="info">
                    {option.label}
                  </Text>
                </td>
                {isFull && (
                  <>
                    <td>
                      <Text size="m" color="info">
                        {option.mnn}
                      </Text>
                    </td>
                    <td className={styles.application}>
                      <Text size="m" color="info">
                        {option.application}
                      </Text>
                    </td>
                    <td>
                      <Text size="m" color="info">
                        {option.productionForm}
                      </Text>
                    </td>
                    <td>
                      <Text size="m" color="info">
                        {option.itemsInPack}
                      </Text>
                    </td>
                  </>
                )}
                <td>
                  <Text size="m" color="info">
                    {getLocalCurrencyStr(option.pricePerPack)}
                  </Text>
                </td>
                {!isFederal && (
                  <td>
                    <Text size="m" color="info">
                      {hasTradeIncrease ? getPriceWithIncrease(option.pricePerPack, tradeIncrease) : '-'}
                    </Text>
                  </td>
                )}
                <td>
                  <Text size="m" color="info">
                    {hasTradeIncrease ? getPriceWithNds(option.pricePerPack, tradeIncrease) :  '-'}
                  </Text>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) =>{
        e.preventDefault()
        onSubmit(tradeIncrease)
      }}>
        <ActionBar
          onPrevButtonClick={onPrevButtonClick}
          prevBtnText="Назад"
          nextBtnText="Продолжить"
         />
      </form>
    </>
  )
}