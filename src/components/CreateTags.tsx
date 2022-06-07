import { gql, useMutation } from "@apollo/client";
import { Box, Button, TextField } from "@mui/material";
import ColorPicker from "material-ui-color-picker";

import React, { useState } from "react";
const MAIN_QUERY = gql`
  query Query {
    getMyExpenses {
      _id
      amount
      tags {
        _id
        name
        color
      }
      geo {
        lat
        lon
      }
      date
    }
    getMyTags {
      _id
      name
      color
    }
  }
`;



const ADD_TAG_MUTATION = gql`
  mutation Mutation($data: tagInfo!) {
    create_tag(data: $data) {
      status
      msg
    }
  }
`;

function CreateTags() {
  const [color, setColor] = useState("#6B6B6B");

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
            color,
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
        display='flex'
        justifyContent='center'
      >
        <Box width='50%'>
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
          <label style={{margin:'8px 0' , display:'block',fontSize:'12px'}}>SELECT COLOR FOR TAG :</label>
          <ColorPicker
            name="color"
            style={{ width: "100%", background: color , cursor:'pointer' , borderRadius:'0.3rem', borderBottom:'none'}}
            // defaultValue="gray"
            value={color}
            onChange={(e) => setColor(e)}
            autoComplete='off'
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
