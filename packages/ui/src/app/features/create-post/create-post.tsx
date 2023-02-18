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
import { axios } from "../../core/axios";
import { useAuth } from "../../auth";

type Fields = {
  title: string;
  file: File;
};

const toast = createStandaloneToast();

export function CreatePost() {
  useAuth(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<Fields>();

  function onSubmit(data: Fields) {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("file", data.file);

    setIsLoading(true);

    axios.post("/posts", formData).then((res) => {
      setIsLoading(false);

      if (res.status !== 201) {
        toast.toast({
          title: "Error",
          description: "Failed to create post",
          variant: "top-accent",
          status: "error",
          position: "top",
          containerStyle: {
            color: "red.800",
          },
        });
        return;
      }

      navigate("/");
    });
  }

  return (
    <Container bgColor="#161A22" padding="2rem">
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