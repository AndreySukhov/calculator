import styles from './styles.module.css'

export const Button = ({children, type = "button", theme, disabled = false, onClick = () => {}}) => {
  return (
    <button
      className={`${styles.button} ${styles[`button--${theme}`]}`}
      type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}