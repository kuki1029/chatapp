import { Routes, Route } from 'react-router-dom'
import { Auth } from './pages/Auth.tsx'
import { ProtectedRoute } from './features/auth/ProtectedRoute.tsx'
import { ChatScreen } from './pages/ChatScreen.tsx'
import { PageNotFound } from './pages/PageNotFound.tsx'
import { Error } from './pages/Error.tsx'
import { Loading } from './pages/Loading.tsx'
import '@mantine/core/styles.css'
import { useQuery } from '@apollo/client'
import { useMatch, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LoggedInAndUserIdQuery, LoggedInAndUserIdQueryVariables } from './__generated__/graphql.ts'
import { LOGGED_IN_AND_USERID } from './features/auth/auth.gql.ts'
import { UserIdContext } from './features/auth/UserIDContext.tsx'

function App() {
  const isLoginPage = useMatch('/login')
  const [userID, setUserID] = useState<string | undefined | null>('')
  const navigate = useNavigate()
  const {
    data,
    refetch: refetchLoginStatus,
    error,
    loading,
  } = useQuery<LoggedInAndUserIdQuery, LoggedInAndUserIdQueryVariables>(LOGGED_IN_AND_USERID, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true, // Need this so it uses onComplete on refetch
    onCompleted: (data) => {
      setUserID(data.userID)
      if (data.isLoggedIn && isLoginPage) {
        navigate('/')
      }
    },
  })
  //TODO: Add polling to above

  const isLoggedIn = data?.isLoggedIn

  if (error) {
    return <Error />
  }

  if (loading) {
    return <Loading visible={loading} />
  }

  return (
    <UserIdContext.Provider value={userID}>
      <Routes>
        <Route path="/login" element={<Auth refetchLoginStatus={refetchLoginStatus} />} />
        <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="" element={<ChatScreen refetchLoginStatus={refetchLoginStatus} />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </UserIdContext.Provider>
  )
}

export default App
