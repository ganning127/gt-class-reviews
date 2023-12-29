import { Box, Flex, Text, Img, Button, Icon } from "@chakra-ui/react";
import * as React from "react";
import { NavContent } from "./NavContent";
import { useEffect, useState } from "react";
import
{
    SignedIn,
    SignedOut,
    UserButton
} from "@clerk/nextjs";

export const NavBar = () =>
{
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () =>
    {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() =>
    {
        window.addEventListener("scroll", handleScroll);

        return () =>
        {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <Box
            py={4}
            position="sticky"
            shadow={scrollPosition == 0 ? "none" : "md"}
            top="0"
            id="navbar"
            transition="all 0.4s"
            zIndex={999999}
            bg="white"
        >
            <Box as="header" position="relative">
                <Box
                    height="100%"
                    mx="auto"
                    px={{
                        base: "8",
                        md: "8",
                    }}
                    pe={{
                        base: "8",
                        md: "8",
                    }}
                >
                    <Flex
                        as="nav"
                        aria-label="Site navigation"
                        align="center"
                        justify="space-between"
                        height="100%"
                    >
                        <Box d="flex" alignItems="center" as="a" href="/">
                            <Img src="/gtcr_logo.png" h="10" display="inline" />
                        </Box>
                        <NavContent.Desktop
                            display={{
                                base: "none",
                                md: "flex",
                            }}
                        />
                        <NavContent.Mobile
                            display={{
                                base: "flex",
                                md: "none",
                            }}
                        />
                        <Box
                            display={{
                                base: "none",
                                md: "block",
                            }}
                        >
                            <SignedIn>
                                {/* Mount the UserButton component */}
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                {/* Signed out users get sign in button */}
                                {/* <SignInButton /> */}

                                <Button as='a' href='/sign-up' bg='' color='#B3A369' _hover={{
                                    color: "#876f17"
                                }}>Sign Up</Button>

                                <Button as='a' href='/sign-in' bg='#B3A369' color='white' _hover={{
                                    bg: "#876f17"
                                }}>Sign In</Button>
                            </SignedOut>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};