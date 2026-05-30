function SalesApp() {
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem'
      }}>
        <div style={{
          border: '2px dashed #374151',
          borderRadius: '1rem',
          padding: '4rem',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Drop your sales CSV here
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Supports any CSV with sales data
          </p>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#111827',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none'
          }}>
            Choose file
          </button>
        </div>
      </div>

    </div>
  )
}

export default SalesApp
