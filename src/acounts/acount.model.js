import mongoose, {Schema} from "mongoose";

const AccountSchema = mongoose.Schema({
    accountNumber: {
        type:String,
        unique: true
    },
    accountType: {
        type: String,
        enum: [ "monetaria", "monetariaDolares", "ahorro", "ahorroDolares"],
        default: "monetaria"
    },
    accountBalance : {
        type: Number,
        default: 0.00,
    },
    state: {
        type: String,
        enum: ["desactivada","activa"],
        default: "activa"
    },
    accountUse:{
        type:String,
        enum: ["personal","empresarial"],
        default: "Personal"
    },
    service:{
        type:String,
    }
})

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

export default mongoose.model('Account', AccountSchema)