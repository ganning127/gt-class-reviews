import { Link } from "@chakra-ui/next-js";
import { Text, Divider, Flex, Spacer } from "@chakra-ui/react";

export const Footer = () =>
{
    return (
        <>
            <Divider />

            <Flex my={4} px={4}>
                <Text><Link href='mailto:gt-class-reviews@gmail.com' color='#B3A369' fontWeight='bold' _hover={{
                    color: "#876f17"
                }}>Contact Us</Link></Text>
                <Spacer />
                <Text color='#876f17'>&copy; 2023 GT Class Reviews</Text>

            </Flex>
        </>
    );
};