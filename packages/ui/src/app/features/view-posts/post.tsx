import { Avatar, Box, Heading, Link, Text } from "@chakra-ui/react";

type Props = {
  id: string;
  title: string;
  authorName: string;
  url: string;
  avatarUrl?: string;
};

export function Post({ id, title, authorName, avatarUrl }: Props) {
  return (
    <Box
      bgColor="#171C25"
      border="1px solid"
      display="flex"
      borderColor="#2E3542"
      p={8}
      borderRadius={8}
      alignItems="center"
    >
      <Box>
        <Avatar name={authorName} src={avatarUrl} />
      </Box>
      <Box ml={4}>
        <Heading as="h2" fontSize="lg" textTransform="capitalize">
          {title}
        </Heading>
      </Box>
    </Box>
  );
}
