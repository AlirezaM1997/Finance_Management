import { Box, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";

import { gql, useMutation, useQuery } from "@apollo/client";
import { CircularProgress, TextField } from "@material-ui/core";
import {
  AccountBox,
  AccountBoxOutlined,
  AccountBoxRounded,
  Face,
} from "@mui/icons-material";

const Input = styled("input")({
  display: "none",
});

const EDIT_INFO_MUTATION = gql`
  mutation Mutation($name: String!, $img: Upload) {
    editMe(name: $name, img: $img) {
      status
    }
  }
`;

const ME_QUERY = gql`
  query Query {
    me {
      username
      name
      img
    }
  }
`;

interface IUser {
  me: { username: string; name: string; img: File };
}

interface IFile {
  File: {
    lastModified: number;
    lastModifiedDate: string;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
  };
}
//React.ChangeEvent<HTMLInputElement>

const Profile: FC | any = () => {
  const [info, setInfo] = useState<IUser>();
  const [name, setName] = useState<string | null | undefined>(null);
  const [img, setImg] = useState<File | null | undefined>(null);

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  const handleUploadImg = (e: any) => {
    const file = e.target.files[0];
    setFile(file);

    setImg(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  useEffect(() => {
    let fileReader: any = false;
    let isCancel: any = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  const [edit_muation] = useMutation(EDIT_INFO_MUTATION);

  const applyChange = async () => {
    console.log("name", name);
    console.log("img", img);

    try {
      const {
        data: {
          editMe: { status },
        },
      } = await edit_muation({
        variables: {
          name: name ? name : info?.me.name,
          img: img,
        },
      });
      console.log(status);
      if (status === 200) {
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  ////////Get Info At First Load////////
  const { error, loading, data, refetch } = useQuery(ME_QUERY);

  useEffect(() => {
    if (data) {
      setInfo(data);
      console.log(info);
    }
  }, [data]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return console.log(error);
  console.log(data);

  if (info)
    return (
      <>
        <Box
          pr="10px"
          pt="80px"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{
            pl: { xs: "80px", md: "250px" },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontFamily="system-ui"
            fontWeight="600"
            borderBottom="dotted 1px #1976d2"
            pb={2}
            sx={{
              textAlign: { xs: "center", md: "left" },
            }}
            component="div"
          >
            Profile Setting
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={5}
            mt={4}
          >
            <Stack direction="column" alignItems="center" spacing={1}>
              {fileDataURL ? (
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: 200,
                    maxHeight: { xs: 200, md: 200 },
                    maxWidth: { xs: 250, md: 250 },
                    borderRadius: "50%",
                  }}
                  alt="avatar preview"
                  src={fileDataURL}
                />
              ) : info.me.img ? (
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: 200,
                    maxHeight: { xs: 200, md: 200 },
                    maxWidth: { xs: 250, md: 250 },
                    borderRadius: "50%",
                  }}
                  alt="avatar"
                  src={`http://localhost:80/${info.me.img}`}
                />
              ) : (
                <Face
                  sx={{
                    height: 200,
                    width: 200,
                    maxHeight: { xs: 200, md: 200 },
                    maxWidth: { xs: 350, md: 250 },
                    borderRadius: "50%",
                  }}
                />
              )}
              <label htmlFor="icon-button-file">
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  onChange={(e) => handleUploadImg(e)}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  title="select image"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Stack>
            <TextField
              margin="normal"
              required
              defaultValue={info?.me.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
          </Stack>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: "30px", mb: 2 }}
              onClick={applyChange}
            >
              SUBMIT CHANGES
            </Button>
          </Box>
        </Box>
      </>
    );
};

export default Profile;
