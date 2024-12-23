import { Button } from '../components/Button'
import { useMutation } from '@apollo/client'
import { LogoutMutation, LogoutMutationVariables } from '../__generated__/graphql'
import { LOGOUT } from '../features/auth/auth.gql'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import {
  Modal,
  Paper,
  Stack,
  Center,
  TextInput,
  Text,
  ActionIcon,
  useMantineTheme,
  Flex,
  Group,
  Avatar,
  ScrollArea,
} from '@mantine/core'
import { IconArrowRight, IconPlus, IconVideoPlus } from '@tabler/icons-react'
import { ChatBubble } from '../features/texting/ChatBubble'
import { data } from '../features/texting/data'

interface Iprops {
  refetchLoginStatus: () => void
}

export const ChatScreen = ({ refetchLoginStatus }: Iprops) => {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [logout, { loading }] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
  const navigate = useNavigate()

  const logoutLogic = async (): Promise<void> => {
    await logout()
    refetchLoginStatus()
    navigate('/login')
  }

  return (
    <Flex h="100%" gap="md" justify="flex-end" align="flex-end" direction="column">
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        There was an error. Please refresh the page.
      </Modal>
      <Center
        h="100vh"
        style={{
          maxWidth: '40%',
          minHeight: '100%',
          margin: '0 auto',
        }}
      >
        <Paper h="90%" shadow="xl" radius="md" p="sm" bg={'white'}>
          <Stack
            bg="var(--mantine-color-body)"
            align="center"
            justify="space-between"
            h="100%"
            style={{
              margin: '1',
            }}
          >
            <Group w={'100%'} justify="space-between">
              <Group style={{ gap: '0.5rem' }}>
                <Avatar color="blue" radius="sm">
                  KV
                </Avatar>
                <div style={{ flex: 1, margin: '-2' }}>
                  <Text size="sm" fw={500}>
                    Kunal Varkekar
                  </Text>

                  <Text c="dimmed" size="xs">
                    Typing...
                  </Text>
                </div>
              </Group>

              <ActionIcon size={32} radius="md" color={theme.colors['primary'][1]} variant="filled">
                <IconVideoPlus size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
            <ScrollArea>
              <Flex gap="md" justify="center" align="flex-end" direction="column" wrap="nowrap">
                {data.map((i) => {
                  return (
                    <ChatBubble
                      message={i.message}
                      sender={i.sender === '1' ? 'me' : 'other'}
                      time={i.time}
                    />
                  )
                })}
              </Flex>
            </ScrollArea>

            <TextInput
              radius="md"
              size="md"
              w={'100%'}
              placeholder="Write a message..."
              rightSectionWidth={42}
              leftSection={
                <ActionIcon
                  size={28}
                  radius="md"
                  color={theme.colors['primary'][1]}
                  variant="filled"
                >
                  <IconPlus size={18} stroke={1.5} />
                </ActionIcon>
              }
              rightSection={
                <ActionIcon
                  size={32}
                  radius="md"
                  color={theme.colors['primary'][1]}
                  variant="filled"
                >
                  <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
              }
            />
          </Stack>
        </Paper>
      </Center>
      <Button text="Logout" loading={loading} onClick={logoutLogic} />
    </Flex>
  )
}
