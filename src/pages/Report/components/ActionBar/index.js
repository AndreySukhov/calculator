import { Button } from '../../../../components/base';
import styles from './styles.module.css'

export const ActionBar = ({
  onPrevButtonClick = () => {},
  prevBtnText,
  nextBtnText,
  nextBtnDisabled = false,
  prevBtnDisabled = false,
  children
}) => {
  return (
    <div className={styles.wrap}>
      {children}
      {prevBtnText && <Button theme="bordered" type="button" disabled={prevBtnDisabled} onClick={onPrevButtonClick}>{prevBtnText}</Button>}
      {nextBtnText && <Button theme="primary" type="submit" disabled={nextBtnDisabled}>{nextBtnText}</Button>}
    </div>
  )
}