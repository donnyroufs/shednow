import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Box,
  Container,
  Heading,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { PostsRepository } from "../../core/repositories/posts.repository";
import { useAuth } from "../../auth";

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
  const hasFeedback = post.feedback.length > 0;

  return (
    <Container maxW="container.lg">
      <Box as="header" display="flex">
        <Avatar src={post.authorAvatar} />
        <Heading color="#E08F30" textTransform="capitalize" ml={8}>
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
            border="1px solid #2E3542"
            resize="none"
            p={4}
            h="175px"
            {...register("content", { required: true })}
            bgColor="#161A22"
          />
        )}
        {post.feedback.map((feedback) => (
          <Box
            display="flex"
            bgColor="#161A22"
            color="#5E6579"
            w="100%"
            p={8}
            lineHeight={1.65}
          >
            <Avatar src={feedback.authorAvatar} />
            <Text ml={8}>{feedback.content}</Text>
          </Box>
        ))}
        {!hasFeedback && (
          <Text data-cy="feedback-message">
            {post.isMyPost
              ? "You have not received any feedback yet"
              : "They have not received any feedback, be the first!"}
          </Text>
        )}
      </VStack>
    </Container>
  );
}
