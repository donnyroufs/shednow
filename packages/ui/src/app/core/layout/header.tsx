import { Button, Flex, Heading } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

export function Header() {
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
      <Button
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
    </Flex>
  );
}
