import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { theme } from './utility/theme.tsx'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const rootElem = document.getElementById('root')

if (!rootElem) {
  throw new Error('Root element does not exist on page.')
}

// TODO: Remove links and make them part of env
const client = new ApolloClient({
  uri:
    import.meta.env.MODE === 'production'
      ? 'http://localhost:8080/api/'
      : 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
})

// TODO: Convert generate script and run dev into one step along with build steps
createRoot(rootElem).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Router
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
        </Router>
      </MantineProvider>
    </ApolloProvider>
  </StrictMode>
)
