import React, { useState, useEffect } from "react";
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
  Chip,
  FormControl,
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
import { CircularProgress } from "@material-ui/core";
import { Theme, useTheme } from "@mui/material/styles";
//leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, Map } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
//icon
import { ArrowRight, DoneOutline, FiberNew } from "@mui/icons-material";
//components
import { useAllState } from "../Provider";
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
/////////////Query//////////////
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
      address {
        FormattedAddress
      }
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
export default function Expenses() {
  ////////Modal///////////
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  ///////////Date//////////////////
  const [date, setDate] = React.useState<Date | null>(null);
  const { parsIsoDate } = useAllState();
  /////////Leaflet//////////
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    35.7219, 51.3347,
  ]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);
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
  const handleChange = (event: SelectChangeEvent<typeof tags>) => {
    const {
      target: { value },
    } = event;
    setTags(typeof value === "string" ? value.split(",") : value);
  };
  useEffect(() => {
    console.log("tags", tags);
  }, [tags]);
  ////////////Get Address///////////////
  type asyncFunc = (lat: any, lon: any) => any;
  const getAddress: asyncFunc = async (lat, lon) => {
    const response = await fetch(
      `https://api.neshan.org/v4/reverse?lat=${lat}&lng=${lon}`,
      {
        method: "GET",
        headers: {
          "Api-Key": "service.PYI4K3xwSKjpG9helRAKrQLrdpqsIk5tLA6spiAd",
        },
      }
    );
    const res = await response.json();
    return String(res.formatted_address);
  };
  ///////////Query & Mutation/////////////////
  const [send_muation_new_expense] = useMutation(ADD_EXPENSE_MUTATION);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const _FormattedAddress = await getAddress(
      selectedPosition[0],
      selectedPosition[1]
    );
    const _data = {
      amount: Number(data.get("amount")),
      tags: tags,
      date: date,
      geo: {
        lat: selectedPosition[0],
        lon: selectedPosition[1],
      },
      address: {
        FormattedAddress: _FormattedAddress,
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
        refetch();
        setTags([]);
        setDate(null);
        handleClose();
      }
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
    } catch (error) {
      console.log(error);
    }
  };
  const [allData, setAllData] = useState<any | null>(null);
  const { error, loading, data, refetch } = useQuery(MAIN_QUERY);
  useEffect(() => {
    setAllData(data);
  }, [data]);
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "2rem",
          pt: "6rem",
          pl: { xs: "70px", md: "250px" },
          pr: { xs: "20px", md: "10px" },
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <p>Error :(</p>;
  return (
    <>
      <Box
        pt="80px"
        width="100%"
        sx={{
          pl: { xs: "70px", md: "250px" },
          pr: { xs: "20px", md: "10px" },
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
          <ArrowRight
            sx={{
              display: { xs: "none", md: "inline" },
            }}
          />
          Expenses
        </Typography>
        <Box display="flex" justifyContent="space-between" mb="15px">
          <Typography
            variant="h4"
            fontWeight="500"
            ml={1}
            sx={{
              fontSize: { xs: "0.85rem", sm: "1.25rem" },
            }}
            component="div"
          >
            Recent Expenses
          </Typography>
          <Button
            variant="contained"
            startIcon={<FiberNew />}
            onClick={handleOpen}
            sx={{
              fontSize: { xs: "0.6rem", sm: "0.875rem" },
              padding: { xs: "4px 6px", sm: "6px 16px" },
            }}
          >
            Add New
          </Button>
        </Box>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.6rem", sm: "0.875rem" },
                  padding: { xs: "0", sm: "6px 16px" },
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.6rem", sm: "0.875rem" },
                  padding: { xs: "0", sm: "6px 16px" },
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.6rem", sm: "0.875rem" },
                  padding: { xs: "0", sm: "6px 16px" },
                }}
              >
                Place
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.6rem", sm: "0.875rem" },
                  padding: { xs: "0", sm: "6px 16px" },
                }}
              >
                tags
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.6rem", sm: "0.875rem" },
                  padding: { xs: "0", sm: "6px 16px" },
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allData?.getMyExpenses.map(
              (row: {
                _id: number;
                date: string;
                amount: number;
                geo: { lat: number; lon: number };
                tags: { name: string; color: string }[];
                address: { FormattedAddress: string };
              }) => (
                <TableRow key={row._id}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "0.6rem", sm: "0.875rem" },
                      padding: { xs: "0", sm: "6px 16px" },
                    }}
                  >
                    {parsIsoDate(row.date)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "0.6rem", sm: "0.875rem" },
                      padding: { xs: "0", sm: "6px 16px" },
                    }}
                  >
                    {row.amount} $
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "0.6rem", sm: "0.875rem" },
                      padding: { xs: "0", sm: "6px 16px" },
                      fontFamily: "system-ui",
                    }}
                  >
                    {row.address.FormattedAddress}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "0.6rem", sm: "0.875rem" },
                      padding: { xs: "0", sm: "6px 16px" },
                    }}
                  >
                    {row.tags.map(
                      (i: { name: string; color: string }, j: React.Key) => (
                        <Chip
                          sx={{
                            background: i.color,
                            color: "white",
                            margin: "0.3rem 0.3rem 0.3rem 0",
                            fontSize: { xs: "0.6rem", sm: "0.875rem" },
                          }}
                          label={i.name}
                          key={j}
                        />
                      )
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      padding: { xs: "0", sm: "6px 16px" },
                    }}
                  >
                    <Button
                      onClick={() => deleteExpense(row._id)}
                      sx={{
                        padding: "0",
                        justifyContent: "center",
                        fontSize: { xs: "0.6rem", sm: "0.875rem" },
                      }}
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
                    label="Amount($)"
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
                  <Button type="submit" fullWidth variant="contained">
                    Submit
                  </Button>
                </Grid>
              </Grid>
              <Box p={1}>
                <MapContainer
                  center={selectedPosition || initialPosition}
                  zoom={14}
                  scrollWheelZoom={false}
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
                </MapContainer>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}