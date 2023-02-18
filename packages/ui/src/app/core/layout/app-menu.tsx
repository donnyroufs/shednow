import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";

export function AppMenu() {
  const auth = useAuth();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        bgColor="transparent"
        borderRadius="50%"
        _hover={{
          bgColor: "transparent",
        }}
        _active={{ bg: "transparent" }}
      >
        <Avatar src={auth.user!.avatarUrl} loading="eager" />
      </MenuButton>
      <MenuList
        bgColor="#171C25"
        border="1px solid"
        borderColor="#2E3542"
        borderRadius={5}
        p={0}
      >
        <MenuItem
          as={Link}
          to="/create-post"
          borderBottomRadius="5"
          fontSize="xs"
          bgColor="#171C25"
          data-cy="logoutButton"
          p={5}
          textTransform="capitalize"
          _hover={{
            bg: "#171C25",
            color: "#E08F30",
          }}
        >
          create post
        </MenuItem>
        <Divider borderColor="#2E3542" />
        <MenuItem
          borderBottomRadius="5"
          textTransform="capitalize"
          fontSize="xs"
          bgColor="#171C25"
          data-cy="logoutButton"
          p={5}
          _hover={{
            bg: "#171C25",
            color: "#E08F30",
          }}
          onClick={() => auth.logout()}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
