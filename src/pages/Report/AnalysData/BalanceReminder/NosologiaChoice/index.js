import { useState } from 'react'
import { Button, Text } from '../../../../../components/base';
import { RadioGroup } from '../../../../../components/base/forms/RadioGroup';
import styles from './styles.module.css'

export const NosologiaChoice = ({
  onSubmit,
  onCancel,
  defaultNosologiaType
}) => {
  const [nosologiaType, setNosologiaType] = useState(defaultNosologiaType);
  const handleNosologiaTypeFilter = (e) => {
    setNosologiaType(e.target.value)
  }

 return (
   <div className={styles.wrap}>
     <Text className={styles.title} color="blue" size="xxl">
       Выберите нозологию, для которой нужно сделать отчёт
     </Text>
     <div className={styles['radio-body']}>
       <RadioGroup
        name="nosologiaType"
        value={nosologiaType}
        options={[
          {
            label: 'Ревматоидный артрит (РА)',
            value: 'ra'
          },
          {
            label: 'Псориатический артрит (ПсА)',
            value: 'psa'
          },
          {
            label: 'Спондилоартрит (СпА)',
            value: 'spa'
          }
        ]}
        onChange={(e) => handleNosologiaTypeFilter(e)}
       />
     </div>
     <div className={styles['buttons-row']}>
       <Button onClick={onCancel} theme="bordered">
         Отмена
       </Button>
       <Button onClick={() => {
         onSubmit(nosologiaType)
       }} theme="primary">
         Выбрать
       </Button>
     </div>
   </div>
 )
}