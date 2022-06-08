import React from "react";
import { Box, Typography } from "@mui/material";
import Chart from "./Chart";

function Reports() {
  return (
    <>
      <Box
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
          Reports
        </Typography>
        <Chart/>
      </Box>
    </>
  );
}

export default Reports;
