// src/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

export const getTransactions = async (month, page = 1, search = '') => {
    try {
        const response = await axios.get(`${API_URL}/list`, {
            params: {
                month,
                page,
                search
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};

export const getTransactionStats = async (month) => {
    try {
        const response = await axios.get(`${API_URL}/statistics`, {
            params: { month }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        throw error;
    }
};

export const getTransactionPriceRanges = async (month) => {
    try {
        const response = await axios.get(`${API_URL}/bar-chart`, {
            params: { month }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching transaction price ranges:", error);
        throw error;
    }
};
