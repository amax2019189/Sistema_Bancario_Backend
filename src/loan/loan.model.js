import mongoose from 'mongoose';
import shortid from 'shortid';

const LoanSchema = new mongoose.Schema({
    userDPI: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum:["aprovada","pendiente", "denegada"],
        required: true,
        default:"pendiente"
    },
    amount: {
        type: Number,
        required: true
    },
    terms: {
        type: Number,
        required: true
    },
    installments: [{
        amount: {
            type: Number,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        paid: {
            type: Boolean,
            default: false
        }
    }],
    loanDate: {
        type: Date,
        default: Date.now
    },
    withdrawal: {
        type: String,
        required: true,
        enum:["cuenta", "caja"]
    },
    withdrawCode: {
        type: String,
        default: shortid.generate,
        unique: true
    },
    withdrawCodeUsed: {
        type: Boolean,
        default: false
    },
    approver:{
        type: String,
    },
    account:{
        type: String,
    }
}, { timestamps: true });

export default mongoose.model('Loan', LoanSchema);
