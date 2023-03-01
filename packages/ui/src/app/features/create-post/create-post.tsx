import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  createStandaloneToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import FileUpload from "./file-upload";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { PostsRepository } from "../../core/repositories/posts.repository";

type Fields = {
  title: string;
  file: File;
  goal: string;
};

const toast = createStandaloneToast();

export function CreatePost() {
  useAuth(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<Fields>();

  function onSubmit(data: Fields) {
    setIsLoading(true);

    PostsRepository.create(data)
      .then((res) => {
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
      })
      .finally(() => {
        setIsLoading(false);
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
        <FormControl>
          <FormLabel>Goal</FormLabel>
          <Textarea
            data-cy="goal"
            bgColor="#252931"
            border="1px solid"
            borderColor="#30353d"
            _hover={{
              borderColor: "#30353d",
            }}
            {...register("goal", { required: true })}
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
