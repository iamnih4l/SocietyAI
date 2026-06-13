import React from 'react'
import Dashboard from './components/Dashboard'
import { ASLProvider } from './components/ASLInterpreter'

function App() {
  return (
    <ASLProvider>
      <Dashboard />
    </ASLProvider>
  )
}

export default App
