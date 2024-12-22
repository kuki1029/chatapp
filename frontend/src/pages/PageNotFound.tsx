import { Center, Container, Text, Paper } from '@mantine/core'

export const PageNotFound = () => {
  return (
    <Center h={'100vh'}>
      <Container>
        <Paper radius="md" p="xl" withBorder shadow="lg">
          <Text
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: 'rgba(0, 0, 0, 1)', to: 'rgba(170, 0, 255, 1)', deg: 243 }}
          >
            You've entered the deep cosmos. This page does not exist. Please return back to your
            planet.
          </Text>
        </Paper>
      </Container>
    </Center>
  )
}
