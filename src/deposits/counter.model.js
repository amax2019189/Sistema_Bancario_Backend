import mongoose from "mongoose";

const CounterSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sequence_value: {
        type: Number,
        required: true
    }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Función para inicializar el contador
const initializeCounter = async () => {
    try {
        let counter = await Counter.findOne({ _id: 'operationNumber' });

        if (!counter) {
            counter = new Counter({ _id: 'operationNumber', sequence_value: 1 });
            await counter.save();
            console.log('Counter initialized', counter);
        } else {
            console.log('Counter already initialized', counter);
        }
    } catch (error) {
        console.error('Error initializing counter', error);
    }
};

// Llamar a la función para inicializar el contador
initializeCounter();

export default Counter;