import { Routes, Route } from 'react-router-dom'
import { Auth } from './pages/Auth.tsx'
import '@mantine/core/styles.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="*" element={<div>No Match</div>} /> //TODO: Add 404 page
    </Routes>
  )
}

export default App
