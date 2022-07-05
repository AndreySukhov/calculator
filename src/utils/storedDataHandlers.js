import { regionsData } from '../data';


export const getStoredReportsLength = () => {
 return Object.keys(localStorage).filter((key) => key.includes('report')).length
}

export const getStoredReports = () => {
 const storedKeys = Object.keys(localStorage).filter((key) => key.includes('report'))

 return storedKeys.map((key) => {
  const report = JSON.parse(localStorage.getItem(key))
  return {
   ...report,
   regionLabel: regionsData.find((region) => region.id === report.regionId).label,
   date: key.replace('-report-id', '')
  }
 }).sort((a,b) => {
  return b.date - a.date
 })
}