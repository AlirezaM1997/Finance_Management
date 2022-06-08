import React, { useState, useRef, useEffect, FC, RefAttributes } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

//mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { CircularProgress } from "@material-ui/core";
import { Theme, useTheme } from "@mui/material/styles";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, Map } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

//icon
import { DoneOutline, FiberNew } from "@mui/icons-material";

//components
import Title from "./Title";

const parsIsoDate = (date: string) => {
  const months = [
    "Janury",
    "Februry",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const a = new Date(date);
  const year = a.getFullYear();
  const month = a.getMonth();
  const day = a.getDay();
  return `${months[month - 1]} ${day} ,${year}`;
};

////////////Select Input//////////////
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, tags: readonly string[], theme: Theme) {
  return {
    fontWeight:
      tags.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
///////////////////////////////////////

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
////////////////////////////////

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

const ADD_EXPENSE_MUTATION = gql`
  mutation Mutation($data: ExpenseInfo!) {
    create_expense(data: $data) {
      status
      msg
    }
  }
`;

const DELETE_EXPENSE_MUTATION = gql`
  mutation Mutation($id: ID!) {
    delete_expense(_id: $id) {
      status
    }
  }
`;

const Expenses = () => {
  ////////Modal///////////
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  ///////////Date//////////////////
  const [date, setDate] = React.useState<Date | null>(null);

  /////////Leaflet//////////
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    51.505, -0.09,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);
  // console.log(selectedPosition);

  const Markers = () => {
    const map = useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return selectedPosition ? (
      <Marker
        key={selectedPosition[0]}
        position={selectedPosition}
        interactive={false}
        icon={
          new Icon({
            iconUrl: markerIconPng,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }
      />
    ) : null;
  };

  ////////Select Input////////////
  const theme = useTheme();
  const [tags, setTags] = React.useState<string[]>([]);
  const [_tags, _setTags] = React.useState<number[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof tags>) => {
    const {
      target: { value },
    } = event;

    setTags(typeof value === "string" ? value.split(",") : value);

    console.log("tags:", tags);
  };

  // useEffect(() => {
  //   const arr = allData?.getMyTags.filter(
  //     (i: any, j: number) => i.name === tags[j]
  //   );
  //   console.log("arr:", arr);

  //   _setTags(arr?.map((i: any) => i._id));
  // }, [tags]);

  useEffect(() => {
    console.log("tags", tags);
  }, [tags]);

  ///////////Query/////////////////
  const [send_muation_new_expense] = useMutation(ADD_EXPENSE_MUTATION);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const _data = {
      amount: Number(data.get("amount")),
      tags: tags,
      date: date,
      geo: {
        lat: selectedPosition[0],
        lon: selectedPosition[1],
      },
    };

    try {
      const {
        data: {
          create_expense: { status },
        },
      } = await send_muation_new_expense({
        variables: {
          data: _data,
        },
      });
      if (status === 200) {
        // setTags([]);
        // setDate(null);
        // data.set("amount", "");
        refetch();
        handleClose();
      }
      console.log(status);

      // navToDashboard("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const [send_muation_delete_expense] = useMutation(DELETE_EXPENSE_MUTATION);

  const deleteExpense = async (_id: number) => {
    try {
      const {
        data: {
          delete_expense: { status },
        },
      } = await send_muation_delete_expense({
        variables: {
          id: _id,
        },
      });
      if (status === 200) refetch();

      console.log(status);
      console.log(allData);
    } catch (error) {
      console.log(error);
    }
  };

  const [allData, setAllData] = React.useState<any | null>(null);

  const { error, loading, data, refetch } = useQuery(MAIN_QUERY);

  useEffect(() => {
    setAllData(data);
    console.log(allData);
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
  console.log(allData);

  return (
    <>
      <Box pl="250px" pr="10px" pt="80px" width="100%">
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
          Expenses
        </Typography>
        <Box display="flex" justifyContent="space-between" mb="15px">
          <Title>Recent Expenses</Title>
          <Button
            variant="contained"
            startIcon={<FiberNew />}
            onClick={handleOpen}
          >
            Add New
          </Button>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Place</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>tags</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allData?.getMyExpenses.map(
              (row: {
                _id: number;
                date: string;
                amount: number;
                place: string;
                tags: { name: string; color: string }[];
              }) => (
                <TableRow key={row._id}>
                  <TableCell>{parsIsoDate(row.date)}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.place}</TableCell>
                  <TableCell>
                    {row.tags.map(
                      (i: { name: string; color: string }, j: React.Key) => (
                        <Chip
                          style={{
                            background: i.color,
                            color: "white",
                            margin: "0.3rem 0.3rem 0.3rem 0",
                          }}
                          label={i.name}
                          key={j}
                        />
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteExpense(row._id)}
                      style={{ padding: "0", justifyContent: "flex-start" }}
                    >
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
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
            <Box display="flex">
              <DoneOutline style={{ marginRight: "1rem" }} />
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Add a new expense
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, display: "flex" }}
            >
              <Grid
                container
                gap={3}
                p={1}
                style={{
                  width: "270px",
                  display: "inline",
                  flexDirection: "column",
                }}
              >
                <Grid item mb={3}>
                  <TextField
                    required
                    fullWidth
                    id="amount"
                    label="Amount"
                    name="amount"
                    autoComplete="amount"
                    type="number"
                    autoFocus
                  />
                </Grid>

                <Grid item mb={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Date"
                      value={date}
                      // style={{ width: "100%" }}
                      onChange={(newValue) => {
                        setDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item display="flex" mb={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-multiple-tags-label">Tags</InputLabel>
                    <Select
                      labelId="demo-multiple-tags-label"
                      id="demo-multiple-tags"
                      multiple
                      value={tags}
                      onChange={(e) => handleChange(e)}
                      input={
                        <OutlinedInput id="select-multiple-tags" label="Tags" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                allData?.getMyTags.filter(
                                  (i: any) => i._id === value
                                )[0].name
                              }
                            />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {allData?.getMyTags.map(
                        (
                          item: { name: string; _id: number; color: string },
                          i: React.Key | null | undefined
                        ) => (
                          <MenuItem
                            key={i}
                            value={item._id}
                            style={getStyles(item.name, tags, theme)}
                          >
                            {item.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    // sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>

              <Box p={1}>
                <MapContainer
                  // center={[51.505, -0.09]}
                  center={selectedPosition || initialPosition}
                  // whenCreated={setMap}
                  zoom={16}
                  scrollWheelZoom={false}
                  // ref={mapRef}
                  style={{
                    width: "400px",
                    height: "100%",
                    display: "flex",
                    borderRadius: "0.4rem",
                  }}
                >
                  <Markers />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* <Marker 
                    position={[51.505, -0.09]}
                    eventHandlers={{
                      click: (e : any) => {
                        console.log('marker clicked', e)
                      },
                    }}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                  </Marker> */}
                </MapContainer>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Expenses;
