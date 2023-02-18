import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Icon,
  FormHelperText,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { Control, useController } from "react-hook-form";
import { ChangeEvent, useRef } from "react";

type Props = {
  control: Control<any>;
};

const FileUpload = ({ control }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null!);
  const {
    field: { ref, value, onChange, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name: "file",
    control,
    rules: { required: true },
  });

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    onChange(e.target.files[0]);
  }

  return (
    <FormControl isInvalid={invalid}>
      <FormLabel htmlFor="writeUpFile">Audio Recording</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FiFile} />}
        />
        <input
          type="file"
          accept="audio/mpeg"
          data-testid="file"
          ref={inputRef}
          onChange={handleFileChange}
          data-cy="file"
          {...inputProps}
          style={{ display: "none" }}
        />
        <Input
          as="button"
          bgColor="#252931"
          textAlign="left"
          border="1px solid"
          borderColor="#30353d"
          placeholder="Your recording..."
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          _hover={{
            borderColor: "#30353d",
          }}
        >
          {value?.name ?? ""}
        </Input>
      </InputGroup>
      <FormHelperText>A recording must not exceed the 5mb limit</FormHelperText>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  );
};

export default FileUpload;
