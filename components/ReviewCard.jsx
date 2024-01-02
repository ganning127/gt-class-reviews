import { Box, Text, Avatar, HStack, Heading, Tooltip, useToast, Spacer, Flex, Button, IconButton, Badge, Icon } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FiLink2, FiTrash } from "react-icons/fi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useState } from "react";
import { numberToColorHsl, numberToColorHslWorkload } from "../lib/colorFunctions";
import { BsCalendar, BsFillPersonBadgeFill } from "react-icons/bs";

export const ReviewCard = ({ review, loggedInUserId }) =>
{
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(review.likes);
    const [display, setDisplay] = useState("block");
    const toast = useToast();

    // convert "fall2023" to "Fall 2023"
    let indexSplit = review.semTaken.indexOf('2');
    let semTakenLst = [];
    semTakenLst.push(review.semTaken.slice(0, indexSplit));
    semTakenLst.push(review.semTaken.slice(indexSplit, review.semTaken.length));
    semTakenLst[0] = semTakenLst[0].charAt(0).toUpperCase() + semTakenLst[0].slice(1);
    const useSemTaken = semTakenLst.join(" ");

    return (
        <Box p={4} borderRadius='10px' bg='#f1f1f1' display={display}>
            <Flex>
                <HStack>
                    {!review.anon && <Avatar src={review.user.imageUrl} height='40px' width='40px' />}
                    {review.anon && <Avatar src='/anon_default.png' height='40px' width='40px' />}

                    <Box>
                        <Text fontSize='sm' m={0} p={0}><Text as='span' fontWeight='bold'>{review.anon ? "Anonymous" : review.user.fullName}</Text> on <Link href={`/class/${review.courseCode}`} color='#B3A369' textDecor='underline' _hover={{
                            color: 'blue.700'
                        }}>{review.courseCode.toUpperCase()}</Link></Text>
                        <Flex align='center' gap={2} fontSize='sm' m={0} p={0} color='gray.500'>
                            <Text suppressHydrationWarning>{timeSince(new Date(review.created_at))} ago</Text>•
                            <Flex align='center' gap={1}>
                                <Icon as={BsFillPersonBadgeFill} />
                                <Text>{review.prof}</Text>
                            </Flex>•
                            <Flex align='center' gap={1}>
                                <Icon as={BsCalendar} />
                                <Text>{useSemTaken}</Text>
                            </Flex>
                        </Flex>
                    </Box>
                </HStack>

                <Spacer />

                <Flex>
                    <Button
                        p={0}
                        bg=""
                        m={0}
                        rightIcon={liked ? <AiFillLike /> : <AiOutlineLike />}
                        color="#B3A369"
                        onClick={async () =>
                        {
                            setLikes(++review.likes);
                            setLiked(true);
                            await fetch(`/api/increment-likes/`, {
                                method: "POST",
                                body: JSON.stringify({
                                    _id: review._id,
                                    userId: review.user.id,
                                    currLikes: review.likes,
                                    courseCode: review.courseCode
                                }),
                            });

                            toast({
                                title: "Review liked.",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                            });
                        }}
                    >
                        {review.likes}
                    </Button>
                    <Box>
                        <IconButton
                            p={0}
                            bg=""
                            m={0}
                            color="#B3A369"
                            icon={<FiLink2 />}
                            onClick={async () =>
                            {
                                navigator.clipboard.writeText(
                                    `https://gt-class-reviews.vercel.app/reviews/${review._id}`
                                );
                                toast({
                                    title: "Link copied.",
                                    description: "The link to this review has been copied.",
                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                });
                            }}
                        >
                        </IconButton>
                    </Box>

                    {loggedInUserId === review.user.id ? <Box>
                        <IconButton
                            p={0}
                            bg=""
                            m={0}
                            color="#B3A369"
                            icon={<FiTrash />}
                            onClick={async () =>
                            {
                                if (confirm(`Are you sure you want to delete the review titled: ${review.reviewTitle}`))
                                {
                                    await fetch('/api/delete-review', {
                                        method: "POST",
                                        body: JSON.stringify({
                                            review
                                        })
                                    });

                                    setDisplay("none");


                                    toast({
                                        title: "Review deleted.",
                                        description: "Review has been deleted.",
                                        status: "success",
                                        duration: 9000,
                                        isClosable: true,
                                    });

                                } else
                                {
                                    // nothing happens
                                };

                            }}
                        >
                        </IconButton>
                    </Box>
                        : <></>}
                </Flex>
            </Flex>

            <Box mt={4}>
                <Badge bg={numberToColorHsl(review.overallRating * 10)} color={review.overallRating <= 2 ? 'white' : ""} mr={2}>{review.overallRating} / 10 Overall</Badge>
                <Badge bg={numberToColorHsl((10 - review.diffRating) * 10)} color={review.diffRating >= 8 ? 'white' : ""} mr={2}>{review.diffRating}/ 10 Difficulty</Badge>
                <Badge bg={numberToColorHsl(review.interestingRating * 10)} color={review.interestingRating <= 2 ? 'white' : ""} mr={2}>{review.interestingRating} / 10 Interesting</Badge>
                <Badge bg={numberToColorHslWorkload(review.workload)} color={review.workload >= 17 ? 'white' : ""}>{review.workload} hours/week</Badge>
            </Box>

            <Heading mt={4} size='sm'>{review.reviewTitle}</Heading>
            <Text mt={2} whiteSpace="pre-line">{review.reviewComments}</Text>
        </Box >
    );
};

const timeSince = (date) =>
{
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1)
    {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1)
    {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1)
    {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1)
    {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1)
    {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds"; // will need to suppress Next.js hydration errors
    // return "0 minutes";
};
