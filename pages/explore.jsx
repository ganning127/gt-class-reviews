import Head from 'next/head';
import
{
    Box, Text, Heading, Button, Container, Img, HStack, Divider, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Flex,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Input,
    Stack
} from '@chakra-ui/react';
import clientPromise from '../lib/mongodb';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';
import { useRouter } from 'next/navigation';
import { ClassCard } from '../components/ClassCard';
import { useState } from 'react';
import { NextSeo } from 'next-seo';

export default function Explore({ success, classes })
{
    const origClasses = classes;
    const router = useRouter();

    const [theClasses, setTheClasses] = useState(classes);

    const handleSearch = async (event) =>
    {
        if (event.target.value === "")
        {
            setTheClasses(origClasses);
            return;

        }
        console.log(event.target.value);
        const resp = await fetch('/api/search-class', {
            headers: {
                value: event.target.value
            }
        });

        const data = await resp.json();
        console.log("DATA:", data);
        setTheClasses(data);
    };

    return (
        <>
            <NextSeo
                title="Explore Classes | GT Class Reviews"
                description="Read reviews based on specific classes."
            />

            <NavBar active="explore courses" />

            <Container maxW='container.xl' mb={4} py={16}>
                <Flex alignItems='center' mb={4} gap={4}>
                    <Text fontWeight='bold' color='#B3A369'>Search:</Text>
                    <Input placeholder="e.g. MATH 1554" onChange={handleSearch} />
                </Flex>
                <Stack direction="column" spacing={2} display={{ base: "flex", md: "none" }}>
                    {
                        theClasses.map((c, i) =>
                        {
                            return (
                                <ClassCard c={c} key={i} />
                            );
                        })
                    }
                </Stack>

                {/* TableContainer only displays on laptop screens */}
                <TableContainer display={{
                    base: "none",
                    md: "block",
                }}>
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
                                theClasses.map((c, i) =>
                                {
                                    return (
                                        <Tr key={i} onClick={() =>
                                        {
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