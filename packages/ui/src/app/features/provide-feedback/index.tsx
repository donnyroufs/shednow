import {
  Box,
  Button,
  Container,
  Heading,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PostsRepository } from "../../core/repositories/posts.repository";
import { useAuth } from "../../auth";
import { useQuery } from "@tanstack/react-query";

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

type Fields = {
  content: string;
};

export function ViewPost() {
  useAuth(true);
  const navigate = useNavigate();
  const params = useParams<{ slug: string; authorName: string }>();
  const enabled = params.slug != null && params.authorName != null;
  const query = useQuery(
    ["post", params.authorName, params.slug],
    () =>
      PostsRepository.findOneByAuthorAndSlug(params.authorName!, params.slug!),
    {
      enabled,
      retry: false,
    }
  );
  const { register, handleSubmit } = useForm<Fields>();

  async function onSubmit(data: Fields) {
    await PostsRepository.provideFeedback(params.authorName!, params.slug!, {
      content: data.content,
    });
  }

  if (query.isLoading || !enabled) {
    return <p>Loading...</p>;
  }

  if (!query.data) {
    navigate("/");
    return null;
  }

  const post = query.data;

  return (
    <Container maxW="container.lg">
      <Box as="header">
        <Heading color="#E08F30" textTransform="capitalize">
          {post.title}
        </Heading>
      </Box>
      <Box mt={8}>
        <audio src={post.url} controls />
      </Box>
      <VStack
        as="form"
        spacing={8}
        onSubmit={handleSubmit(onSubmit)}
        mt={8}
        data-cy="form"
      >
        {!post.isMyPost && (
          <Textarea
            disabled={post.hasProvidedFeedback}
            placeholder={
              post.hasProvidedFeedback
                ? "You have already provided feedback!"
                : "Provide some valuable feedback..."
            }
            data-cy="content"
            border="none"
            resize="none"
            p={4}
            h="175px"
            {...register("content", { required: true })}
            bgColor="#161A22"
          />
        )}
      </VStack>
    </Container>
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
