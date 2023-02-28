import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

type PostFeedbackFooter = {
  to: string;
};

export function PostFeedbackFooter({ to }: PostFeedbackFooter) {
  return (
    <Box as="footer" display="flex" alignItems="center" w="100%">
      <Box ml="auto" mt={4}>
        <ProvideFeedbackLink to={to} />
      </Box>
    </Box>
  );
}

type ProvideFeedbackLinkProps = {
  to: string;
};

function ProvideFeedbackLink({ to }: ProvideFeedbackLinkProps) {
  return (
    <Button
      as={Link}
      data-cy="feedback"
      to={to}
      bgColor="#1C2029"
      textDecoration="none"
      color="#5E6579"
      _hover={{
        bgColor: "#1C202999",
      }}
    >
      Give Feedback
    </Button>
  );
}
