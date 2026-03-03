import React, from 'react'
import { Calculator } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-6 sm:p-12">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-6 relative hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"></div>
          <Calculator className="w-10 h-10 text-indigo-400 relative z-10" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          MaterialCalc
        </h1>
        <p className="mt-4 text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
          Точный расчет строительных материалов для ремонта.
        </p>
      </header>

      <main className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-10">
        <div className="space-y-6">
          <p className="text-center text-zinc-500">Calculator interface will be built here</p>
        </div>
      </main>
    </div>
  )
}

export default App
