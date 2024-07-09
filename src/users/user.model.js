import mongoose, {Schema} from "mongoose";

const FavoriteSchema = mongoose.Schema({
    accountNumber: {
        type: String,
        required: true
    },
    alias: {
        type: String,
    },
});

const roles = ['gerente', 'administrador', 'usuario', 'caja', 'services'];

const UserSchema = mongoose.Schema({
    dpi: {
        type: String,
    },
    
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
    },
    img: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    numbercel: {
        type: Number,
    },
    address: {
        type: String,
    },
    namwork: {
        type: String,
    },
    monthlyincome: {
        type: Number,
    } ,
    roleUser: {
        type: String,
        enum: roles,
        default: "usuario",
    },
    password:{
        type: String,
    },
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        default:[]
    }],
    favorites: [FavoriteSchema],
});

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);