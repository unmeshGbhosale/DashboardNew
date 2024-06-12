import { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import TransactionStats from "./components/Statistics";
import TransactionsBarChart from "./components/BarChart";

function App() {
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const months = [
    "January",
    "February",
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
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <>
      <div className="p-6 flex justify-between">
        <div className="mb-4 flex items-center">
          <label htmlFor="month" className="mr-2 font-medium">
            Select Month:
          </label>
          <select
            id="month"
            value={month}
            onChange={handleMonthChange}
            className="border rounded p-2"
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <TransactionsTable month={month} search={search} />
      <TransactionStats month={month} />
      <TransactionsBarChart month={month} />
    </>
  );
}

export default App;
