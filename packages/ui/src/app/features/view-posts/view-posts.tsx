import { Container, Text, Box, Button, List, ListItem } from "@chakra-ui/react";
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Post } from "./post";
import { axios } from "../../core/axios";

type PostDto = {
  id: string;
  title: string;
  authorName: string;
  url: string;
  slug: string;
};

type GetPostsResponse = {
  posts: PostDto[];
  totalPages: number;
  currentPage: number;
};

async function fetchPosts(page = 1): Promise<GetPostsResponse> {
  return axios.get("/posts?page=" + page).then((res) => JSON.parse(res.data));
}

export function ViewPosts() {
  const { isLoading, data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    keepPreviousData: true,
    getNextPageParam(lastPage) {
      if (lastPage.totalPages === lastPage.currentPage) return false;

      return lastPage.currentPage + 1;
    },
  });

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts.map((post) => post)) ?? [];
  }, [data]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const hasPosts = posts.length > 0;

  return (
    <Container maxW="container.md">
      <List spacing={4} data-cy="posts">
        {posts?.map((post) => (
          <ListItem key={post.id}>
            <Post {...post} />
          </ListItem>
        ))}

        {!hasPosts && (
          <Text data-cy="empty-message">No posts available at the moment</Text>
        )}
      </List>

      {hasNextPage && (
        <Box
          as="footer"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
        >
          <Button
            mt={8}
            onClick={() => fetchNextPage()}
            bgColor="#295C79"
            color="#FFFFFF"
            height="42px"
            fontSize="md"
            fontWeight="semibold"
            alignSelf="flex-start"
            _hover={{
              bgColor: "#295C7998",
            }}
            type="submit"
            data-cy="load-more"
            isLoading={isLoading}
          >
            Load More
          </Button>
        </Box>
      )}
    </Container>
  );
}
