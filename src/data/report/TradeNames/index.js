import jsonData from './tradeNames.json';
import metoJectJson from './metoJect.json'
import tradeEfficiency from './ efficiency.json';

export const tradeNamesData = JSON.parse(JSON.stringify(jsonData)).sort((a, b) => a.label.localeCompare(b.label))
export const metoJectData = JSON.parse(JSON.stringify(metoJectJson))
export const tradeEfficiencyData = JSON.parse(JSON.stringify(tradeEfficiency))