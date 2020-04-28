require('express-async-errors'); 
const error = require('./middleware/error');
const users = require('./routes/users');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


class Server {
    constructor() {
        this.initMiddleware();
        this.routes();
        this.start();
    }
    start() {
        app.listen(port, () => console.log(`Server is listening on ${port}...`));
    }
    initMiddleware() {
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
    }
    routes() {
        app.use('/api/users', users);
        /** Adding Error Handling Middleware */
        app.use(error);
    }
}
new Server();
