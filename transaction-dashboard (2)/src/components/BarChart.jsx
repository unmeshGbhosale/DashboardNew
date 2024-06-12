// src/components/TransactionsBarChart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getTransactionPriceRanges } from "../apiService";

const TransactionsBarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPriceRanges();
  }, [month]);

  const fetchPriceRanges = async () => {
    try {
      const data = await getTransactionPriceRanges(month);
      setData(data);
    } catch (error) {
      console.error("Error fetching transaction price ranges:", error);
    }
    // setData([
    //   { priceRange: "0-100", count: 5 },
    //   { priceRange: "100-200", count: 3 },
    //   { priceRange: "200-300", count: 2 },
    //   { priceRange: "300-400", count: 1 },
    // ]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transactions Price Range</h2>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TransactionsBarChart;
