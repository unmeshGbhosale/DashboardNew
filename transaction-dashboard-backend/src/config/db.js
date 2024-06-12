const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Unmesh:unmesh%40123@cluster0.hrslyft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
// unmesh 
// unmesh @123
// mongodb + srv://Unmesh:<password>@cluster0.hrslyft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0