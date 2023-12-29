import Head from 'next/head';
import
{
    Box, Text, Heading, Button, Container, Img, HStack, Divider, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import clientPromise from '../lib/mongodb';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';
import { useRouter } from 'next/navigation';

export default function Explore({ success, classes })
{
    const router = useRouter();

    console.log(classes);
    return (
        <>
            <Head>
                <title>Explore Classes | GT Class Reviews</title>
            </Head>

            <NavBar active='explore courses' />

            <Container maxW='container.xl'>
                <TableContainer mt={16}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr >
                                <Th fontSize='sm' color="#B3A369">Class</Th>
                                <Th isNumeric fontSize='sm' color="#B3A369"> Overall Rating</Th>
                                <Th isNumeric fontSize='sm' color="#B3A369">Difficulty</Th>
                                <Th isNumeric fontSize='sm' color="#B3A369">Interesting</Th>
                                <Th isNumeric fontSize='sm' color="#B3A369">Workload</Th>
                                <Th isNumeric fontSize='sm' color="#B3A369"># Reviews</Th>
                            </Tr>
                        </Thead>
                        <Tbody>

                            {
                                classes.map((c, i) =>
                                {
                                    return (
                                        <Tr key={i} onClick={() =>
                                        {
                                            console.log("ok");
                                            router.push(`/class/${c.courseCode}`);
                                        }} transition='all .1s' _hover={{
                                            color: "#B3A369",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}>
                                            {
                                                c.courseName && <Td>{c.courseName}<br /><Text fontSize='sm' color='gray.600' mt={1}>{c.courseCode.toUpperCase()}</Text></Td>

                                            }
                                            {
                                                !c.courseName && <Td>{c.courseCode.toUpperCase()}</Td>
                                            }

                                            <Td isNumeric>{c.avgOverallRating.toFixed(1)}</Td>
                                            <Td isNumeric>{c.avgDiffRating.toFixed(1)}</Td>
                                            <Td isNumeric>{c.avgInterestingRating.toFixed(1)}</Td>
                                            <Td isNumeric>{c.avgWorkload.toFixed(1)}</Td>
                                            <Td isNumeric>{c.numReviews}</Td>
                                        </Tr>
                                    );
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>

            <Footer />

        </>
    );
}

export async function getServerSideProps()
{
    try
    {
        const client = await clientPromise;
        const db = client.db("GTClassReviews");
        const collection = db.collection("classes");

        let classes = await collection.find({}).sort({ courseCode: -1 }).toArray();

        classes = JSON.parse(JSON.stringify(classes));

        return {
            props: {
                success: true,
                classes
            }
        };

    } catch (e)
    {
        console.error(e);
        return {
            props: { success: false },
        };
    }
}