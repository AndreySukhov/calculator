import styles from './styles.module.css'

export const Input = ({
  value,
  type = 'text',
  className,
  error,
  readOnly,
  ...rest
}) => {
  return (
    <input type={type} {...rest} readOnly={readOnly}
           value={value}
           className={`${styles.input}  ${className} ${error ? styles.error : ''}`} />
  )
}