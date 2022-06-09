import { Text } from '../../typography/Text';

import styles from './styles.module.css'

export const RadioGroup = ({label, options, onChange, name, value}) => {
  return (
    <div className={styles.wrap}>
      {label && (
        <div className={styles.label}>
          <Text size="xl-bold">
            {label}
          </Text>
        </div>
      )}
      <div>
        {options.map((option) => {
          return (
            <div className={styles['filter__options-item']} key={option.value}>
              <label className={styles['radio']}>
                <input type="radio" name={name}
                       onChange={(e) => onChange(e)}
                       checked={value === option.value}
                       value={option.value} className={styles['radio__input']}/>
                <div className={styles['radio-placeholder']}>
                  <div className={styles['radio-placeholder-label']} />
                </div>
                <Text className={styles['radio__label']} size="m">
                  {option.label}
                </Text>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}