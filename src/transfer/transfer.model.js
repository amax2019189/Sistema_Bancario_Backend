import mongoose from "mongoose";

const TransferSchema = mongoose.Schema({
    accountNumberOrigen: {
        type: String,
    },
    accountNumberDestino: {
        type: String,
    },
    amount: {
        type: Number,
    },
    description: {
        type: String,
    },
    saveAsFavorite: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    },
    creatorTransfer: {
        type: String, 
        required: true
    }

}, { timestamps: true })

export default mongoose.model('Transfer', TransferSchema);