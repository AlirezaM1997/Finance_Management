import React, { useEffect } from "react";
import { useAllState } from "../Provider";
import { useQuery, gql } from "@apollo/client";

//chart-js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

//mui
import { Box } from "@mui/system";
import { CircularProgress } from "@material-ui/core";

type MyExpenses = {
  amount: number;
  date: string;
  tags: { _id: number; color: string; name: string };
  geo: { lat: number; lon: number };
  _id: number;
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export default function Chart() {
  const [allData, setAllData] = React.useState<any | null>(null);
  const { parsIsoDate } = useAllState();

  const labels = allData?.getMyExpenses.map((i: MyExpenses) =>
    parsIsoDate(i.date)
  );

  const _data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: allData?.getMyExpenses.map((i: MyExpenses) => i.amount),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const { error, loading, data } = useQuery(MAIN_QUERY);

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
      <Line options={options} data={_data} />
    </>
  );
}
