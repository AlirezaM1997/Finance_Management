import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/system';
import { CircularProgress } from '@material-ui/core';
import { useQuery,gql } from '@apollo/client';


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
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

 const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

export default function Chart() {

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
    

  return <Line options={options} data={data} />;
}
