import mongoose, {Schema} from "mongoose";
import Counter from "./counter.model.js";

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
        unique: true
    },
    creatorDeposit: {
        type: String,
    },
    exchangeRate: {
        type: String,
        enum: ["quetzales","dolares"]
    }
});

DepositSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'operationNumber' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            this.operationNumber = counter.sequence_value.toString().padStart(6, '0'); // Ajusta el número de dígitos si es necesario
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

export default mongoose.model('Deposit', DepositSchema)