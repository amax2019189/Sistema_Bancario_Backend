export const validateRegister = async (req, res) => {
    try {
        const { email, name, lastname, password, roleUser, dpi, numbercel, img } = req.body;

        // Esto va a validar que los datos que se solicitan existen o estan presentes en la propia peticiòn
        if (!email || !name || !lastname || !password || !roleUser || !dpi || !numbercel) {
            return res.status(400).send({msg: 'All fields are required'});
        }

        // Esto valida el formato del correo electronico
        if (!Validator.isEmail(email)) {
            return res.status(400).send({msg: 'Invalid email format'});
        }

        // Esto valida que el correo ya este creado correctamente
        const existingUser = await UserActivation.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).send({msg: 'Email is already registered'});
        }

        // Esto valida el numero de telefono
        if (!ValidatorsImpl.isNumeric(numbercel) || numbercel.length < 8) {
            return res.status(400).send({msg: 'Invalid phone number'});
        }

    } catch (e) {
        console.log(e);
        return res.status(500).send('Failed to register user');
    }
};