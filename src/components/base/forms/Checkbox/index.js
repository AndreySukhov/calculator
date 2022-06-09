import styles from './styles.module.css'
import { ReactComponent as Check} from './check.svg';


export const Checkbox = ({value, onChange, disabled, ...rest}) => {
  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''} `}>
      <input type="checkbox" value={value} onChange={onChange} disabled={disabled} {...rest} className={styles.checkbox} />
      <div className={styles.mark}>
        <Check />
      </div>
    </label>
  )
}