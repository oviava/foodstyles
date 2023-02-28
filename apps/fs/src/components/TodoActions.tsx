import { Link } from 'react-router-dom';
import styles from './TodoActions.module.scss';

export const TodoActions = () => {
  return (
    <div className={styles.todoActions}>
      <div className={styles.show}>Show:</div>
      <Link to="/" className={styles.action}>
        All
      </Link>
      <Link to="/completed" className={styles.action}>
        Completed
      </Link>
      <Link to="/incompleted" className={styles.action}>
        Incompleted
      </Link>
    </div>
  );
};
