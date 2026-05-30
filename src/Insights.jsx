function Insights({ data, headers }) {

  const salesCol = headers.find(h => /sales|revenue|amount/i.test(h))
  const storeCol = headers.find(h => /store|branch|location/i.test(h))
  const holidayCol = headers.find(h => /holiday|flag/i.test(h))
  const tempCol = headers.find(h => /temp/i.test(h))

  const insights = []

  // Total revenue
  if (salesCol) {
    const total = data.reduce((a, r) => a + (parseFloat(r[salesCol]) || 0), 0)
    insights.push({
      icon: '',
      text: `Total ${salesCol}: ${total.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
      color: '#a78bfa'
    })
  }

  // Best performing store
  if (salesCol && storeCol) {
    const storeAvg = {}
    data.forEach(row => {
      const s = row[storeCol]
      if (!storeAvg[s]) storeAvg[s] = { total: 0, count: 0 }
      storeAvg[s].total += parseFloat(row[salesCol]) || 0
      storeAvg[s].count += 1
    })
    const best = Object.entries(storeAvg)
      .map(([store, val]) => ({ store, avg: val.total / val.count }))
      .sort((a, b) => b.avg - a.avg)[0]
    if (best) {
      insights.push({
        icon: '',
        text: `Best performing store: Store ${best.store} with avg ${best.avg.toLocaleString('en-GB', { maximumFractionDigits: 0 })} per week`,
        color: '#fbbf24'
      })
    }

    // Worst performing store
    const worst = Object.entries(storeAvg)
      .map(([store, val]) => ({ store, avg: val.total / val.count }))
      .sort((a, b) => a.avg - b.avg)[0]
    if (worst) {
      insights.push({
        icon: '',
        text: `Lowest performing store: Store ${worst.store} with avg ${worst.avg.toLocaleString('en-GB', { maximumFractionDigits: 0 })} per week`,
        color: '#f87171'
      })
    }
  }

  // Holiday vs non-holiday
  if (salesCol && holidayCol) {
    const groups = { holiday: { total: 0, count: 0 }, normal: { total: 0, count: 0 } }
    data.forEach(row => {
      const key = row[holidayCol] === '1' ? 'holiday' : 'normal'
      groups[key].total += parseFloat(row[salesCol]) || 0
      groups[key].count += 1
    })
    const holidayAvg = groups.holiday.count > 0 ? groups.holiday.total / groups.holiday.count : 0
    const normalAvg = groups.normal.count > 0 ? groups.normal.total / groups.normal.count : 0
    if (holidayAvg && normalAvg) {
      const diff = (((holidayAvg - normalAvg) / normalAvg) * 100).toFixed(1)
      insights.push({
        icon: '',
        text: `Holiday weeks sell ${Math.abs(diff)}% ${diff > 0 ? 'more' : 'less'} than non-holiday weeks`,
        color: '#4ade80'
      })
    }
  }

  // Average temperature
  if (tempCol) {
    const avg = data.reduce((a, r) => a + (parseFloat(r[tempCol]) || 0), 0) / data.length
    insights.push({
      icon: '',
      text: `Average temperature across dataset: ${avg.toFixed(1)}°`,
      color: '#60a5fa'
    })
  }

  // Dataset size insight
  insights.push({
    icon: '',
    text: `Dataset contains ${data.length.toLocaleString()} rows across ${headers.length} columns`,
    color: '#9ca3af'
  })

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
         Auto Insights
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        {insights.map((insight, i) => (
          <div key={i} style={{
            backgroundColor: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>{insight.icon}</span>
            <p style={{
              fontSize: '0.85rem',
              color: insight.color,
              lineHeight: '1.5',
              margin: 0
            }}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Insights