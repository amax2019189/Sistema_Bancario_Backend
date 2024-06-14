import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
<<<<<<< HEAD
import '../src/users/initUsers.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
=======
import authRoutes from '../src/auth/auth.routes.js';
import accountRoutes from '../src/acounts/account.routes.js';

>>>>>>> 14bd49a68d7a5db8ba0f5400d8df2100beb75b87
 
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/sistemaBancario/v1/auth'
<<<<<<< HEAD
        this.userPath = '/sistemaBancario/v1/user'

=======
        this.accountPath = '/sistemaBancario/v1/account'
>>>>>>> 14bd49a68d7a5db8ba0f5400d8df2100beb75b87
        this.conectarDB();
        this.middlewares();
        this.routes();
    }
 
    async conectarDB() {
        await dbConnection();
    }
 
   
    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    };
 
   
    routes() {  
        this.app.use(this.authPath, authRoutes);
<<<<<<< HEAD
        this.app.use(this.userPath, userRoutes);
=======
        this.app.use(this.accountPath, accountRoutes);
>>>>>>> 14bd49a68d7a5db8ba0f5400d8df2100beb75b87
    };
 
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}
 
export default Server;