import Head from 'next/head';
import { Box, Text, Heading, Button, Container, Img, HStack } from '@chakra-ui/react';

export default function Home()
{
  return (
    <>
      <Head>
        <title>GT Class Reviews</title>
      </Head>

      <Container maxW='container.xl' mt={16}>
        <Box textAlign='center'>
          <Heading fontWeight='black' fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}>GT
            <Text as='span' color='#B3A369'>{" "} Class Reviews</Text>
          </Heading>

          <Text fontSize='lg' mt={4} mx='auto'>Questions about class workload? Class difficulty? Class advice? <br /><Text as='span' fontStyle='italic'>Find it all on GT Class Reviews!</Text></Text>

          <HStack mt={8} justifyContent='center' spacingX={4}>
            <Button>How it works</Button>
            <Button>Get started</Button>
            {/* TODO: change to iconButton */}

          </HStack>
        </Box>

        <Img src='/homepage_cover.png' mx='auto' maxH='600px' />
      </Container>
    </>
  );
}
