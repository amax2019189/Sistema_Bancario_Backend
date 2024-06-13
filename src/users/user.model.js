import mongoose, {Schema} from "mongoose";

const roles = ['gerente', 'usuario', 'admin'];

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
    img: {
        type: String,
    },
    username: {
        type: String, 
    },
    email: {
        type: String,
        unique: true,
    },
    numbercel: {
        type: Number,
    },
    roleUser: {
        type: String,
        enum: roles,
        default: "usuario",
    },
    password:{
        type: String,
    },
    acounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }],
});

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);