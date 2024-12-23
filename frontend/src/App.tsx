import { Routes, Route } from 'react-router-dom'
import { Auth } from './pages/Auth.tsx'
import { ProtectedRoute } from './features/auth/ProtectedRoute.tsx'
import { ChatScreen } from './pages/ChatScreen.tsx'
import { PageNotFound } from './pages/PageNotFound.tsx'
import { Error } from './pages/Error.tsx'
import { Loading } from './pages/Loading.tsx'
import '@mantine/core/styles.css'
import { useQuery } from '@apollo/client'
import { LOGGED_IN } from './features/auth/auth.gql.ts'
import { IsLoggedInQuery, IsLoggedInQueryVariables } from './__generated__/graphql.ts'
import { useMatch, useNavigate } from 'react-router-dom'

function App() {
  const isLoginPage = useMatch('/login')
  const navigate = useNavigate()
  const {
    data,
    refetch: refetchLoginStatus,
    error,
    loading,
  } = useQuery<IsLoggedInQuery, IsLoggedInQueryVariables>(LOGGED_IN, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true, // Need this so it uses onComplete on refetch
    onCompleted: (data) => {
      if (data.isLoggedIn && isLoginPage) {
        navigate('/')
      }
    },
  })

  const isLoggedIn = data?.isLoggedIn

  if (error) {
    return <Error />
  }

  if (loading) {
    return <Loading visible={loading} />
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth refetchLoginStatus={refetchLoginStatus} />} />
      <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        <Route path="" element={<ChatScreen refetchLoginStatus={refetchLoginStatus} />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App
