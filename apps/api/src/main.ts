import express from 'express';
import { PrismaClient } from '@prisma/client';
import { todosRouter } from './todos';
import cors from 'cors';
import { loginRouter } from './login';
import { verifyTokenMiddleware } from './verifyTokenMiddleware';

const prisma = new PrismaClient();

const corsOptions = {
  origin: 'http://localhost:4200',
};

const app = express();
app.use(express.json());

app.use(cors(corsOptions));

app.use('/api/login', loginRouter);

app.use('/api/todos', todosRouter);

/** no time to implement login so setting this second route behind token middleware */
app.use('/api/todossecure', verifyTokenMiddleware, todosRouter);

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', (err) => {
  prisma.$disconnect();
  console.error(err);
});
