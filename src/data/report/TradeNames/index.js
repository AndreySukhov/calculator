import jsonData from './tradeNames.json';
import metoJectJson from './metoJect.json'

export const tradeNamesData = JSON.parse(JSON.stringify(jsonData)).sort((a, b) => a.label.localeCompare(b.label))
export const metoJectData = JSON.parse(JSON.stringify(metoJectJson))