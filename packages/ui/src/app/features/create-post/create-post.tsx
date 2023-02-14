import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  createStandaloneToast,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import FileUpload from "./file-upload";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Fields = {
  title: string;
  file: File;
};

const toast = createStandaloneToast();

export function CreatePost() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<Fields>();

  function onSubmit(data: Fields) {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("file", data.file);

    setIsLoading(true);
    fetch("http://localhost:3333/api/posts", {
      method: "POST",
      body: formData,
    }).then((res) => {
      setIsLoading(false);

      if (!res.ok) {
        toast.toast({
          title: "Error",
          description: "Failed to create post",
          variant: "top-accent",
          status: "error",
          colorScheme: "blackAlpha",
          position: "top",
        });
        return;
      }

      navigate("/");
    });
  }

  return (
    <Container color="white" bgColor="#161A22" padding="2rem">
      <VStack as="form" spacing={8} onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            data-cy="title"
            type="text"
            bgColor="#252931"
            border="1px solid"
            borderColor="#30353d"
            _hover={{
              borderColor: "#30353d",
            }}
            {...register("title", { required: true })}
          />
        </FormControl>
        <FileUpload control={control} />
        <Button
          bgColor="#E08F30"
          color="#FFFFFF"
          height="42px"
          fontSize="md"
          fontWeight="semibold"
          alignSelf="flex-start"
          _hover={{
            bgColor: "#E08F30",
          }}
          type="submit"
          isLoading={isLoading}
        >
          Create Post
        </Button>
      </VStack>
    </Container>
  );
}

export default CreatePost;