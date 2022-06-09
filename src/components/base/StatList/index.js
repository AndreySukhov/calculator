import { Text } from '../typography/Text';
import style from './styles.module.css'

export const StatList = ({data}) => {
  return (
    <div className={style.box}>
      {data.map((item, i) => {
        return (
          <div className={style['row']} key={i}>
            {item.title && (
              <Text size="xl-bold" className={style.title} color="info">
                {item.title}
              </Text>
            )}
            {item.text && (
              <Text size="m" className={style.text} color="info">
                {item.text}
              </Text>
            )}
          </div>
        )
      })}
    </div>
  )
}