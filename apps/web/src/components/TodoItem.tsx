import { motion } from 'framer-motion';
import { Check, Trash2, Edit3, Calendar, Clock, Loader2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTodo, deleteTodo } from '@/store/todosSlice';
import type { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const toggleLoadingIds = useAppSelector((state) => state.todos.toggleLoadingIds);
  const deleteLoadingIds = useAppSelector((state) => state.todos.deleteLoadingIds);
  const category = categories.find((c) => c.id === todo.categoryId);
  const isToggling = toggleLoadingIds.includes(todo.id);
  const isDeleting = deleteLoadingIds.includes(todo.id);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isOverdue =
    todo.dueDate &&
    !todo.completed &&
    isPast(new Date(todo.dueDate)) &&
    !isToday(new Date(todo.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="todo-card group"
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling || isDeleting}
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
            todo.completed
              ? 'border-success bg-success'
              : 'border-border hover:border-primary hover:bg-primary/10',
            (isToggling || isDeleting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isToggling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          ) : (
            todo.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-success-foreground"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.div>
            )
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-medium text-foreground transition-all duration-300 truncate',
                  todo.completed && 'line-through text-muted-foreground'
                )}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={cn(
                    'mt-1 text-sm text-muted-foreground line-clamp-2',
                    todo.completed && 'line-through'
                  )}
                >
                  {todo.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(todo)}
                disabled={isToggling || isDeleting}
                className={cn(
                  'p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors',
                  (isToggling || isDeleting) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isToggling || isDeleting}
                className={cn(
                  'p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
                  (isToggling || isDeleting) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {category && (
              <span
                className="category-pill"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            )}
            {todo.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs',
                  isOverdue ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                {formatDueDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
