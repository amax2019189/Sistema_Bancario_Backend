import mongoose from 'mongoose';

const CajaSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        required: true
    },
    transactionType: {
        type: String,
        enum: ['withdrawal', 'payment'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Caja', CajaSchema);