import { Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { AppMenu } from "./app-menu";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <Flex
      as="header"
      justifyContent="space-between"
      bgColor="#171C25"
      borderBottom="1px solid"
      borderColor="#2E3542"
      height="125px"
      alignItems="center"
      px={8}
      mb={8}
    >
      <Heading as="h1" textTransform="uppercase" color="#E08F30">
        <Link to="/">Shednow</Link>
      </Heading>
      {isAuthenticated && (
        <HStack spacing={4}>
          <Button
            display={{ base: "none", lg: "flex" }}
            as={Link}
            to="/create-post"
            bgColor="#E08F30"
            color="#FFFFFF"
            height="50px"
            fontWeight="semibold"
            _hover={{
              bgColor: "#E08F30",
            }}
            leftIcon={<AddIcon />}
          >
            Create Post
          </Button>
          <AppMenu />
        </HStack>
      )}
      {!isAuthenticated && (
        <Button
          as={Link}
          to="/login"
          bgColor="#E08F30"
          color="#FFFFFF"
          height="50px"
          fontWeight="semibold"
          _hover={{
            bgColor: "#E08F30",
          }}
        >
          Login
        </Button>
      )}
    </Flex>
  );
}
