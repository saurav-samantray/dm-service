const mongoose = require("mongoose");
const logger = require("../config/loggingConfig");

const COLLECTION_PREFIX = "dm_";


async function startDatabase() {
    mongoose.set('strictQuery', false);
    mongoose.connect(
        process.env.MONGODB_URI || "mongodb://od_data_modeling_service:DataModelingOD689@localhost:27017/od_data_modeling_db?retryWrites=true&w=majority&authSource=admin",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info("Connected to MongoDB");
            }
        }
    );
}
module.exports = {
    startDatabase,
    COLLECTION_PREFIX
};