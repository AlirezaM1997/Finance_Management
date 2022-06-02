import { gql, useMutation } from "@apollo/client";
import { Box, Button, TextField, Typography } from "@mui/material";


import React, { useState } from "react";

const ADD_TAG_MUTATION = gql`
  mutation Mutation($data: tagInfo!) {
    create_tag(data: $data) {
      status
      msg
    }
  }
`;



function CreateTags() {



  const [send_muation] = useMutation(ADD_TAG_MUTATION);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const {
        data: {
          create_tag: { status },
        },
      } = await send_muation({
        variables: {
          data: {
            name: data.get("newTag"),
            color: 'red',
          },
        },
      });
      console.log(status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        pl="250px"
        pr="10px"
        pt="80px"
        width="100%"
      >
        <Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newTag"
            label="NewTag"
            name="newTag"
            autoComplete="newTag"
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateTags;
