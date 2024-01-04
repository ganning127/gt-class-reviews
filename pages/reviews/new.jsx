import Head from 'next/head';
import
{
    Heading,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
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
    ListItem,
    UnorderedList,
    Button,
    useToast

} from '@chakra-ui/react';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { NavBar } from '../../components/NavBar';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import clientPromise from '../../lib/mongodb';
import { getAuth } from "@clerk/nextjs/server";
import { ObjectId } from 'mongodb';
import { Footer } from '../../components/Footer';

export default function New({ success, isEdit, review })
{
    const toast = useToast();
    const { user } = useUser();
    const [courseCode, setCourseCode] = useState(isEdit ? review.courseCode : "");
    const [prof, setProf] = useState(isEdit ? review.prof : "");
    const [semTaken, setSemTaken] = useState(isEdit ? review.semTaken : "fall2023");
    const [overallRating, setOverallRating] = useState(isEdit ? review.overallRating : 5);
    const [diffRating, setDiffRating] = useState(isEdit ? review.diffRating : 5);
    const [interestingRating, setInterestingRating] = useState(isEdit ? review.interestingRating : 5);
    const [workload, setWorkload] = useState(isEdit ? review.workload : 10);
    const [reviewTitle, setReviewTitle] = useState(isEdit ? review.reviewTitle : "");
    const [anon, setAnon] = useState(isEdit ? review.anon : false);
    const [reviewComments, setReviewComments] = useState(isEdit ? review.reviewComments : "");

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmitReview = async () =>
    {
        setLoading(true);

        const courseCodeUse = courseCode.toLowerCase().replaceAll(' ', '');

        let dataObj = {
            user, courseCode: courseCodeUse, prof, semTaken, overallRating, diffRating, interestingRating, workload, workload, reviewTitle, reviewComments, anon
        };

        if (isEdit)
        {
            console.log("editing...");
            dataObj['likes'] = review.likes;
            dataObj['_id'] = review._id;
            console.log(dataObj);
            const resp = await fetch('/api/edit-review', {
                method: "POST",
                body: JSON.stringify({
                    oldOverallRating: review.overallRating,
                    oldDiffRating: review.diffRating,
                    oldInterestingRating: review.interestingRating,
                    oldWorkload: review.workload,
                    dataObj
                })
            });

            const data = await resp.json();

            if (data.success)
            {
                toast({
                    title: 'Review saved.',
                    description: `Your review has been updated for ${courseCode}`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });

                router.push(`/review-submitted?courseCode=${courseCode}`);

            } else
            {
                toast({
                    title: 'Review saving error.',
                    description: `There was an error saving your review for ${courseCode}, please try again, or contact us if the issue persists.`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }

        } else
        {
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

        }


        setLoading(false);
    };

    if (!success)
    {
        return (
            <>
                <NavBar />
                <Container maxW='container.lg' p={4} textAlign='center'>
                    <Text mt={8}>Oops! It seems like you don&apos;t have edit access to this review.</Text>
                    <Button as='a' href='/reviews/new' bg='#B3A369' color='white' mt={4} _hover={{
                        bg: "#876f17"
                    }}>Add your own review</Button>

                </Container>
            </>
        );
    }

    return (
        <>
            <NextSeo
                title="Add Review | GT Class Reviews"
                description="Contribute to our database of reviews."
            />
            <NavBar />
            <Container maxW='container.lg' p={4} mb={8}>
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
                            <Slider defaultValue={isEdit ? review.overallRating : 5} min={1} max={10} step={1} onChange={(val) => setOverallRating(val)} mt={10}>
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
                            <Slider defaultValue={isEdit ? review.diffRating : 5} min={1} max={10} step={1} onChange={(val) => setDiffRating(val)} mt={10}>
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
                            <Slider defaultValue={isEdit ? review.interestingRating : 5} min={1} max={10} step={1} onChange={(val) => setInterestingRating(val)} mt={10}>
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
                            <Slider defaultValue={isEdit ? review.workload : 10} min={1} max={100} step={1} onChange={(val) => setWorkload(val)} mt={10}>
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

                    <Checkbox value={anon} isChecked={anon} onChange={(e) => setAnon(e.target.checked)}>post review anonymously</Checkbox>

                    <Button bg='#B3A369' color='white' _hover={{
                        bg: "#b59318"
                    }} onClick={handleSubmitReview} isLoading={loading} loadingText={`${isEdit ? 'Saving' : 'Submitting'} review for ${courseCode}`}>{isEdit ? 'Save' : 'Submit'} Review</Button>
                </Stack>
            </Container>

            <Footer />
        </>
    );
}

export async function getServerSideProps(context)
{
    try
    {
        const { userId } = getAuth(context.req);
        const reviewIdToPull = context.query.editId;
        const client = await clientPromise;
        const db = client.db("GTClassReviews");
        const collection = db.collection("reviews");

        if (reviewIdToPull != null)
        {
            let reviews = await collection.find({
                _id: { $eq: ObjectId(reviewIdToPull) }
            }).toArray();

            reviews = JSON.parse(JSON.stringify(reviews));

            let review = reviews[0];

            // check if user id are same
            if (userId !== review.user.id)
            {
                return {
                    props: {
                        success: false,
                    }
                };
            }

            return {
                props: {
                    success: true,
                    isEdit: true,
                    review,
                }
            };
        } else
        {
            return {
                props: {
                    success: true,
                    isEdit: false

                }
            };
        }
    } catch (e)
    {
        console.error(e);
        return {
            props: { success: false },
        };
    }
}