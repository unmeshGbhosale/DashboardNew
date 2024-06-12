const axios = require('axios');
const Transaction = require('../models/TransactionsModel');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany();

        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const getMonthNumber = (monthName) => {
    const months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };
    return months[monthName];
};

const listTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    const monthNumber = getMonthNumber(month);

    if (!monthNumber) {
        return res.status(400).json({ message: 'Invalid month provided' });
    }

    try {
        // Build the base query
        let query = [
            {
                $addFields: {
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: {
                    month: monthNumber
                }
            }
        ];

        // Add search criteria if search parameter is present
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.push({
                $match: {
                    $or: [
                        { title: { $regex: searchRegex } },
                        { description: { $regex: searchRegex } },
                        { price: { $regex: searchRegex } }
                    ]
                }
            });
        }

        // Add pagination
        const skip = (parseInt(page, 10) - 1) * parseInt(perPage, 10);
        query.push({ $skip: skip });
        query.push({ $limit: parseInt(perPage, 10) });

        const transactions = await Transaction.aggregate(query);
        const totalTransactions = await Transaction.aggregate([
            ...query.slice(0, -2), // remove skip and limit for total count
            { $count: "total" }
        ]);

        const total = totalTransactions[0]?.total || 0;
        const totalPages = Math.ceil(total / perPage);

        res.status(200).json({
            transactions,
            page: parseInt(page, 10),
            perPage: parseInt(perPage, 10),
            total,
            totalPages
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthNumber = getMonthNumber(month);
    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const transactions = await Transaction.aggregate([
            {
                $addFields: {
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: {
                    month: parseInt(monthNumber)
                }
            }
        ]);

        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.status(200).json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getBarChartData = async (req, res) => {
    const { month } = req.query;
    const monthNumber = getMonthNumber(month);
    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const transactions = await Transaction.aggregate([
            {
                $addFields: {
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: {
                    month: parseInt(monthNumber)
                }
            }
        ]);

        const priceRanges = [
            { range: '0-100', min: 0, max: 100, count: 0 },
            { range: '101-200', min: 101, max: 200, count: 0 },
            { range: '201-300', min: 201, max: 300, count: 0 },
            { range: '301-400', min: 301, max: 400, count: 0 },
            { range: '401-500', min: 401, max: 500, count: 0 },
            { range: '501-600', min: 501, max: 600, count: 0 },
            { range: '601-700', min: 601, max: 700, count: 0 },
            { range: '701-800', min: 701, max: 800, count: 0 },
            { range: '801-900', min: 801, max: 900, count: 0 },
            { range: '901-above', min: 901, max: Infinity, count: 0 },
        ];

        transactions.forEach(transaction => {
            priceRanges.forEach(range => {
                if (transaction.price >= range.min && transaction.price <= range.max) {
                    range.count += 1;
                }
            });
        });

        res.status(200).json(priceRanges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPieChartData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const transactions = await Transaction.aggregate([
            {
                $addFields: {
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: {
                    month: parseInt(month)
                }
            }
        ]);

        const categoryCounts = transactions.reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + 1;
            return acc;
        }, {});

        const categories = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCombinedData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const transactionsPromise = Transaction.aggregate([
            {
                $addFields: {
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: {
                    month: parseInt(month)
                }
            }
        ]);

        const statisticsPromise = transactionsPromise.then(transactions => {
            const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
            const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
            const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;
            return { totalSaleAmount, totalSoldItems, totalNotSoldItems };
        });

        const barChartPromise = transactionsPromise.then(transactions => {
            const priceRanges = [
                { range: '0-100', min: 0, max: 100, count: 0 },
                { range: '101-200', min: 101, max: 200, count: 0 },
                { range: '201-300', min: 201, max: 300, count: 0 },
                { range: '301-400', min: 301, max: 400, count: 0 },
                { range: '401-500', min: 401, max: 500, count: 0 },
                { range: '501-600', min: 501, max: 600, count: 0 },
                { range: '601-700', min: 601, max: 700, count: 0 },
                { range: '701-800', min: 701, max: 800, count: 0 },
                { range: '801-900', min: 801, max: 900, count: 0 },
                { range: '901-above', min: 901, max: Infinity, count: 0 },
            ];

            transactions.forEach(transaction => {
                priceRanges.forEach(range => {
                    if (transaction.price >= range.min && transaction.price <= range.max) {
                        range.count += 1;
                    }
                });
            });

            return priceRanges;
        });

        const [transactions, statistics, barChart] = await Promise.all([
            transactionsPromise,
            statisticsPromise,
            barChartPromise
        ]);

        res.status(200).json({ transactions, statistics, barChart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = { initializeDatabase, listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData };



