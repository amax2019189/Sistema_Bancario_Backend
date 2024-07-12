import mongoose, { Schema } from "mongoose";

// Subdocument schema for the user information
const UserSubSchema = new Schema({
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    dpi: {
        type: String,
    },
});

const ServiceSchema = new Schema({
    service: {
        type: String,
        enum:["peluqueria", "electricidad", "agua", "zapateria", "telefonia", "ropa"]
    },
    noAccount: {
        type: String
    },
    amount: {
        type: Number
    },
    description: {
        type: String
    },
    dateService: {
        type: Date
    },
    user: UserSubSchema // Using the subdocument schema here
}, { timestamps: true })

export default mongoose.model('Service', ServiceSchema);