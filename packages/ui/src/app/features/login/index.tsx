import { Box, Button, Heading, Image, Link, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth";

export function Login() {
  const auth = useAuth(true);

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box display="flex">
      <Box display="flex" flex={2} justifyContent="center" alignItems="center">
        <Box h="80%" w="80%">
          <Text
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="semibold"
            letterSpacing="wider"
            color="#E08F30"
          >
            Shednow
          </Text>
          <Heading as="h2" textTransform="uppercase" letterSpacing="wide">
            Login
          </Heading>

          <Box>
            <Button
              as={Link}
              href="http://localhost:3333/api/auth/google"
              variant="outline"
              bgColor="#1C2029"
              border="1px solid #252931"
              color="#444B59"
              px={8}
              py={4}
              mt={8}
              w="100%"
              _hover={{
                bgColor: "#1C2029",
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </Box>
      </Box>

      <Box flex={5} height="100vh" display={{ base: "none", "2xl": "block" }}>
        <Image
          src="../../../assets/login-screen.jpg"
          objectFit="cover"
          h="100%"
          w="100%"
        />
      </Box>
    </Box>
  );
}
