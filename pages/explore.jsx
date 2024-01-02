import Head from 'next/head';
import
{
    Box, Text, Container, Table,
    Thead,
    Tbody,
    Tr,
    Flex,
    Th,
    Td,
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
import { numberToColorHsl, numberToColorHslWorkload, determineRegColor } from '../lib/colorFunctions';
import { Link } from '@chakra-ui/next-js';

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
        const resp = await fetch('/api/search-class', {
            headers: {
                value: event.target.value
            }
        });

        const data = await resp.json();
        setTheClasses(data);
    };

    return (
        <>
            <NextSeo
                title="Explore Classes | GT Class Reviews"
                description="Read reviews based on specific classes."
            />

            <NavBar active="explore classes" />

            <Container maxW='container.xl' mb={4} pb={16} pt={8}>

                <Box mb={4}>
                    <Flex alignItems='center' gap={4}>
                        <Text fontWeight='bold' color='#B3A369'>Search:</Text>
                        <Input placeholder="e.g. MATH 1554" onChange={handleSearch} />
                    </Flex>


                    <Text mt={2}>If the class you&apos;re looking for isn&apos;t there, add a review with that course code and it will be added to this list automatically: <Link color='#B3A369' _hover={{
                        textDecor: 'underline'
                    }} href='https://gt-class-reviews.vercel.app/reviews/new' isExternal>https://gt-class-reviews.vercel.app/reviews/new</Link></Text>
                </Box>


                <Stack direction="column" spacing={2} display={{ base: "flex", md: "none" }}>
                    {
                        theClasses.map((c, i) =>
                        {
                            if (c.courseCode !== "")
                            {
                                return (
                                    <ClassCard c={c} key={i} />
                                );
                            }
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
                                <Th isNumeric fontSize='sm' color="#B3A369"> Overall</Th>
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
                                    if (c.courseCode !== "")
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

                                                <Td isNumeric>
                                                    <Text bg={numberToColorHsl(c.avgOverallRating * 10)} color={determineRegColor(c.avgOverallRating)} display='inline' p={1} rounded='md'>{c.avgOverallRating.toFixed(1)}</Text>

                                                </Td>
                                                <Td isNumeric>
                                                    <Text bg={numberToColorHsl((10 - c.avgDiffRating) * 10, true)} color={c.avgDiffRating >= 8 ? 'white' : ""} display='inline' p={1} rounded='md'>{c.avgDiffRating.toFixed(1)}</Text>
                                                </Td>
                                                <Td isNumeric>
                                                    <Text bg={numberToColorHsl(c.avgInterestingRating * 10)} color={determineRegColor(c.avgInterestingRating)} display='inline' p={1} rounded='md'>{c.avgInterestingRating.toFixed(1)}
                                                    </Text>
                                                </Td>
                                                <Td isNumeric>
                                                    <Text bg={numberToColorHslWorkload(c.avgWorkload)} color={c.avgWorkload >= 17 ? 'white' : ""} display='inline' p={1} rounded='md'>
                                                        {c.avgWorkload.toFixed(1)}
                                                    </Text>
                                                </Td>
                                                <Td isNumeric>{c.numReviews}</Td>
                                            </Tr>
                                        );
                                    }
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