import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { theme } from './utility/theme.tsx'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const rootElem = document.getElementById('root')

if (!rootElem) {
  throw new Error('Root element does not exist on page.')
}

const httpLink = new HttpLink({
  uri:
    import.meta.env.MODE === 'production'
      ? 'http://localhost:8080/api/'
      : 'http://localhost:4000/graphql',
  credentials: 'include',
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  })
)

// Docs have this weird bug so need to exlpictly write the
// definition https://github.com/apollographql/apollo-client/issues/3090
interface Definintion {
  kind: string
  operation?: string
}

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const { kind, operation }: Definintion = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: 'include',
})

createRoot(rootElem).render(
  <ApolloProvider client={client}>
    <MantineProvider theme={theme} defaultColorScheme="dark">
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
)
