import bcryptjs from 'bcryptjs';
import Users from './user.model.js';

const defaultUsers = [
    {
        "email": "amax@gmail.com",
        "name": "Alejandro",
        "lastname": "Max",
        "dpi": "1655424890101",
        "numbercel": "10101010",
        "img": "Foto de Perfil",
        "password": "123456"
    },
    {
        "email": "bmendoza@gmail.com",
        "name": "Brandon",
        "lastname": "Mendoza",
        "dpi": "5645445450101",
        "numbercel": "10101010",
        "img": "Foto de Perfil",
        "password": "123456"
    },
];

const createDefaultUsers = async () => {
    try {
        for (const userData of defaultUsers) {
            const existingUser = await Users.findOne({ email: userData.email});
            if (!existingUser) {
                const encryptedPassword = bcryptjs.hashSync(userData.password);
                await Users.create({
                    ...userData,
                    password: encryptedPassword,
                })
            }
        }
    } catch (error) {
        console.error('Error creating default users:', error);
    }
};

createDefaultUsers()
    .then(() => {
        console.log('Default user setup completed.');
    })
    .catch((error) => {
        console.log('Error in default users setup:', error);
    });