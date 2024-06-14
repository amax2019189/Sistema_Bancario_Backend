import mongoose, {Schema} from 'mongoose';

const favoritesSchema = mongoose.Schema({
    accountNumber: {
        type: String,
    },
    dpiNumber: {
        type: String,
    },
});

export default mongoose.model('Favorites', favoritesSchema)