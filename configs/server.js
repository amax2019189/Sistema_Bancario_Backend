import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import '../src/users/initUsers.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
 
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/sistemaBancario/v1/auth'
        this.userPath = '/sistemaBancario/v1/user'

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
        this.app.use(this.userPath, userRoutes);
    };
 
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}
 
export default Server;