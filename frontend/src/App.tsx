import { Routes, Route, useNavigate } from 'react-router-dom'
import { Auth } from './pages/Auth.tsx'
import { ChatScreen } from './pages/ChatScreen.tsx'
import '@mantine/core/styles.css'
import { useQuery } from '@apollo/client'
import { LOGGED_IN } from './features/auth/auth.gql.ts'
import { useEffect } from 'react'
import { IsLoggedInQuery, IsLoggedInQueryVariables } from './__generated__/graphql.ts'

function App() {
  const { data, loading, error, refetch } = useQuery<IsLoggedInQuery, IsLoggedInQueryVariables>(
    LOGGED_IN,
    {
      fetchPolicy: 'network-only',
    }
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (data?.isLoggedIn) {
        navigate('/')
      } else {
        navigate('/login')
      }
    }
  }, [data, loading, navigate])

  if (error) {
    return <p>Some error happened. Refresh page</p>
  }

  return (
    <Routes>
      <Route path="/" element={<ChatScreen refetch={() => void refetch()} />} /> //TODO: Figure out
      linter here and in chatscreen
      <Route path="/login" element={<Auth refetch={() => void refetch()} />} />
      <Route path="*" element={<div>No Match</div>} /> //TODO: Add 404 page
    </Routes>
  )
}

export default App
