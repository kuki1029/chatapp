import { MessagingMobile } from './MessagingMobile.tsx'
import { ChatsMobile } from './ChatsMobile.tsx'
import { BottomNavMobile } from './BottomNavMobile.tsx'
import { Stack, Title } from '@mantine/core'
import { useColorScheme } from '../../../utility/useColorScheme'
import { useState } from 'react'
import { CreateNewChat } from '../CreateNewChat.tsx'

interface Iprops {
  chatID: string | undefined
  setChat: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ChatScreenMobile = ({ chatID, setChat }: Iprops) => {
  const colors = useColorScheme()
  const [active, setActive] = useState<number>(0)

  //TODO: Use enum here
  const renderScreen = (currActive: number) => {
    switch (currActive) {
      case 0:
        return (
          <>
            {' '}
            <Title pt={'5%'} pl={'5%'} order={2} c={colors.primary}>
              Chats
            </Title>
            <ChatsMobile setChat={setChat} />
            <BottomNavMobile setActive={setActive} />
          </>
        )
      case 1:
        return (
          <>
            <CreateNewChat />
            <BottomNavMobile setActive={setActive} />
          </>
        )
    }
  }

  return (
    <Stack justify="space-between" style={{ zIndex: 100 }}>
      {!chatID ? (
        <Stack h="100vh" justify="space-between" style={{ zIndex: 100 }}>
          {renderScreen(active)}
        </Stack>
      ) : (
        <MessagingMobile chatID={chatID} setChat={setChat} />
      )}
    </Stack>
  )
}
