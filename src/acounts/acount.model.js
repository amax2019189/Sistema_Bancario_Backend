import mongoose, { Schema } from "mongoose";

const accountUses = ['Personal', 'Business', 'Other'];

const AccountSchema = mongoose.Schema({
    accountNumber: {
        type: String,
        unique: true
    },
    accountType: {
        type: String,
        enum: ["monetaria", "monetariaDolares", "ahorro", "ahorroDolares"],
        default: "monetaria"
    },
    accountBalance: {
        type: Number,
        default: 0.00,
    },
    state: {
        type: String,
        enum: ["desactivada", "activa"],
        default: "activa"
    },
    accountUse: {
        type: String,
        enum: accountUses, // Enum para validar los valores de accountUse
        default: 'Personal',
    },
    service: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    }
});

AccountSchema.pre('save', async function(next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const existingAccount = await mongoose.models.Account.findOne({ accountNumber: randomAccountNumber });
            if (!existingAccount) {
                this.accountNumber = randomAccountNumber;
                isUnique = true;
            }
        }
    }
    next();
});

export default mongoose.model('Account', AccountSchema);
