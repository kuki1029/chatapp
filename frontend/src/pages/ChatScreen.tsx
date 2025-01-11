import { Button } from '../components/Button'
import { useMutation } from '@apollo/client'
import { LogoutMutation, LogoutMutationVariables } from '../__generated__/graphql'
import { LOGOUT } from '../features/auth/auth.gql'
import { useNavigate } from 'react-router-dom'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import {
  Modal,
  Center,
  Grid,
  useMantineColorScheme,
  useComputedColorScheme,
  ActionIcon,
  Title,
  em,
  Stack,
} from '@mantine/core'
import { useState } from 'react'
import { Messaging } from '../features/texting/Messaging'
import { Chats } from '../features/texting/Chats'
import { Orbs } from '../utility/Orbs.tsx'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { MessagingMobile } from '../features/texting/mobile/MessagingMobile.tsx'
import { ChatsMobile } from '../features/texting/mobile/ChatsMobile.tsx'
import { BottomNavMobile } from '../features/texting/mobile/BottomNavMobile.tsx'
import { useColorScheme } from '../utility/useColorScheme.tsx'

interface Iprops {
  refetchLoginStatus: () => void
}

const centerStyle = {
  h: '100vh',
}

export const ChatScreen = ({ refetchLoginStatus }: Iprops) => {
  const colors = useColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  const [chatID, setChatID] = useState<string | undefined>()
  console.log(chatID)
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
    <div>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        There was an error. Please refresh the page.
      </Modal>
      {!isMobile ? (
        <>
          <Orbs />
          <Grid h="100%" overflow="hidden" pl={'2%'} pr={'2%'} style={{ zIndex: 999 }}>
            <Grid.Col span={3}>
              <Center {...centerStyle}>
                <Chats setChatID={setChatID} />
              </Center>
            </Grid.Col>
            <Grid.Col span={9}>
              <Center {...centerStyle}>
                <Messaging chatID={chatID} />
              </Center>
            </Grid.Col>
          </Grid>
        </>
      ) : (
        <Stack justify="space-between" style={{ zIndex: 100 }}>
          {!chatID ? (
            <Stack h="100vh" justify="space-between" style={{ zIndex: 100 }}>
              <Title pt={'5%'} pl={'5%'} order={2} c={colors.primary}>
                Chats
              </Title>
              <ChatsMobile setChat={setChatID} />
              <BottomNavMobile />
            </Stack>
          ) : (
            <MessagingMobile chatID={chatID} setChat={setChatID} />
          )}
        </Stack>
      )}
      <Button text="Logout" loading={loading} onClick={logoutLogic} />{' '}
      <ActionIcon
        onClick={() => {
          setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
        }}
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'light' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
      </ActionIcon>
    </div>
  )
}
