import { forwardRef } from 'react';
import styles from './styles.module.css'

export const Input = forwardRef(({
  value,
  type = 'text',
  className,
  readOnly,
  ...rest
}, ref) => {
  return (
    <input type={type} {...rest} readOnly={readOnly}
           value={value} ref={ref} className={`${styles.input}  ${className}`} />
  )
})