import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Input } from '../../../../components/base';
import { Formik } from 'formik';
import { regionsData } from '../../../../data';
import { ActionBar } from '../../components/ActionBar';
import { RadioGroup } from '../../../../components/base/forms/RadioGroup';
import { ReactComponent as Cross } from '../../../../assets/images/cross.svg';

import styles from './styles.module.css';
import headerLogo from '../../../../assets/images/header-logo.svg';

export const ChooseRegion = ({
  onSubmit,
  rootRegion
}) => {

  const [search, setSearch] = useState(() => {

    if (rootRegion) {
      const newRegion = regionsData.find((region) => {
        return region.id === rootRegion
      })

      if (newRegion) {
        return newRegion?.label
      }
    }

    return ''
  });
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);

  const navigate = useNavigate();

  const filteredItems = [...regionsData].filter((region) => {
    return region.label.toLowerCase().includes(search.toLowerCase())
  }).sort((a,b) => {
    if (a.label.toLowerCase().startsWith(search.toLowerCase())) {
      return -1
    }
    if (b.label.toLowerCase().startsWith(search.toLowerCase())) {
      return 1
    }
    return 0
  })

  return (
    <>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Выберите уровень исследования
      </Text>
      <Formik initialValues={{
        regionId: rootRegion || null,
        level: 'region'
      }}
      onSubmit={(values) => {
        onSubmit(parseInt(values.regionId,10))
      }}
      >{({
           values,
           handleSubmit,
           setFieldValue
         }) => {

        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <RadioGroup
                name="region"
                label="Уровень исследования"
                onChange={(e) => {
                  if (e.target.value === 'federal') {
                    setFieldValue('level', 'federal')
                    setFieldValue('regionId', 0)
                  } else  {
                    setFieldValue('level', 'region')
                    setFieldValue('regionId', null)
                  }
                }}
                value={values.level}
                options={[
                  {
                    value: 'federal',
                    label: 'Федеральный уровень'
                  },
                  {
                    value: 'region',
                    label: 'Регионы'
                  }
                ]}
              />
            </div>

            {values.level === 'region' && (
              <div className={styles['region-wrap']}>
                <div className={styles['region-label']}>
                  <Text size="xl-bold">
                    Укажите субъект РФ
                  </Text>
                </div>
                <div className={styles['region-body']}>
                  <div className={styles['autocomplete']}>
                    <Input
                      type="text"
                      value={search}
                      placeholder="Начните вводить название"
                      onChange={(e) => {
                        setSearch(e.target.value)
                      }}
                      onFocus={() => {
                        setAutocompleteVisible(true)
                      }}
                    />
                    {autocompleteVisible && search.length > 0 && (
                      <button type="button" className={styles['autocomplete-close']}
                              onClick={() => setSearch('')}>
                        <Cross />
                      </button>
                    )}
                    {autocompleteVisible && search.length > 0 && (
                      <ul className={styles['autocomplete-list']}>
                        {filteredItems.length > 0 ? (
                          <>
                            {filteredItems.map((region) => {
                              return (
                                <li key={region.id} className={styles['autocomplete-list-item']}>
                                  <button
                                    type="button"
                                    className={styles['autocomplete-btn']}
                                    onClick={() => {
                                      setFieldValue('regionId', parseInt(region.id))
                                      setSearch(region.label)
                                      setAutocompleteVisible(false)
                                    }}>
                                    {region.label}
                                  </button>
                                </li>
                              )
                            })}
                          </>
                        ) : (
                          <>
                          <li className={styles['autocomplete-list-item']}>
                            <Text className={styles['not-found']}>
                              Такого субъекта нет. Попробуйте ввести название ещё раз
                            </Text>
                          </li>
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
            <ActionBar
              onPrevButtonClick={() => navigate('/')}
              prevBtnText="Отмена"
              nextBtnText="Продолжить"
              nextBtnDisabled={!values.regionId && parseInt(values.regionId, 10) !== 0}
            />
          </form>
        )
      }}

      </Formik>
    </>
  )
}