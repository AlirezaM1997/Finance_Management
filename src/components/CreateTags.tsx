import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

//mui
import { CircularProgress } from "@material-ui/core";
import { Box, Button, TextField, Typography } from "@mui/material";
import ColorPicker from "material-ui-color-picker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/material/styles";
import { ButtonProps } from "@mui/material/Button";
import { purple } from "@mui/material/colors";

/////////////Modal////////////////////
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));
////////////////////////////////

const GET_TAGS_QUERY = gql`
  query Query {
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

const EDIT_TAG_MUTATION = gql`
  mutation Mutation($id: ID!, $data: tagInfo!) {
    edit_tag(_id: $id, data: $data) {
      status
    }
  }
`;

function CreateTags() {
  const [allTags, setAllTags] = React.useState<any | null>(null);
  const [color, setColor] = useState("#6B6B6B");
  const [tag, setTag] = useState("");
  console.log(tag);
  const [send_muation] = useMutation(ADD_TAG_MUTATION);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);

    try {
      const {
        data: {
          create_tag: { status },
        },
      } = await send_muation({
        variables: {
          data: {
            name: tag,
            color,
          },
        },
      });
      console.log(status);
    } catch (error) {
      console.log(error);
    }
  };

  ////////Modal///////////
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [currentTagIDForEdit, setCurrentTagIDForEdit] = useState<number | null>(
    null
  );
  // const [editedTagName, setEditedTagName] = useState<string | null>(null);
  // const [editedTagColor, setEditedTagColor] = useState<
  //   string | number | undefined
  // >();
  const [editedTagName, setEditedTagName] = useState(
    allTags?.getMyTags.filter(
      (i: { name: string; _id: number; color: string }) =>
        i._id === currentTagIDForEdit
    )[0]?.name
  );
  const [editedTagColor, setEditedTagColor] = useState<string>(
    allTags?.getMyTags.filter(
      (i: { name: string; _id: number; color: string }) =>
        i._id === currentTagIDForEdit
    )[0]?.color
  );

  console.log("editedTagName", editedTagName);
  console.log("editedTagColor", editedTagColor);
  console.log("allTags", allTags);

  const [edit_muation] = useMutation(EDIT_TAG_MUTATION);

  const applyChange = async () => {
    try {
      const {
        data: {
          edit_tag: { status },
        },
      } = await edit_muation({
        variables: {
          id: currentTagIDForEdit,
          data: {
            name: editedTagName
              ? editedTagName
              : allTags.getMyTags.filter(
                  (i: { name: string; _id: number; color: string }) =>
                    i._id === currentTagIDForEdit
                )[0].name,
            color: editedTagColor
              ? editedTagColor
              : allTags.getMyTags.filter(
                  (i: { name: string; _id: number; color: string }) =>
                    i._id === currentTagIDForEdit
                )[0].color,
          },
        },
      });
      console.log(status);
      if (status === 200) {
        refetch();
        setCurrentTagIDForEdit(null);
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { error, loading, data, refetch } = useQuery(GET_TAGS_QUERY);

  useEffect(() => {
    setAllTags(data);
    console.log(data);
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
  if (error) return <p>Error :(</p>;
  console.log(allTags);

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        pl="250px"
        pr="10px"
        pt="80px"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography
          variant="h4"
          gutterBottom
          fontFamily="monospace"
          fontWeight="600"
          borderBottom="dotted 1px #1976d2"

          pb={2}
          align="center"
          component="div"
        >
         #Tags
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box width="50%">
            <TextField
              margin="normal"
              required
              fullWidth
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              id="newTag"
              label="NewTag"
              name="newTag"
              autoComplete="newTag"
              autoFocus
            />
            <label
              style={{ margin: "8px 0", display: "block", fontSize: "12px" }}
            >
              Select Color For Tag :
            </label>
            <ColorPicker
              name="color"
              style={{
                width: "100%",
                background: color,
                cursor: "pointer",
                borderRadius: "0.3rem",
                borderBottom: "none",
              }}
              // defaultValue="gray"
              value={color}
              onChange={(e) => setColor(e)}
              autoComplete="off"
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
        <Box mt={5}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Color</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTags?.getMyTags.map(
                (row: { _id: number; name: string; color: string }) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Button disabled sx={{ background: row.color }}></Button>
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => {
                          handleOpen();
                          setCurrentTagIDForEdit(row._id);
                        }}
                        style={{ padding: "0", justifyContent: "flex-start" }}
                      >
                        EDIT
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} style={{ display: "inline-table" }}>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                defaultValue={
                  allTags?.getMyTags.filter(
                    (i: { name: string; _id: number; color: string }) =>
                      i._id === currentTagIDForEdit
                  )[0]?.name
                }
                value={editedTagName}
                onChange={(e) => setEditedTagName(e.target.value)}
                label="Tag Name"
                autoComplete="newTag"
                autoFocus
              />
              <label
                style={{ margin: "8px 0", display: "block", fontSize: "12px" }}
              >
                Select Color For Tag :
              </label>
              <ColorPicker
                name="color"
                style={{
                  width: "100%",
                  // background: editedTagColor,
                  cursor: "pointer",
                  borderRadius: "0.3rem",
                  borderBottom: "none",
                }}
                defaultValue={
                  allTags?.getMyTags.filter(
                    (i: { name: string; _id: number; color: string }) =>
                      i._id === currentTagIDForEdit
                  )[0]?.color
                }
                value={editedTagColor}
                onChange={(e) => setEditedTagColor(e)}
                autoComplete="off"
              />
              <ColorButton
                variant="contained"
                type="submit"
                sx={{ mt: 3, mb: 2 }}
                fullWidth
                onClick={applyChange}
              >
                Apply Changes
              </ColorButton>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default CreateTags;
