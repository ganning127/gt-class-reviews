import { Link } from "@chakra-ui/next-js";
import { Text, Divider, Flex, Spacer } from "@chakra-ui/react";

export const Footer = () =>
{
    return (
        <>
            <Divider />

            <Flex my={4} px={4} flexWrap='initial' justify='space-between'>
                <Text><Link href='mailto:gtclassreviews@gmail.com' color='#B3A369' fontWeight='bold' _hover={{
                    color: "#876f17"
                }}>Contact Us</Link></Text>

                <Text><Link href='https://forms.gle/qeLnjQLLJhcPZCMP9' color='#B3A369' fontWeight='bold' _hover={{
                    color: "#876f17"
                }} isExternal>Feature Request</Link></Text>

                {/* <Spacer /> */}
                <Text color='#876f17'>&copy; 2023 GT Class Reviews</Text>

            </Flex>
        </>
    );
};