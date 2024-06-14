import User from './user.model.js';
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.uid !== id) {
            console.log(req.user.uid, id)
             return res.status(403).json({ msg: 'You are not authorized to update this user' });
        }

        const { _id, password, email, ...rest } = req.body;

        if (password) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt);
        }

        await User.findByIdAndUpdate(id, rest);

         res.status(200).send('Your account has been update');

    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.uid !== id) {
            return res.status(403).send('You are not authorized to delete this user');
        }

        const user = await User.findByIdAndDelete(id);
        res.status(200).send('The user is sucessfully deleted');

    } catch (e) {
        console.error(e);
        res.status(500).send('Contact the administrator');
    }
}