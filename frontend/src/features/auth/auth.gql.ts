import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      name
    }
  }
`

export const SIGNUP = gql`
  mutation signup($name: String!, $password: String!, $email: String!) {
    signup(name: $name, password: $password, email: $email) {
      name
      email
    }
  }
`

export const LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn
  }
`

export const LOGGED_IN_AND_USERID = gql`
  query LoggedInAndUserID {
    userID
    isLoggedIn
  }
`

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`

export const USERID = gql`
  query userID {
    userID
  }
`
