import mongoose, {Schema} from "mongoose";

const AcountSchema = mongoose.Schema({
    noacount: {
        type: Number,
    },
    alias: {
        type: String,
    },
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    token: {
        type: Number
    }
});