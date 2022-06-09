import { Button } from '../../../../components/base';
import styles from './styles.module.css'

export const ActionBar = ({
  onPrevButtonClick = () => {},
  prevBtnText,
  nextBtnText,
  nextBtnDisabled = false,
  children
}) => {
  return (
    <div className={styles.wrap}>
      {children}
      {prevBtnText && <Button theme="bordered" type="button" onClick={onPrevButtonClick}>{prevBtnText}</Button>}
      {nextBtnText && <Button theme="primary" type="submit" disabled={nextBtnDisabled}>{nextBtnText}</Button>}
    </div>
  )
}