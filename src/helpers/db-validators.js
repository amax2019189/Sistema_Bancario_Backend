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

export const validDpi = async (dpiNumber = '') => {
    if(dpiNumber.length !== 13){
        throw new Error(`The DPI does not is valid`);
    }
}

export const validName = async (name = '') => {
    if(name !== req.user.name){
        throw new Error(`The name is not valid`);
    }
}

