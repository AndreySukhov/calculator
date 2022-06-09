import { Text } from '../../../../components/base';
import styles from './styles.module.css'

export const Stepper = ({steps, onStepClick, activeStepIndex, prevStepsDisabled = false}) => {
  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {steps.map((step, i) => {
          const clickable = i <= activeStepIndex && !prevStepsDisabled
          return (
            <li key={step.id} className={styles['list-item']}>
              <button disabled={!clickable} className={styles.button} type="button" onClick={() => {
                if (activeStepIndex === i) {
                  return false
                }
                onStepClick(step.id)
              }}>
                <Text size="text--m--bold" className={styles.text} color={clickable ? 'primary' : 'disabled'}>
                  Шаг {i + 1}: {step.label}
                </Text>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}