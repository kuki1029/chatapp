import { Outlet, Navigate } from 'react-router-dom'

interface Iprops {
  isLoggedIn: boolean | undefined
}

export const ProtectedRoute = ({ isLoggedIn }: Iprops) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}
