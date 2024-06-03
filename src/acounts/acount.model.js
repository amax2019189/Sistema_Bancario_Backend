import { Double } from "mongodb";
import mongoose, {Schema} from "mongoose";

const acounttypes = ['monetary','saving'];

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
    nopdi: {
        type: Number,
    },
    accounttype: {
        type: String,
        enum: acounttypes,
    },
    accountbalance: {
        type: Double,
    },
});

AcountSchema.methods.toJSON = function(){
    const { __v, password, _id, ...acount} = this.toObject();
    acount.uid = _id;
    return acount;
}

export default mongoose.model('Acount', AcountSchema)