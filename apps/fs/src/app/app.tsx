// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useMutation, useQuery } from 'react-query';
import styles from './app.module.scss';
import { TodoForm } from '../components/TodoForm';
import { Todo, useTodoApi } from './useTodoApi';
import Logo from '../assets/group.svg';
import Delete from '../assets/path-copy.svg';
import { queryClient } from '../queryClient';
import { TodoActions } from '../components/TodoActions';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

type TodoItemProps = {
  todo: Todo;
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { deleteTodo, setTodoStatus } = useTodoApi();
  const { mutate, isLoading } = useMutation(deleteTodo, {
    onMutate: async (id) => {
      await queryClient.cancelQueries(['todos']);
      const prevTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData(['todos'], (old: Todo[] | undefined) => {
        if (old) {
          return old.filter((todo) => todo.id !== id);
        }
        return [];
      });

      return { prevTodos };
    },
    // reset if failure
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.prevTodos);
    },
    // refetch on success - we don't have to do this but we can
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { mutate: updateTodo, isLoading: isBeingChecked } = useMutation(
    setTodoStatus,
    {
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries(['todos']);
        const prevTodos = queryClient.getQueryData<Todo[]>(['todos']);

        queryClient.setQueryData(
          ['todos'],
          (old: Partial<Todo>[] | undefined) => {
            if (old) {
              return old.map((todo) => {
                if (todo.id === newTodo.id) {
                  return {
                    ...todo,
                    completed: newTodo.completed,
                  };
                }
                return todo;
              });
            }
            return [];
          }
        );

        return { prevTodos };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(['todos'], context?.prevTodos);
      },
      // refetch on success - we don't have to do this but we can
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      },
    }
  );

  return (
    <div className={styles.todoItem}>
      <label className={styles.todoLabel}>
        <input
          type="checkbox"
          checked={todo.completed}
          className={styles.checkbox}
          disabled={isLoading || isBeingChecked}
          onChange={(e) => {
            updateTodo({
              id: todo.id,
              completed: e.target.checked,
            });
          }}
        />
        {todo.title}
      </label>
      <div
        className={styles.todoDelete}
        role="button"
        onClick={() => {
          mutate(todo.id);
        }}
      >
        <img src={Delete} alt="delete" />
      </div>
    </div>
  );
};

const TodoList = () => {
  const { pathname } = useLocation();

  const completed = useMemo(() => {
    if (pathname === '/') {
      return undefined;
    }

    return pathname === '/completed';
  }, [pathname]);

  const { getAll } = useTodoApi();
  const { data = [] } = useQuery(['todos', completed], () => getAll(completed));

  return (
    <div className={styles.todoList}>
      {data.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

const TodoApp = () => {
  return (
    <div className={styles.wrapper}>
      <img src={Logo} alt="logo" />
      <h1>TodoList</h1>
      <TodoForm />
      <TodoList />
      <TodoActions />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TodoApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
