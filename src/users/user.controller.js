import User from './user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función para verificar y obtener el usuario a partir del token
const getUserByToken = async (token) => {
    try {
        const decoded = jwt.verify(token, '$i$tem@B@nc@ri0_bim3'); // Reemplaza 'secret_key' con tu clave secreta
        const userId = decoded.uid;
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1]; // Suponiendo que el token está en el header 'Authorization'

        // Obtener el usuario autenticado desde el token
        const authenticatedUser = await getUserByToken(token);

        // Verificar si el usuario autenticado tiene permisos para actualizar
        if (!authenticatedUser || authenticatedUser._id.toString() !== id) {
            return res.status(403).json({ msg: 'No estás autorizado para actualizar este usuario' });
        }

        const { _id, password, email, ...rest } = req.body;

        if (password) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt);
        }

        await User.findByIdAndUpdate(id, rest);

        res.status(200).send('Tu cuenta ha sido actualizada');

    } catch (e) {
        console.error(e);
        res.status(500).send('Error en el servidor');
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1]; // Suponiendo que el token está en el header 'Authorization'

        // Obtener el usuario autenticado desde el token
        const authenticatedUser = await getUserByToken(token);

        // Verificar si el usuario autenticado tiene permisos para eliminar
        if (!authenticatedUser || authenticatedUser._id.toString() !== id) {
            return res.status(403).json({ msg: 'No estás autorizado para eliminar este usuario' });
        }

        const user = await User.findByIdAndDelete(id);
        res.status(200).send('El usuario ha sido eliminado exitosamente');

    } catch (e) {
        console.error(e);
        res.status(500).send('Contacta al administrador');
    }
};
