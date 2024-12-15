import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { theme } from './utility/theme.tsx'

const rootElem = document.getElementById('root')

if (!rootElem) {
  throw new Error('Root element does not exist on page.')
}

createRoot(rootElem).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </StrictMode>
)
