import mongoose, {Schema} from "mongoose";

const MovimientoSchema = mongoose.Schema({
    tipo: {
        type: String,
        enum: ["deposito", "transferenciaEnviada", "transferenciaRecibida"],
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    descripcion: {
        type: String
    },
    cuentaDestino: {
        type: String, // Número de cuenta destino en caso de transferencia
    },
    cuentaOrigen: {
        type: String, // Número de cuenta origen en caso de transferencia recibida
    },
    operationNumber: {
        type: String,
    },
});

const AccountSchema = mongoose.Schema({
    accountNumber: {
        type:String,
        unique: true
    },
    alias:{ 
        type:String,
    },
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    dpiNumber: {
        type: String,
    },
    accountType: {
        type: String,
        enum: [ "monetaria", "monetariaDolares", "ahorro", "ahorroDolares"]
    },
    accountBalance : {
        type: Number,
        default: 0.00,
    },
    movements: [MovimientoSchema],
    state: {
        type: String,
        enum: ["desactivada","activa"],
        default: "activa"
    },
    
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