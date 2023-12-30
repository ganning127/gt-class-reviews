import Head from 'next/head';
import
{
    Box,
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Slider,
    SliderMark,
    SliderFilledTrack,
    SliderThumb,
    Divider,
    SliderTrack,
    Container,
    SimpleGrid,
    Checkbox,
    Stack,
    Select,
    Textarea,
    Text,
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
    Button,
    useToast

} from '@chakra-ui/react';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { NavBar } from '../../components/NavBar';
import { NextSeo } from 'next-seo';


export default function Home()
{
    const toast = useToast();
    const { isSignedIn, user, isLoaded } = useUser();
    const [courseCode, setCourseCode] = useState("MATH 1554");
    const [prof, setProf] = useState("Salvador Barone");
    const [semTaken, setSemTaken] = useState("fall2023");
    const [overallRating, setOverallRating] = useState(5);
    const [diffRating, setDiffRating] = useState(5);
    const [interestingRating, setInterestingRating] = useState(5);
    const [workload, setWorkload] = useState(15);
    const [reviewTitle, setReviewTitle] = useState("Challenging, but rewarding");
    const [anon, setAnon] = useState(false);
    const [reviewComments, setReviewComments] = useState("Math 1554 at Georgia Tech is a rigorous yet rewarding course that delves into multivariable calculus, often considered a cornerstone of higher mathematics and essential for various STEM fields. The course typically covers topics like vector functions, partial derivatives, multiple integrals, and vector calculus. Known for its challenging problem sets and in-depth theoretical exploration, Math 1554 pushes students to think critically and analytically, fostering a deep understanding of mathematical concepts rather than just rote memorization. Professors and teaching assistants are generally knowledgeable and committed to helping students succeed, offering ample resources like office hours, review sessions, and supplementary materials to aid in comprehension. However, the fast-paced nature of the course can be overwhelming for some students, requiring consistent dedication and practice to keep up with the demanding workload. \n\n Furthermore, the course often incorporates real-world applications, demonstrating the relevance of multivariable calculus in fields like physics, engineering, economics, and more. This practical approach helps students connect theoretical concepts to tangible problems, enhancing their problem-solving skills and preparing them for real-world challenges. Despite its intensity, Math 1554 at Georgia Tech is highly regarded for its ability to equip students with a strong mathematical foundation, empowering them to tackle complex problems and excel in their academic and professional endeavors.");

    const handleSubmitReview = async () =>
    {
        const courseCodeUse = courseCode.toLowerCase().replaceAll(' ', '');

        const dataObj = {
            user, courseCode: courseCodeUse, prof, semTaken, overallRating, diffRating, interestingRating, workload, workload, reviewTitle, reviewComments, anon
        };

        const resp = await fetch('/api/add-review', {
            method: "POST",
            body: JSON.stringify(dataObj)
        });

        const data = await resp.json();
        if (data.success)
        {
            toast({
                title: 'Review submitted.',
                description: `Your review has been submitted for ${courseCode}`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <NextSeo
                title="Add Review | GT Class Reviews"
                description="Contribute to our database of reviews."
            />
            <NavBar />
            <Container maxW='container.lg' p={4}>
                <Heading fontWeight='extrabold' color='#b59318'>Add a review</Heading>
                <Text mt={2}>Thank you for contributing, your review helps GT students understand classes better :)</Text>

                <Divider mt={4} />

                <Stack spacing={8} direction='column'>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={4} mt={4}>
                        <FormControl>
                            <FormLabel>Course Code</FormLabel>
                            <Input placeholder='e.g. MATH 1554' value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Professor</FormLabel>
                            <Input placeholder='e.g. Salvador Barone' value={prof} onChange={(e) => setProf(e.target.value)} />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Semester Taken</FormLabel>
                            <Select value={semTaken} onChange={(e) => setSemTaken(e.target.value)}>
                                <option value='fall2023'>Fall 2023</option>
                                <option value='spring2023'>Spring 2023</option>
                                <option value='fall2022'>Fall 2022</option>
                                <option value='spring2022'>Spring 2022</option>
                                <option value='fall2021'>Fall 2021</option>
                            </Select>
                        </FormControl>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4}>
                        <FormControl>
                            <FormLabel >Overall Rating</FormLabel>
                            <FormHelperText>1 = hated it, 10 = loved it</FormHelperText>
                            <Slider defaultValue={5} min={1} max={10} step={1} onChange={(val) => setOverallRating(val)} mt={10}>
                                <SliderMark
                                    value={overallRating}
                                    textAlign='center'
                                    bg='#B3A369'
                                    color='white'
                                    mt='-10'
                                    ml='-2'
                                    w='5'
                                >
                                    {overallRating}
                                </SliderMark>
                                <SliderTrack>
                                    <SliderFilledTrack bg='#B3A369' />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>

                        <FormControl>
                            <FormLabel >Difficulty Rating</FormLabel>
                            <FormHelperText>1 = easy, 10 = impossible</FormHelperText>
                            <Slider defaultValue={5} min={1} max={10} step={1} onChange={(val) => setDiffRating(val)} mt={10}>
                                <SliderMark
                                    value={diffRating}
                                    textAlign='center'
                                    bg='#B3A369'
                                    color='white'
                                    mt='-10'
                                    ml='-2'
                                    w='5'
                                >
                                    {diffRating}
                                </SliderMark>
                                <SliderTrack>
                                    <SliderFilledTrack bg='#B3A369' />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4}>
                        <FormControl>
                            <FormLabel>Interesting Rating</FormLabel>
                            <FormHelperText>1 = mind-dumbingly boring, 10 = absolutely fascinating</FormHelperText>
                            <Slider defaultValue={5} min={1} max={10} step={1} onChange={(val) => setInterestingRating(val)} mt={10}>
                                <SliderMark
                                    value={interestingRating}
                                    textAlign='center'
                                    bg='#B3A369'
                                    color='white'
                                    mt='-10'
                                    ml='-2'
                                    w='5'
                                >
                                    {interestingRating}
                                </SliderMark>
                                <SliderTrack>
                                    <SliderFilledTrack bg='#B3A369' />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Workload</FormLabel>
                            <FormHelperText>hours spent on class (lectures, hw, studying, etc) per week</FormHelperText>
                            <Slider defaultValue={15} min={1} max={100} step={1} onChange={(val) => setWorkload(val)} mt={10}>
                                <SliderMark
                                    value={workload}
                                    textAlign='center'
                                    bg='#B3A369'
                                    color='white'
                                    mt='-10'
                                    ml='-5'
                                    w='12'
                                >
                                    {workload}
                                </SliderMark>
                                <SliderTrack>
                                    <SliderFilledTrack bg='#B3A369' />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                    </SimpleGrid>

                    <Divider />

                    <FormControl>
                        <FormLabel>Review Title</FormLabel>
                        <Input placeholder='e.g. Challenging, but rewarding' value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} />
                        <FormHelperText>25 words max</FormHelperText>
                    </FormControl>


                    <FormControl>
                        <FormLabel>Review Comments</FormLabel>
                        <FormHelperText>
                            <Text>Common topics:</Text>
                            <UnorderedList>
                                <ListItem>Course content and structure
                                </ListItem>
                                <ListItem>Quality of teaching/instruction</ListItem>
                                <ListItem>Assignments, projects, or exams</ListItem>
                                <ListItem>Interaction with the instructor and peers</ListItem>
                                <ListItem>Resources and materials provided</ListItem>
                                <ListItem>Any additional insights or experiences</ListItem>
                            </UnorderedList>
                        </FormHelperText>
                        <Textarea mt={4} placeholder={`e.g. ${courseCode} was...`} rows={8} value={reviewComments} onChange={(e) => setReviewComments(e.target.value)} />
                    </FormControl>

                    <Checkbox value={anon} onChange={(e) => setAnon(e.target.checked)}>post review anonymously</Checkbox>

                    <Button bg='#B3A369' color='white' _hover={{
                        bg: "#b59318"
                    }} onClick={handleSubmitReview}>Submit Review</Button>
                </Stack>
            </Container>
        </>
    );
}
