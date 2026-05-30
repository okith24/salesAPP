import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SalesApp from './SalesApp'

function LandingPage({ onProceed }) {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="flex justify-between items-center px-10 py-6">
        <span className="text-lg font-semibold tracking-tight">📊 SalesStudio</span>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 leading-tight max-w-3xl">
          Sales Analysis Studio
        </h1>
        <p className="mt-4 text-lg text-gray-400 whitespace-nowrap">
          Upload your sales data. Clean it. Visualise it. Understand it.
        </p>

        {/* Proceed Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onProceed}
          style={{
            marginTop: '2.5rem',
            padding: '1rem 3rem',
            backgroundColor: '#111827',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '1.1rem',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none',
            letterSpacing: '0.05em'
          }}
        >
          Proceed →
        </motion.button>
      </div>

      {/* Wave */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          <path
            d="M0,100 C200,160 400,40 600,100 C800,160 1000,40 1200,100 C1300,130 1380,90 1440,100 L1440,200 L0,200 Z"
            fill="url(#waveGrad)"
          />
          <path
            d="M0,130 C200,80 400,170 600,130 C800,80 1000,170 1200,130 C1320,110 1390,140 1440,130 L1440,200 L0,200 Z"
            fill="#bfdbfe"
            fillOpacity="0.5"
          />
        </svg>
      </div>

    </div>
  )
}

function App() {
  const [page, setPage] = useState('landing')

  return (
    <AnimatePresence mode="wait">
      {page === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <LandingPage onProceed={() => setPage('app')} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SalesApp />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App