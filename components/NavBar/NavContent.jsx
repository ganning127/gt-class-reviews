import
{
    Box,
    Center,
    HStack,
    Stack,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { NavLink } from "./NavLink";
import { NavList } from "./NavList";
import { NavListItem } from "./NavListItem";
import
{
    SignedIn,
    SignedOut,
    UserButton
} from "@clerk/nextjs";

const links = [
    {
        label: "Explore Courses",
        href: "/explore",
    },

    {
        label: "Recent Reviews",
        href: "/reviews/recent",
    },
    {
        label: (
            <Button bg='#B3A369' color='white' _hover={{
                bg: "#876f17"
            }}>
                Add Review
            </Button>
        ),
        href: "/reviews/new",
    },
];

const MobileNavContent = (props) =>
{
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Box {...props}>
            <Box mt={1} mr={2}>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Box>
            <Center
                as="button"
                p="2"
                fontSize="2xl"
                onClick={onToggle}
                color="gray.600"
            >
                {isOpen ? <HiX /> : <HiOutlineMenu />}
            </Center>
            <NavList
                pos="absolute"
                insetX="0"
                bg="white"
                top="48px"
                animate={isOpen ? "enter" : "exit"}
            >
                <Stack spacing="0">
                    {links.map((link, index) => (
                        <NavListItem key={index}>
                            <NavLink.Mobile href={link.href}>{link.label}</NavLink.Mobile>
                        </NavListItem>
                    ))}

                    <NavListItem>
                        <HStack justifyContent='center'>
                            <SignedOut>
                                <Button as='a' href='/sign-up' bg='' color='#B3A369' _hover={{
                                    color: "#876f17"
                                }}>Sign Up</Button>

                                <Button as='a' href='/sign-in' bg='#B3A369' color='white' _hover={{
                                    bg: "#876f17"
                                }}>Sign In</Button>
                            </SignedOut>
                        </HStack>
                    </NavListItem>

                    <NavListItem
                        style={{
                            flex: "1",
                        }}
                    ></NavListItem>
                </Stack>
            </NavList>
        </Box>
    );
};

const DesktopNavContent = (props) =>
{
    return (
        <HStack spacing="6" align="stretch" {...props}>
            {links.map((link, index) => (
                <NavLink.Desktop key={index} href={link.href} fontSize="lg">
                    {link.label}
                </NavLink.Desktop>
            ))}
        </HStack>
    );
};

export const NavContent = {
    Mobile: MobileNavContent,
    Desktop: DesktopNavContent,
};