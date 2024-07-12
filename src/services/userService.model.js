import mongoose, {Schema} from "mongoose";

const roles = ['gerente', 'administrador', 'usuario', 'caja', 'services'];

const UserServiceSchema = mongoose.Schema({
    dpi: {
        type: String,
    },
    
    companyName: {
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
});

UserServiceSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('UserService', UserServiceSchema);