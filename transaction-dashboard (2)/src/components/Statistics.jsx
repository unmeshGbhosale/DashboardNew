// src/components/TransactionStats.jsx
import React, { useEffect, useState } from "react";
import { getTransactionStats } from "../apiService";

const TransactionStats = ({ month }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [month]);

  const fetchStats = async () => {
    try {
      const data = await getTransactionStats(month);
      setStats(data);
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
    }
    // setStats({
    //   totalSales: 650,
    //   totalSoldItems: 2,
    //   totalNotSoldItems: 1,
    // });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transactions Stats</h2>
      <div className="flex space-x-4 mb-6">
        <div className="bg-white p-4 rounded shadow w-1/3 text-center">
          <h2 className="text-xl font-bold">Total Sales</h2>
          <p className="text-2xl">${stats.totalSaleAmount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow w-1/3 text-center">
          <h2 className="text-xl font-bold">Total Sold Items</h2>
          <p className="text-2xl">{stats.totalSoldItems}</p>
        </div>
        <div className="bg-white p-4 rounded shadow w-1/3 text-center">
          <h2 className="text-xl font-bold">Total Not Sold Items</h2>
          <p className="text-2xl">{stats.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats;
