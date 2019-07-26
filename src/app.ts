import express from 'express';
import cors from 'cors';
import { productsRouter } from './routes/catagories';
import { categRouter } from './routes/catagories';
import { logMiddleware } from './middleware/log';
import { logErrors, clientErrorHandler, errorHandler } from './middleware/error';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
console.log(path.join(__dirname,'static'));
app.use('/public',express.static(path.join(__dirname,'static')));

app.use(logMiddleware);
app.use('/products',productsRouter);
app.use('/categories',categRouter);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

export { app };
