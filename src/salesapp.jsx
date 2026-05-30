import { useState } from 'react'
import Papa from 'papaparse'
import Charts from './Charts'

function SalesApp() {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [fileName, setFileName] = useState('')
  const [cleanLog, setCleanLog] = useState([])

  const addLog = (msg) => {
    setCleanLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const handleClean = (action) => {
    let updated = [...data]

    if (action === 'missing') {
      let count = 0
      updated = updated.map(row => {
        const newRow = { ...row }
        headers.forEach(h => {
          if (!newRow[h] || newRow[h].toString().trim() === '') {
            const nums = data.map(r => parseFloat(r[h])).filter(v => !isNaN(v))
            newRow[h] = nums.length > 0
              ? (nums.reduce((a, b) => a + b) / nums.length).toFixed(2)
              : 'Unknown'
            count++
          }
        })
        return newRow
      })
      addLog(`Filled ${count} missing values`)
    }

    if (action === 'duplicates') {
      const seen = new Set()
      const before = updated.length
      updated = updated.filter(row => {
        const key = JSON.stringify(row)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      addLog(`Removed ${before - updated.length} duplicate rows`)
    }

    if (action === 'trim') {
      let count = 0
      updated = updated.map(row => {
        const newRow = { ...row }
        headers.forEach(h => {
          if (newRow[h] && newRow[h] !== newRow[h].trim()) {
            newRow[h] = newRow[h].trim()
            count++
          }
        })
        return newRow
      })
      addLog(`Trimmed whitespace in ${count} cells`)
    }

    if (action === 'case') {
      updated = updated.map(row => {
        const newRow = { ...row }
        headers.forEach(h => {
          if (newRow[h] && isNaN(newRow[h])) {
            newRow[h] = newRow[h].charAt(0).toUpperCase() + newRow[h].slice(1).toLowerCase()
          }
        })
        return newRow
      })
      addLog('Standardised text case across all text columns')
    }

    if (action === 'negatives') {
      const numCol = headers.find(h => /sales|revenue|amount|price/i.test(h))
      if (!numCol) {
        addLog('No sales/revenue column detected')
        return
      }
      const before = updated.length
      updated = updated.filter(r => parseFloat(r[numCol]) >= 0 || isNaN(parseFloat(r[numCol])))
      addLog(`Removed ${before - updated.length} rows with negative ${numCol}`)
    }

    setData(updated)
  }

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setHeaders(result.meta.fields)
        setData(result.data)
        setCleanLog([])
      }
    })
  }

  const handleFileInput = (e) => handleFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: 'white' }}>

      {/* Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid #1f2937'
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>📊 SalesStudio</span>
        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Data Analysis Dashboard</span>
      </nav>

      {/* Upload Zone */}
      {data.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem'
        }}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: '2px dashed #374151',
              borderRadius: '1rem',
              padding: '4rem',
              textAlign: 'center',
              maxWidth: '480px',
              width: '100%'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Drop your sales CSV here
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Supports any CSV with sales data
            </p>
            <label style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#111827',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Choose file
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Data Loaded */}
      {data.length > 0 && (
        <div style={{ padding: '2rem 2.5rem' }}>

          <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            ✅ Loaded <strong style={{ color: 'white' }}>{fileName}</strong> — {data.length} rows, {headers.length} columns
          </p>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              {
                label: 'Total Rows',
                value: data.length.toLocaleString(),
                color: '#a78bfa'
              },
              {
                label: 'Total Columns',
                value: headers.length,
                color: '#60a5fa'
              },
              {
                label: 'Missing Values',
                value: data.reduce((acc, row) =>
                  acc + headers.filter(h => !row[h] || row[h].toString().trim() === '').length, 0
                ).toLocaleString(),
                color: '#f87171'
              },
              {
                label: 'Duplicate Rows',
                value: (() => {
                  const seen = new Set()
                  let dups = 0
                  data.forEach(row => {
                    const key = JSON.stringify(row)
                    if (seen.has(key)) dups++
                    else seen.add(key)
                  })
                  return dups
                })(),
                color: '#fb923c'
              }
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '0.75rem',
                padding: '1.25rem 1.5rem'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '700', color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Data Table Preview */}
          <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #1f2937' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  {headers.map(h => (
                    <th key={h} style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: '#6b7280',
                      backgroundColor: '#111827',
                      borderBottom: '1px solid #1f2937',
                      whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #111827' }}>
                    {headers.map(h => (
                      <td key={h} style={{
                        padding: '9px 14px',
                        color: row[h] ? 'white' : '#ef4444',
                        whiteSpace: 'nowrap'
                      }}>
                        {row[h] || '(missing)'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '8px' }}>
            Showing first 10 of {data.length} rows
          </p>

          {/* Cleaning Section */}
          <div style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              🧹 Data Cleaning
            </h2>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {[
                { label: 'Fill missing values', action: 'missing' },
                { label: 'Remove duplicates', action: 'duplicates' },
                { label: 'Trim whitespace', action: 'trim' },
                { label: 'Standardise text case', action: 'case' },
                { label: 'Remove negative values', action: 'negatives' },
              ].map((btn) => (
                <button
                  key={btn.action}
                  onClick={() => handleClean(btn.action)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Clean Log */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              minHeight: '80px',
              fontSize: '0.8rem',
              color: '#6b7280'
            }}>
              {cleanLog.length === 0
                ? 'Cleaning actions will appear here...'
                : cleanLog.map((entry, i) => (
                    <div key={i} style={{
                      color: '#4ade80',
                      padding: '3px 0',
                      borderBottom: '1px solid #1f2937'
                    }}>
                      {entry}
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Charts */}
          <Charts data={data} headers={headers} />

        </div>
      )}

    </div>
  )
}

export default SalesApp