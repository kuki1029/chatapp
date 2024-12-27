import { Button } from '../../components/Button'
import { Paper, TextInput, NavLink } from '@mantine/core'
import {
  CreateChatWithEmailMutation,
  CreateChatWithEmailMutationVariables,
  CreateChatWithEmailDocument,
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
} from '../../__generated__/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

interface Iprops {
  setChatID: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const Chats = ({ setChatID }: Iprops) => {
  const [email, setEmail] = useState<string>('')
  const { data } = useQuery<UserChatsQuery, UserChatsQueryVariables>(UserChatsDocument, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
  const [createChat, { loading: loadingCreateChat }] = useMutation<
    CreateChatWithEmailMutation,
    CreateChatWithEmailMutationVariables
  >(CreateChatWithEmailDocument, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })

  const emailSub = async () => {
    await createChat({ variables: { email } })
  }

  return (
    <Paper h="90%" shadow="xl" radius="md" p="sm" bg={'white'}>
      <TextInput
        value={email}
        onChange={(e) => {
          setEmail(e.currentTarget.value)
        }}
        label="email temp"
        placeholder="email"
      />
      <Button text="new chat" onClick={emailSub} loading={loadingCreateChat}></Button>
      {data ? (
        data.userChats.map((i) => (
          <NavLink
            key={i.id}
            label={`Chat ID: ${i.id}`}
            description={`Members are ${i.membersNames.toString()}`}
            onClick={() => {
              setChatID(i.id)
            }}
          />
        ))
      ) : (
        <p>Loading</p>
      )}
    </Paper>
  )
}
