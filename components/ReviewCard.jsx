import { Box, Text, Avatar, HStack, Heading, useToast, Spacer, Flex, Button, IconButton, Badge } from "@chakra-ui/react";
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
        <Box p={4} borderRadius='10px' bg='#f1f1f1'>
            <Flex>
                <HStack>
                    {!review.anon && <Avatar src={review.user.imageUrl} height='40px' width='40px' />}
                    {review.anon && <Avatar src='/anon_default.png' height='40px' width='40px' />}

                    <Box>
                        <Text fontSize='sm' m={0} p={0}><Text as='span' fontWeight='bold'>{review.anon ? "Anonymous" : review.user.fullName}</Text> on <Link href={`/class/${review.courseCode}`} color='#B3A369' textDecor='underline' _hover={{
                            color: 'blue.700'
                        }}>{review.courseCode.toUpperCase()}</Link></Text>
                        <Text fontSize='sm' m={0} p={0} color='gray.500' suppressHydrationWarning>{timeSince(new Date(review.created_at))} ago</Text>
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
                </Flex>
            </Flex>

            <Box mt={4}>
                <Badge bg={numberToColorHsl(review.overallRating * 10)} color={review.overallRating <= 2 ? 'white' : ""} mr={2}>{review.overallRating} / 10 Overall</Badge>
                <Badge bg={numberToColorHsl((10 - review.diffRating) * 10)} color={review.diffRating <= 2 ? 'white' : ""} mr={2}>{review.diffRating}/ 10 Difficulty</Badge>
                <Badge bg={numberToColorHsl(review.interestingRating * 10)} color={review.interestingRating <= 2 ? 'white' : ""} mr={2}>{review.interestingRating} / 10 Interesting</Badge>
                <Badge bg={numberToColorHslWorkload(review.workload)} color={review.workload >= 18 ? 'white' : ""}>{review.workload} hours/week</Badge>

            </Box>

            <Heading mt={4} size='sm'>{review.reviewTitle}</Heading>
            <Text mt={2}>{review.reviewComments}</Text>
        </Box >
    );
};

function numberToColorHsl(i)
{
    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
    // we convert the input to the appropriate hue value
    var hue = i * 1.2 / 360;
    // we convert hsl to rgb (saturation 100%, lightness 50%)
    var rgb = hslToRgb(hue, 1, .5);
    // we format to css value and return
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function numberToColorHslWorkload(i)
{
    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
    // we convert the input to the appropriate hue value
    // 0 = good
    // 20 = bad
    if (i > 20)
    {
        i = 20;
    }

    i = 20 - i;


    var hue = i * 6 / 360;
    // we convert hsl to rgb (saturation 100%, lightness 50%)
    var rgb = hslToRgb(hue, 1, .5);
    // we format to css value and return
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function hslToRgb(h, s, l)
{
    let r, g, b;

    if (s === 0)
    {
        r = g = b = l; // achromatic
    } else
    {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p, q, t)
{
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}


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
    // return Math.floor(seconds) + " seconds"; // will cause React hydration errors
    return "0 minutes";
};
