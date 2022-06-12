import { Formik } from 'formik';
import { Text } from '../../../../components/base';
import { tradeNamesData } from '../../../../data';
import { ActionBar } from '../../components/ActionBar';
import styles from './styles.module.css';
import headerLogo from '../../../../assets/images/header-logo.svg';
import { Checkbox } from '../../../../components/base/forms/Checkbox';
import { ReactComponent as Cross } from '../../../../assets/images/cross.svg';

const initialValues = tradeNamesData.map((tradeName) => {
  return {
    label: tradeName.label,
    psa: tradeName.psa.defaultChecked,
    ra: tradeName.ra.defaultChecked,
    spa: tradeName.spa.defaultChecked
  }
})

export const TradeNameChoose = ({onSubmit, onPrevButtonClick}) => {
  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Выберите торговые названия (ТН), для которых нужно провести анализ
      </Text>
      <Formik initialValues={{
        options: initialValues
      }}
          onSubmit={(values) => {
            const filtered = values.options.filter((option) => {
              return option.psa || option.ra || option.spa
            }).map((option) => {
              const fullData = tradeNamesData.find((item) => {
                return option.label === item.label
              })
              return {
                ...fullData,
                psa: {
                  ...fullData.psa,
                  checked: option.psa
                },
                ra: {
                  ...fullData.ra,
                  checked: option.ra
                },
                spa: {
                  ...fullData.spa,
                  checked: option.spa
                }
              }
            })
          onSubmit(filtered)
        }}
      >{({
           values,
           handleSubmit,
           setFieldValue
         }) => {
        const options = values.options

        const handleChange = (e) => {
          const value = e.target.value;

          const split = value.split('-')
          const label = split[0]
          const param = split[1]

          const current = tradeNamesData.find((tradeName) => tradeName.label === label);

          const newVal = options.map((option) => {
            if (option.label === label) {
              const updatedOption = option

              return {
                ...updatedOption,
                psa: !updatedOption[param] && !current.psa.disabled,
                ra: !updatedOption[param] && !current.ra.disabled,
                spa: !updatedOption[param] && !current.spa.disabled
              }
            }

            return option
          })
          setFieldValue('options', newVal)
        }

        return (
          <form onSubmit={handleSubmit} className={styles.form}>
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
                      Тн
                    </Text>
                  </th>
                  <th>
                    <Text size="l">
                      ПсА
                    </Text>
                  </th>
                  <th>
                    <Text size="l">
                      РА
                    </Text>
                  </th>
                  <th>
                    <Text size="l">
                      СпА
                    </Text>
                  </th>
                </tr>
              </thead>
              <tbody>
              {tradeNamesData.map((tradeName, i) => {
                const current = options.find((option) => {
                  return option.label === tradeName.label
                })

                return (
                  <tr key={tradeName.label}>
                    <td>
                      <Text size="m">
                        {i + 1}
                      </Text>
                    </td>
                    <td>
                      <Text size="m">
                        {tradeName.label}
                      </Text>
                    </td>
                    <td>
                      <Checkbox
                        type="checkbox"
                        value={`${tradeName.label}-psa`}
                        name="tradeName"
                        disabled={tradeName.psa.disabled}
                        checked={current?.psa}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Checkbox
                        type="checkbox"
                        value={`${tradeName.label}-ra`}
                        name="tradeName"
                        disabled={tradeName.ra.disabled}
                        checked={current?.ra}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Checkbox
                        type="checkbox"
                        value={`${tradeName.label}-spa`}
                        name="tradeName"
                        disabled={tradeName.spa.disabled}
                        checked={current?.spa}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>


            <ActionBar
              onPrevButtonClick={onPrevButtonClick}
              prevBtnText="Назад"
              nextBtnText="Продолжить"
              nextBtnDisabled={JSON.stringify(options) === JSON.stringify(initialValues)}
            >
              <button
                type="button"
                className={styles['additional-btn']} onClick={() => setFieldValue('options', initialValues)}>
                <div className={`${styles['additional-btn-icon']} ${styles['additional-btn-icon-bordered']}`}>
                  <Cross />
                </div>
                <Text size="xl">
                  Очистить всё
                </Text>
              </button>
              <button
                type="button"
                className={styles['additional-btn']}
                onClick={() => {
                const checkedAll = tradeNamesData.map((tradeName) => {
                  return {
                    label: tradeName.label,
                    psa: !tradeName.psa.disabled || tradeName.psa.defaultChecked,
                    ra: !tradeName.ra.disabled || tradeName.ra.defaultChecked,
                    spa: !tradeName.spa.disabled || tradeName.spa.defaultChecked
                  }
                })

                setFieldValue('options', checkedAll)
              }}>
                <div className={styles['additional-btn-icon']}>
                  <Checkbox readonly checked />
                </div>
                <Text size="xl">
                  Выбрать всё
                </Text>
              </button>
            </ActionBar>
          </form>
        )
      }}

      </Formik>
    </>
  )
}