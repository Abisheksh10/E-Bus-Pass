// Helpers for preview; server still re-computes authoritatively
export function toISODate(d){ return new Date(d).toISOString().slice(0,10) } // YYYY-MM-DD

export function addDays(dateStr, days){
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

// End of period: weekly = +6 days (start day inclusive), monthly/yearly = add 1M/1Y then -1 day
export function computeExpiry(startDate, passType){
  if(!startDate) return null
  const d = new Date(startDate)
  if (passType === 'weekly'){
    return toISODate(addDays(startDate, 6))
  }
  if (passType === 'monthly'){
    const m = new Date(startDate)
    m.setMonth(m.getMonth() + 1)
    m.setDate(m.getDate() - 1)
    return toISODate(m)
  }
  if (passType === 'yearly'){
    const y = new Date(startDate)
    y.setFullYear(y.getFullYear() + 1)
    y.setDate(y.getDate() - 1)
    return toISODate(y)
  }
  return null
}

export function mmYYYY(dateStr){
  // convert ISO YYYY-MM-DD to MMYYYY
  const [y,m] = (dateStr||'').split('-')
  if(!y||!m) return ''
  return `${m}${y}`
}
