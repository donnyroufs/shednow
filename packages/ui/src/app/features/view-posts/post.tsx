import { Avatar, Box, Button, Heading, Link, Text } from "@chakra-ui/react";
import { useRef } from "react";

type Props = {
  id: string;
  title: string;
  authorName: string;
  url: string;
  avatarUrl?: string;
};

export function Post({ id, title, authorName, avatarUrl, url }: Props) {
  const ref = useRef<HTMLAudioElement>(null!);

  function onPlay() {
    if (ref.current.duration > 0 && !ref.current.paused) {
      ref.current.pause();
      return;
    }

    ref.current.play();
  }

  return (
    <Box
      bgColor="#171C25"
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
        <audio src={url} controls ref={ref} />
      </Box>
    </Box>
  );
}
