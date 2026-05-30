function ExportButton({ data, headers, fileName, addLog }) {

  const exportCSV = () => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h] ?? '').join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cleaned_${fileName}`
    a.click()
    URL.revokeObjectURL(url)
    addLog(`Exported cleaned dataset as cleaned_${fileName}`)
  }

  return (
    <button
      onClick={exportCSV}
      style={{
        padding: '0.6rem 1.2rem',
        backgroundColor: '#4ade80',
        color: '#030712',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginLeft: 'auto'
      }}
    >
      ⬇ Export cleaned CSV
    </button>
  )
}

export default ExportButton