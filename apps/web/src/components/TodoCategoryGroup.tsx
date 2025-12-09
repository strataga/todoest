import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { TodoItem } from './TodoItem';
import type { Todo, Category } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoCategoryGroupProps {
  category: Category | null;
  todos: Todo[];
  onEditTodo: (todo: Todo) => void;
}

export function TodoCategoryGroup({ category, todos, onEditTodo }: TodoCategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: category?.color || 'hsl(var(--muted-foreground))' }}
        />
        <h2 className="flex-1 text-lg font-semibold text-foreground">
          {category?.name || 'Uncategorized'}
        </h2>
        <span className="text-sm text-muted-foreground">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Todos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 overflow-hidden pl-6"
          >
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onEdit={onEditTodo} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
