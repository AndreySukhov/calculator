import style from './styles.module.css'

export const Text = ({
  children,
  tag = 'div',
  className,
  size = 'm',
  color = 'primary'
}) => {
  const Tag = tag

  return (
    <Tag className={`${className} ${style.text} ${style[`text--${size}`]} ${style[`text--${color}`]}`}>
      {children}
    </Tag>
  )
}