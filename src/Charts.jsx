import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

function Charts({ data, headers }) {

  const salesCol = headers.find(h => /sales|revenue|amount/i.test(h))
  const dateCol = headers.find(h => /date|time/i.test(h))
  const storeCol = headers.find(h => /store|branch|location/i.test(h))
  const tempCol = headers.find(h => /temp/i.test(h))
  const holidayCol = headers.find(h => /holiday|flag/i.test(h))

  const cardStyle = {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '0.75rem',
    padding: '1.25rem'
  }

  const labelStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  }

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: '#1f2937',
      border: 'none',
      borderRadius: '8px',
      color: 'white'
    }
  }

  const gridStyle = { strokeDasharray: '3 3', stroke: '#1f2937' }
  const tickStyle = { fill: '#6b7280', fontSize: 10 }

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        📈 Visualisations
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Chart 1 — Sales over time */}
        {salesCol && dateCol && (
          <div style={cardStyle}>
            <p style={labelStyle}>Sales Over Time</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.slice(0, 100)}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey={dateCol} tick={tickStyle} interval={10} />
                <YAxis tick={tickStyle} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey={salesCol} stroke="#a78bfa" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 2 — Avg sales per store */}
        {salesCol && storeCol && (
          <div style={cardStyle}>
            <p style={labelStyle}>Avg Sales per Store</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={
                Object.entries(
                  data.reduce((acc, row) => {
                    const key = row[storeCol]
                    if (!acc[key]) acc[key] = { total: 0, count: 0 }
                    acc[key].total += parseFloat(row[salesCol]) || 0
                    acc[key].count += 1
                    return acc
                  }, {})
                )
                .map(([store, val]) => ({
                  Store: `S${store}`,
                  Avg: Math.round(val.total / val.count)
                }))
                .slice(0, 20)
              }>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="Store" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="Avg" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 3 — Temperature vs Sales */}
        {salesCol && tempCol && (
          <div style={cardStyle}>
            <p style={labelStyle}>Temperature vs Sales</p>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey={tempCol} name="Temperature" tick={tickStyle} />
                <YAxis dataKey={salesCol} name="Sales" tick={tickStyle} />
                <Tooltip {...tooltipStyle} />
                <Scatter
                  data={data.slice(0, 300).map(r => ({
                    [tempCol]: parseFloat(r[tempCol]),
                    [salesCol]: parseFloat(r[salesCol])
                  }))}
                  fill="#4ade80"
                  opacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 4 — Holiday vs Non-Holiday */}
        {salesCol && holidayCol && (
          <div style={cardStyle}>
            <p style={labelStyle}>Holiday vs Non-Holiday Sales</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={
                (() => {
                  const groups = data.reduce((acc, row) => {
                    const key = row[holidayCol] === '1' ? 'Holiday' : 'Non-Holiday'
                    if (!acc[key]) acc[key] = { total: 0, count: 0 }
                    acc[key].total += parseFloat(row[salesCol]) || 0
                    acc[key].count += 1
                    return acc
                  }, {})
                  return Object.entries(groups).map(([name, val]) => ({
                    name,
                    Avg: Math.round(val.total / val.count)
                  }))
                })()
              }>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="name" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="Avg" fill="#fb923c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  )
}

export default Charts