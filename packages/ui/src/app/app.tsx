import { Box } from "@chakra-ui/react";
import { useAuth } from "./auth";
import { ViewPosts } from "./features/view-posts/view-posts";

export function App() {
  useAuth(true);

  return (
    <Box>
      <ViewPosts />
    </Box>
  );
}

export default App;
