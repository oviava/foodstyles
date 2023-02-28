import { useMutation } from 'react-query';
import { queryClient } from '../queryClient';
import styles from './TodoForm.module.scss';
import { Todo, useTodoApi } from '../app/useTodoApi';

export const TodoForm = () => {
  const { createTodo } = useTodoApi();
  const {
    data = [],
    isLoading,
    mutateAsync,
  } = useMutation('todo', createTodo, {
    // optimistic update
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries(['todos']);

      const prevTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData(['todos'], (old: Todo[] | undefined) => {
        if (old) {
          return [
            ...old,
            {
              id: Math.random(),
              title: newTodo,
              completed: false,
            },
          ];
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

  // keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const text = input.value.trim();

    if (e.key === 'Enter' && text) {
      mutateAsync(text);
      input.value = '';
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        type="text"
        placeholder="Add a new todo"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
