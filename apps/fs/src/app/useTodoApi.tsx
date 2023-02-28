import { useMemo } from 'react';

import { wrapedFetch } from './helpers';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const useTodoApi = () => {
  const getAll = async (completed?: boolean) => {
    let url = 'http://localhost:3333/api/todos';
    if (completed !== undefined) {
      url = `${url}?completed=${completed}`;
    }
    const response = await wrapedFetch(url);
    if (response) {
      const todos = await response.json();
      return todos as Todo[];
    }
  };

  const setTodoStatus = async (todo: { id: number; completed: boolean }) => {
    const response = await wrapedFetch(
      `http://localhost:3333/api/todos/${todo.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: todo.completed }),
      }
    );
    if (response) {
      const todo = await response.json();
      return todo as Todo;
    }
  };

  const deleteTodo = async (id: number) => {
    await wrapedFetch(`http://localhost:3333/api/todos/${id}`, {
      method: 'DELETE',
    });
  };

  const createTodo = async (title: string) => {
    const response = await wrapedFetch(`http://localhost:3333/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    if (response) {
      const todo = await response.json();
      return todo as Todo;
    }
  };

  const api = useMemo(
    () => ({
      getAll,
      setTodoStatus,
      deleteTodo,
      createTodo,
    }),
    []
  );

  return api;
};
