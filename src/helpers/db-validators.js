import User from '../users/user.model.js';

export const existEmail = async (email = '') => {
    const existEmail = await User.findOne({email});
    if (existEmail){
        throw new Error(`The email ${email} has already been registered`);
    }
}

export const existUserById = async (id = '') => {
    const existUser = await User.findById(id);
    if(!existUser){
        throw new Error(`The ID: ${email} does not exist`);
    }
}


// Función de validación de tipo de cuenta
export const validType = async (accountType = '') => {
    const validTypes = ["monetaria", "monetariaDolares", "ahorro", "ahorroDolares"];
    if (!validTypes.includes(accountType)) {
        throw new Error('The account type is not valid');
    }
}

// Función de validación de DPI
export const validDpi = async (dpiNumber = '') => {
    if (typeof dpiNumber !== 'string' || dpiNumber.length !== 13) {
        throw new Error('The DPI is not valid');
    }
}

