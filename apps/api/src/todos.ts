import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { parseExpressRequest } from './helpers';

const prisma = new PrismaClient();

export const todosRouter = Router();

/**
 * GET ALL
 */

const getTodosSchema = z.object({
  query: z.object({
    completed: z.string().optional(),
  }),
});

todosRouter.get('/', async (req, res) => {
  try {
    const { query } = await parseExpressRequest(getTodosSchema, req);
    const todos = await prisma.todo.findMany({
      where: {
        ...(query.completed !== undefined
          ? { completed: query.completed === 'true' }
          : {}),
      },
    });
    res.json(todos);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * CREATE
 */

const createTodoSchema = z.object({
  body: z.object({
    title: z.string(),
  }),
});

todosRouter.post('/', async (req, res) => {
  try {
    const { body } = await parseExpressRequest(createTodoSchema, req);
    const newTodo = await prisma.todo.create({
      data: {
        title: body.title,
      },
    });
    res.status(201).json(newTodo);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * UPDATE
 */

const updateTodoSchema = z.object({
  body: z.object({
    completed: z.boolean(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

todosRouter.put('/:id', async (req, res) => {
  try {
    const { body, params } = await parseExpressRequest(updateTodoSchema, req);
    const updatedTodo = await prisma.todo.update({
      where: {
        id: Number(params.id),
      },
      data: {
        completed: body.completed,
      },
    });
    res.json(updatedTodo);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * DELETE
 */
const deleteTodoSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

todosRouter.delete('/:id', async (req, res) => {
  try {
    const { params } = await parseExpressRequest(deleteTodoSchema, req);
    const deletedTodo = await prisma.todo.delete({
      where: {
        id: Number(params.id),
      },
    });
    res.json(deletedTodo);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
