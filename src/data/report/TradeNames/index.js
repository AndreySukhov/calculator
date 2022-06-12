import jsonData from './tradeNames.json';

export const tradeNamesData = JSON.parse(JSON.stringify(jsonData)).sort((a,b) => a.label - b.label)