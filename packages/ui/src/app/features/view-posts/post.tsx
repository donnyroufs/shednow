import { Avatar, Box, Heading } from "@chakra-ui/react";
import { useAuth } from "../../auth";
import { PostFeedbackFooter } from "../provide-feedback";

type Props = {
  id: string;
  title: string;
  authorName: string;
  url: string;
  avatarUrl?: string;
  slug: string;
};

export function Post({ title, authorName, avatarUrl, url, slug }: Props) {
  const auth = useAuth(true);
  const to = `/posts/${authorName}/${slug}`;

  return (
    <Box
      bgColor="#161A22"
      border="1px solid"
      display="flex"
      flexDir="column"
      borderColor="#2E3542"
      p={8}
      borderRadius={8}
      alignItems="center"
    >
      <Box w="100%" display="flex" alignItems="center">
        <Box>
          <Avatar name={authorName} src={avatarUrl} />
        </Box>
        <Box ml={4}>
          <Heading as="h2" fontSize="lg" textTransform="capitalize">
            {title}
          </Heading>
        </Box>
      </Box>
      <Box w="100%" mt={4}>
        <audio src={url} controls />
      </Box>
      {auth.isAuthenticated && <PostFeedbackFooter to={to} />}
    </Box>
  );
}
