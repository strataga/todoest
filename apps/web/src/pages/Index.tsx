import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus, Inbox, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTodos } from '@/store/todosSlice';
import { fetchCategories } from '@/store/categoriesSlice';
import { useTodosByCategory } from '@/hooks/useTodos';
import { TodoCategoryGroup } from '@/components/TodoCategoryGroup';
import { TodoForm } from '@/components/TodoForm';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoStats } from '@/components/TodoStats';
import { CategoryManager } from '@/components/CategoryManager';
import { Button } from '@/components/ui/button';
import type { Todo } from '@/types/todo';

const Index = () => {
  const dispatch = useAppDispatch();
  const { fetchLoading, error } = useAppSelector((state) => state.todos);
  const categoriesFetchLoading = useAppSelector((state) => state.categories.fetchLoading);
  const groupedTodos = useTodosByCategory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                My Tasks
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Stay organized, get things done</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCategoryManagerOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Categories</span>
              </Button>
              <Button size="sm" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <TodoStats />

          {/* Filters */}
          <TodoFilters />

          {/* Todo List */}
          <div className="space-y-6">
            {(fetchLoading || categoriesFetchLoading) && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-destructive mb-4">Error: {error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    dispatch(fetchTodos());
                    dispatch(fetchCategories());
                  }}
                >
                  Retry
                </Button>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {!fetchLoading && !categoriesFetchLoading && !error && groupedTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                    <Inbox className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Create a new task or adjust your filters to see your tasks here.
                  </p>
                  <Button className="mt-6" onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first task
                  </Button>
                </motion.div>
              ) : (
                groupedTodos.map((group) => (
                  <TodoCategoryGroup
                    key={group.id}
                    category={group.category}
                    todos={group.todos}
                    onEditTodo={handleEditTodo}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Floating Add Button (Mobile) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 sm:hidden"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Modals */}
      <TodoForm todo={editingTodo} isOpen={isFormOpen} onClose={handleCloseForm} />
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />
    </div>
  );
};

export default Index;
