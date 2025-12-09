import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Tag, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTodo, updateTodo } from '@/store/todosSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import type { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  todo?: Todo | null;
  onClose: () => void;
  isOpen: boolean;
}

export function TodoForm({ todo, onClose, isOpen }: TodoFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const createLoading = useAppSelector((state) => state.todos.createLoading);
  const updateLoadingIds = useAppSelector((state) => state.todos.updateLoadingIds);
  const isLoading = createLoading || (todo && updateLoadingIds.includes(todo.id));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
      setCategoryId(todo.categoryId);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setCategoryId(null);
    }
  }, [todo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (todo) {
      dispatch(
        updateTodo({
          id: todo.id,
          updates: {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate?.toISOString() || null,
            categoryId,
          },
        })
      );
    } else {
      dispatch(
        createTodo({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate?.toISOString() || null,
          categoryId,
          completed: false,
        })
      );
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="mx-4 w-full max-w-lg max-h-full overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-soft pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  {todo ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Input
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-medium"
                    autoFocus
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Add a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'justify-start text-left font-normal',
                          !dueDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : 'Set due date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {dueDate && (
                    <button
                      type="button"
                      onClick={() => setDueDate(undefined)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Category</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCategoryId(null)}
                      className={cn(
                        'category-pill border',
                        categoryId === null
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      None
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={cn(
                          'category-pill border transition-all',
                          categoryId === cat.id
                            ? 'border-transparent'
                            : 'border-border opacity-70 hover:opacity-100'
                        )}
                        style={{
                          backgroundColor: categoryId === cat.id ? `${cat.color}20` : undefined,
                          color: categoryId === cat.id ? cat.color : undefined,
                          borderColor: categoryId === cat.id ? cat.color : undefined,
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!title.trim() || isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {todo ? 'Save Changes' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
