import React, { useEffect, useState } from "react";
import { getTransactions } from "../apiService";

const TransactionsTable = ({ month, search }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [month, page, search]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(month, page, search);
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    // setTransactions([
    //   {
    //     id: 1,
    //     title: "Transaction 1",
    //     description: "Description for transaction 1",
    //     price: 150,
    //     category: "Electronics",
    //     sold: true,
    //     image: "https://via.placeholder.com/150",
    //   },
    //   {
    //     id: 2,
    //     title: "Transaction 2",
    //     description: "Description for transaction 2",
    //     price: 200,
    //     category: "Books",
    //     sold: false,
    //     image: "https://via.placeholder.com/150",
    //   },
    //   {
    //     id: 3,
    //     title: "Transaction 3",
    //     description: "Description for transaction 3",
    //     price: 300,
    //     category: "Clothing",
    //     sold: true,
    //     image: "https://via.placeholder.com/150",
    //   },
    // ]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transactions Table</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Category</th>
            <th className="py-2 px-4 border">Sold</th>
            <th className="py-2 px-4 border">Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="py-2 px-4 border">{transaction.id}</td>
              <td className="py-2 px-4 border">{transaction.title}</td>
              <td className="py-2 px-4 border">{transaction.description}</td>
              <td className="py-2 px-4 border">${transaction.price}</td>
              <td className="py-2 px-4 border">{transaction.category}</td>
              <td className="py-2 px-4 border">
                {transaction.sold ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border">
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  className="w-16 h-16 object-cover"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((page) => (page > 1 ? page - 1 : 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
