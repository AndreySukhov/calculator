export const getPatientStatusText = (status) => {
  if (status === 'first') {
    return 'Получают лечение впервые (новички)'
  }

  return 'Продолжают лечение'
}