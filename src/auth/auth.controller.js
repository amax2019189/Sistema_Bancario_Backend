import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const register = async (req, res) => {
    try {
        const { email, username, password} = req.body;
        const encryptPassword = bcryptjs.hashSync(password);

        const user = await User.create()
    } catch (e) {
        console.log(e);
        return res.status(500).send("Failed to register user");
    }
}