import mongoose from 'mongoose';

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
        enum: ["aprovada", "pendiente", "denegada"], // Corrige el typo en "aprobada"
        required: true,
        default: "pendiente"
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
        enum: ["cuenta", "caja"]
    },
    withdrawCode: {
        type: String,
        unique: true
    },
    withdrawCodeUsed: {
        type: Boolean,
        default: false
    },
    approver: {
        type: String,
    },
    account: {
        type: String,
    }
}, { timestamps: true });

LoanSchema.pre('save', async function(next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const existingLoan = await mongoose.models.Loan.findOne({ withdrawCode: randomAccountNumber });
            if (!existingLoan) {
                this.withdrawCode = randomAccountNumber;
                isUnique = true;
            }
        }
    }
    next();
});
export default mongoose.model('Loan', LoanSchema);