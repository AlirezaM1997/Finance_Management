import Chart from "./Chart";

//mui
import { Box, Typography } from "@mui/material";
import { ArrowRight } from "@mui/icons-material";

function Reports() {

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
          component="div"
          sx={{
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <ArrowRight
            sx={{
              display: { xs: "none", md: "inline" },
            }}
          />
          Reports
        </Typography>

        <Chart />
      </Box>
    </>
  );
}

export default Reports;
