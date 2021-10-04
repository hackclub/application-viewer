import { signIn } from 'next-auth/client';
import { Container, Button, Flex } from 'theme-ui';

const Auth = () => {
  return (
    <Container sx={{ width: '100vw' }}>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <img
          sx={{ width: '90%', maxWidth: '250px' }}
          src="https://cloud-ot93v7jbr-hack-club-bot.vercel.app/0image.png"
        />
        <h1 sx={{ px: [3], fontSize: [3, 4] }}>
          Hmm... so are you who you say you are ...
        </h1>
        <Button
          onClick={() => {
            signIn('slack', {});
          }}
        >
          Yes, I am!!!
        </Button>
      </Flex>
    </Container>
  );
};

export default Auth;
