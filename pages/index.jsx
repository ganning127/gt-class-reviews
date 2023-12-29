import Head from 'next/head';
import { Box, Text, Heading, Button, Container, Img, HStack, Divider } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';
export default function Home()
{
  return (
    <>
      <Head>
        <title>GT Class Reviews</title>
      </Head>

      <NavBar />

      <Container maxW='container.xl' mt={16}>
        <Box textAlign='center'>
          <Heading fontWeight='black' fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}>GT
            <Text as='span' color='#B3A369'>{" "} Class Reviews</Text>
          </Heading>

          <Text fontSize='lg' mt={4} mx='auto'>Questions about class workload? Class difficulty? Class advice? <br /><Text as='span' fontStyle='italic'>Find it all on GT Class Reviews!</Text></Text>

          <HStack mt={8} justifyContent='center'>
            <Button bg='' borderWidth='1px' borderColor="#B3A369" color='#B3A369' _hover={{
              bg: "#B3A369",
              color: "white"
            }} as='a' href='#how-it-works'>How it works</Button>
            <Button rightIcon={<ArrowForwardIcon />} bg='#B3A369' color='white' _hover={{
              bg: "#876f17"
            }} as='a' href='/explore'>Get started</Button>
            {/* TODO: change to iconButton */}

          </HStack>
        </Box>

        <Img src='/homepage_cover.png' mx='auto' maxH='600px' />


      </Container>

      <Footer />
    </>
  );
}
