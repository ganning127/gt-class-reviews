import { Box, Text, Avatar, HStack, Heading, useToast, Spacer, Flex, Button, IconButton } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FiLink2 } from "react-icons/fi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useState } from "react";

export const ReviewCard = ({ review }) =>
{
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(review.likes);
    const toast = useToast();

    return (
        <Box p={4} borderRadius='10px' bg='#f5f5f5'>

            <Flex>
                <Button
                    p={0}
                    bg=""
                    m={0}
                    rightIcon={liked ? <AiFillLike /> : <AiOutlineLike />}
                    color="#8a5a44"
                    onClick={async () =>
                    {
                        setLikes(++review.likes);
                        setLiked(true);
                        await fetch(`/api/increment-likes/`, {
                            method: "POST",
                            body: JSON.stringify({
                                _id: review._id,
                                currLikes: review.likes,
                                courseCode: review.courseCode
                            }),
                        });

                        toast({
                            title: "Post Liked.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                    }}
                >
                    {review.likes}
                </Button>
                <Spacer />
                <Box>
                    <IconButton
                        p={0}
                        bg=""
                        m={0}
                        color="blue.600"
                        icon={<FiLink2 />}
                        onClick={async () =>
                        {
                            navigator.clipboard.writeText(
                                `https://gt-class-reviews.vercel.app/reviews/${review._id}`
                            );
                            toast({
                                title: "Link copied.",
                                description: "The link to this post has been copied.",
                                status: "success",
                                duration: 9000,
                                isClosable: true,
                            });
                        }}
                    >
                    </IconButton>

                </Box>
            </Flex>
            <HStack>
                <Avatar src={review.user.imageUrl} height='40px' width='40px' />
                <Box>
                    <Text fontSize='sm' m={0} p={0}><Text as='span' fontWeight='bold'>{review.user.fullName}</Text> on <Link href={`/course/${review.courseCode}`} color='blue.400' textDecor='underline' _hover={{
                        color: 'blue.700'
                    }}>{review.courseCode.toUpperCase()}</Link></Text>
                    <Text fontSize='xs' m={0} p={0} color='gray.500'>{timeSince(new Date(review.created_at))} ago</Text>
                </Box>
            </HStack>
            <Heading mt={4} size='sm'>{review.reviewTitle}</Heading>
            <Text mt={2}>{review.reviewComments}</Text>
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
    return Math.floor(seconds) + " seconds";
};
