import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Header } from "./header";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
}
