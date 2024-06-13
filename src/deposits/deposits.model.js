import mongoose, {Schema} from "mongoose";

const DepositSchema = mongoose.Schema({
    accountNumberDestino: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    operationNumber: {
        type: String,
    }
});

export default mongoose.model('Deposit', DepositSchema)