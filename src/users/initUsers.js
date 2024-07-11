import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Importar el modelo de usuario
import UserModel from './user.model.js';

async function connectToMongo () {
    try {
        await mongoose.connect( process.env.URI_MONGO || 'mongodb://localhost:27017/SistemaBancario', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } );
        console.log( 'MongoDB conectado exitosamente.' );
    } catch ( error ) {
        console.error( 'Error al conectar a MongoDB:', error.message );
        process.exit( 1 ); // Termina la aplicación si no se puede conectar a MongoDB
    }
}

async function addUser ( user ) {
    try {
        const existingUser = await UserModel.findOne( { email: user.email } );

        if ( !existingUser ) {
            const salt = await bcryptjs.genSalt( 10 );
            const hashedPassword = await bcryptjs.hash( user.password, salt );

            await UserModel.create( {
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                roleUser: user.roleUser,
                dpi: user.dpi,
                numbercel: user.numbercel,
                birthdate: user.birthdate,
                img: user.img,
                password: hashedPassword
            } );

            console.log( `Added user: ${user.email}` );
        } else {
            console.log( `exists user: ${user.email}` );
        }
    } catch ( error ) {
        console.error( `Error adding user with email ${user.email}:`, error.message );
    }
}

async function addUsers () {
    await connectToMongo();

    //birthdate = > 18 years old. Format YYYY/MM/DD
    const usersToInsert = [
        {
            email: "amax@gmail.com",
            name: "Alejandro",
            lastname: "Max",
            roleUser: "administrador",
            dpi: "1655424890101",
            numbercel: "10101010",
            birthdate: "1999/01/01",
            img: "Foto de Perfil",
            password: "123456"
        },
        {
            email: "bmendoza@gmail.com",
            name: "Brandon",
            lastname: "Mendoza",
            roleUser: "administrador",
            dpi: "5645445450101",
            numbercel: "10101010",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            password: "123456"
        },
        {
            email: "epereira@gmail.com",
            name: "Edson",
            lastname: "Pereira",
            password: "123456",
            roleUser: "administrador",
            dpi: "1591597894625",
            numbercel: "10101010",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        },
        {
            email: "lvaquin@gmail.com",
            name: "Luis",
            lastname: "Vaquin",
            password: "123456",
            roleUser: "administrador",
            dpi: "7319468245679",
            numbercel: "10101010",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        },
        {
            email: "eramirez@gmail.com",
            name: "Ramirez",
            lastname: "Evan",
            password: "123456",
            roleUser: "administrador",
            dpi: "1597534568520",
            numbercel: "10101010",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        },
        {
            email: "gerente@gmail.com",
            name: "gerente",
            lastname: "gerente",
            password: "123456",
            roleUser: "gerente",
            dpi: "7531594568524",
            numbercel: "10101010",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        },
        {
            email: "caja@gmail.com",
            name: "caja",
            lastname: "caja",
            password: "123456",
            roleUser: "caja",
            dpi: "1472583697891",
            numbercel: "10101010",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        },
        {
            email: "services@gmail.com",
            name: "services",
            lastname: "services",
            password: "123456",
            roleUser: "services",
            dpi: "7198256487396",
            numbercel: "73468552",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        },
        {
            email: "ADMINB@gmail.com",
            name: "ADMINB",
            lastname: "ADMINB",
            password: "123456",
            roleUser: "administrador",
            dpi: "103024579819",
            numbercel: "73468552",
            img: "Foto de Perfil",
            birthdate: "1999/01/01",
            stateUser: true,
        }

    ];

    for ( const user of usersToInsert ) {
        await addUser( user );
    }
}

export default addUsers;