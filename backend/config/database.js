import mongoose from "mongoose";

const databaseConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
    } catch (error) {
        console.log('error: ' + error)
    }
}

export default databaseConnect;