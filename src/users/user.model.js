import mongoose, {Schema} from "mongoose";

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
    },
    numbercel: {
        type: Number,
    },
    acounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acount'
    }],
});

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);