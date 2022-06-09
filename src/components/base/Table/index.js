import { Text } from '../typography/Text';
import styles from './styles.module.css'

export const Table = ({
  heading = [],
  data = [],
}) => {
  return (
    <table className={styles.table}>
      {heading.length > 0 && (
        <thead>
          <tr className={styles.tr}>
            {heading.map((headItem) => {
              return (
                <th key={headItem}>
                  <Text color="info" className={styles.th}>
                    {headItem}
                  </Text>
                </th>
              )
            })}
          </tr>
        </thead>
      )}
      {data.length > 0 && (
        <tbody>
          {data.map((dataItem, i) => {
            return (
              <tr key={i} className={styles.tr}>
                {dataItem.map((child, j) => {
                  return (
                    <td key={j}>
                      <Text color="info" size="m">
                        {child}
                      </Text>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      )}
    </table>
  )
}