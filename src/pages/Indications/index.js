import { Text } from '../../components/base';
import { indicationsData } from '../../data';
import styles from './styles.module.css'
import { Table} from '../../components/base/Table';
import headerLogo from '../../assets/images/header-logo.svg'

const indications = indicationsData.map((indication, i) => {
  return [i + 1, ...Object.values(indication).map((item) => {
    if (item === true) {
      return 'Да'
    }

    if (item === false) {
      return '-'
    }

    return item

  })]
})

export const Indications = () => {
  return (
    <div>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Показания к применению по основным ревматическим заболеваниям
      </Text>
      <Table
        heading={['№', 'МНН', 'РА', 'ПсА', 'СпА']}
        data={indications}
      />
    </div>
  )
}