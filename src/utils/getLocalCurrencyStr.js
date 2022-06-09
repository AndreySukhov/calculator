export const getLocalCurrencyStr = (num) => {
  const res = Number(num).toLocaleString('ru', {
    style: 'currency',
    currency: 'rub',
  })

  const splitVal = res.split(',')
  if (splitVal.length > 1) {
    return `${splitVal[0]} ₽`
  }

  return res
}