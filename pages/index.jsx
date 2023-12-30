import Head from 'next/head';
import { Box, Text, Heading, Button, Container, Img, HStack, Divider, List, ListItem, ListIcon, Flex } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';
import clientPromise from "../lib/mongodb";
import { CheckIcon } from '@chakra-ui/icons';

export default function Home({ numClasses, numReviews })
{
  return (
    <>
      <Head>
        <title>GT Class Reviews</title>
      </Head>

      <NavBar />

      <Container maxW='container.lg' mt={16}>
        <Box textAlign='center'>
          <Text color='#B3A369'>Live Stats • <Text as='span' fontWeight='bold'>{numReviews} reviews</Text> • <Text as='span' fontWeight='bold'>{numClasses} classes</Text></Text>
          <Heading fontWeight='black' fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}>GT
            <Text as='span' color='#B3A369'>{" "} Class Reviews</Text>
          </Heading>

          <Text fontSize='lg' mt={4} mx='auto'>Questions about class workload? Class difficulty? Class advice? <br /><Text as='span' fontStyle='italic'>Find it <Text as='span' textDecor='underline'>completely free</Text>, all on GT Class Reviews!</Text></Text>

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

        <Img src='/homepage_cover.png' mx='auto' maxH='500px' mb={-10} />

        <Divider />


        <Flex alignItems='center' flexDirection={{ base: "column", md: "row" }} id='how-it-works'>
          <Box mb={8}>
            <Heading fontWeight='extrabold' color='#b59318' mt={8}>So, what is GT Class Reviews?</Heading>
            <List spacing={3} mt={4}>
              <ListItem>
                <ListIcon as={CheckIcon} color='#b59318' />
                Class reviews from Georgia Tech students who have taken/are taking the course.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color='#b59318' />
                Course ratings about difficulty, workload, interesting-ness
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color='#b59318' />
                Advice on understanding course content, assignments, projects, exams.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color='#b59318' />
                Like &amp; share reviews based on content.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color='#b59318' />
                GT Course Reviews will always be completely free.
              </ListItem>
            </List>
          </Box>
          <Img src='/gtcr_logo.png' w='250px' mx='auto' />
        </Flex>

        <Box h={1} my={10} />
      </Container>

      <Footer />
    </>
  );
}

export async function getServerSideProps()
{
  const client = await clientPromise;
  const db = client.db("GTClassReviews");

  const classCollection = db.collection("classes");
  const numClasses = await classCollection.countDocuments();

  const reviewCollection = db.collection("reviews");
  const numReviews = await reviewCollection.countDocuments();

  return {
    props: {
      success: true,
      numClasses,
      numReviews
    }
  };
}