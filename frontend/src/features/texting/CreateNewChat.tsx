import { TextInput, Button } from '@mantine/core'
import {
  CreateChatWithEmailDocument,
  CreateChatWithEmailMutation,
  CreateChatWithEmailMutationVariables,
} from '../../__generated__/graphql'
import { useState } from 'react'
import { useMutation } from '@apollo/client'

// TODO: Temp component for now until I add friends list
export const CreateNewChat = () => {
  const [email, setEmail] = useState('')
  const [createChat, { loading }] = useMutation<
    CreateChatWithEmailMutation,
    CreateChatWithEmailMutationVariables
  >(CreateChatWithEmailDocument, {
    onError: (error) => {
      console.log(error)
    },
  })

  const onSubmitButton = () => {
    void createChat({ variables: { email } })
  }

  return (
    <>
      Temp placement for friends list.
      <TextInput
        label={'Enter their email:'}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      ></TextInput>
      <Button onClick={onSubmitButton} loading={loading}>
        {' '}
        Add Friend
      </Button>
    </>
  )
}
