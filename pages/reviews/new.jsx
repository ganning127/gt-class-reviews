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
import { useRouter } from 'next/router';

export default function Home()
{
    const toast = useToast();
    const { isSignedIn, user, isLoaded } = useUser();
    const [courseCode, setCourseCode] = useState("");
    const [prof, setProf] = useState("");
    const [semTaken, setSemTaken] = useState("fall2023");
    const [overallRating, setOverallRating] = useState(5);
    const [diffRating, setDiffRating] = useState(5);
    const [interestingRating, setInterestingRating] = useState(5);
    const [workload, setWorkload] = useState(10);
    const [reviewTitle, setReviewTitle] = useState("");
    const [anon, setAnon] = useState(false);
    const [reviewComments, setReviewComments] = useState("");

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmitReview = async () =>
    {
        setLoading(true);

        console.log(reviewComments.replaceAll(""));

        return;
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

            router.push(`/review-submitted?courseCode=${courseCode}`);

        } else
        {
            toast({
                title: 'Review submission error.',
                description: `There was an error submitting your review for ${courseCode}, please try again, or contact us if the issue persists.`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }

        setLoading(false);
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
                        <Textarea mt={4} placeholder={`e.g. ${courseCode ? courseCode : "MATH 1554"} was...`} rows={8} value={reviewComments} onChange={(e) => setReviewComments(e.target.value)} />
                    </FormControl>

                    <Checkbox value={anon} onChange={(e) => setAnon(e.target.checked)}>post review anonymously</Checkbox>

                    <Button bg='#B3A369' color='white' _hover={{
                        bg: "#b59318"
                    }} onClick={handleSubmitReview} isLoading={loading} loadingText={`Submitting review for ${courseCode}`}>Submit Review</Button>
                </Stack>
            </Container>
        </>
    );
}
