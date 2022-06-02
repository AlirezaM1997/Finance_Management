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
  Grid,
  InputLabel,
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
import ListItemText from '@mui/material/ListItemText';

//icon
import { DoneOutline, FiberNew } from "@mui/icons-material";

//components
import Title from "./Title";
import TagInput from "./TagInput";
import { CircularProgress, Input } from "@material-ui/core";

import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  MapContainerProps,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, Map } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

// Generate Order Data
function createData(
  _id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number
) {
  return { _id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  ),
];

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

//modal
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

const Expenses = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tag, setTag] = React.useState("");

  // const mapRef = useRef<any>();
  // console.log(mapRef.current);

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
  console.log(selectedPosition);

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

  // const handleChange = (event: SelectChangeEvent) => {
  //   setTag(event.target.value as string);
  //   // console.log(tag);
  // };

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [tagList, setTagList] = useState([{ name: "test", color: "red" }]);

  const [send_muation] = useMutation(ADD_EXPENSE_MUTATION);

  // console.log(_data);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("llllllllllll");

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const _data = {
      amount: Number(data.get("amount")),
      tags: tagList,
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
      } = await send_muation({
        variables: {
          data: _data,
        },
      });
      // console.log(_data);

      console.log(status);

      // navToDashboard("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  // const [info, setInfo] = useState<IUser>();
  // const { error, loading, data } = useQuery(ME_QUERY, {
  //   onCompleted: setInfo,
  // });

  // if (error) return <p>Dashboard : You are not login!!!</p>;
  // if (loading)
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         marginTop: "2rem",
  //       }}
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );

  const [date, setDate] = React.useState<Date | null>(null);
  const [allData, setAllData] = React.useState<any | null>(null);

  const { error, loading, data } = useQuery(MAIN_QUERY, {
    onCompleted: setAllData,
  });

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
              <TableCell style={{ fontWeight: "bold" }}>Geo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Adress</TableCell>
              <TableCell style={{ fontWeight: "bold" }} align="right">
                Sale Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.shipTo}</TableCell>
                <TableCell>{row.paymentMethod}</TableCell>
                <TableCell align="right">{`$${row.amount}`}</TableCell>
              </TableRow>
            ))}
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
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid item>
                  <TextField
                    // margin="normal"
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

                <Grid item>
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

                
                  <InputLabel id="demo-multiple-label">Tag</InputLabel>
                  <Select
                    labelId="demo-multiple-label"
                    id="demo-multiple"
                    fullWidth
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {allData.getMyTags.map((item : any, i:number) => (
                      <MenuItem key={i} value={item.name}>
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                
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

              <Box width="400px" p={1}>
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
