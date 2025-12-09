import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCategory, deleteCategory } from '@/store/categoriesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  'hsl(152, 35%, 45%)', // Sage green
  'hsl(262, 52%, 55%)', // Purple
  'hsl(340, 65%, 55%)', // Pink
  'hsl(38, 92%, 50%)', // Orange
  'hsl(200, 65%, 55%)', // Blue
  'hsl(170, 50%, 45%)', // Teal
  'hsl(0, 65%, 55%)', // Red
  'hsl(280, 50%, 50%)', // Violet
];

export function CategoryManager({ isOpen, onClose }: CategoryManagerProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const todos = useAppSelector((state) => state.todos.items);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    dispatch(
      createCategory({
        name: newCategoryName.trim(),
        color: selectedColor,
      })
    );

    setNewCategoryName('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(deleteCategory(id));
  };

  const getCategoryTodoCount = (categoryId: string) => {
    return todos.filter((t) => t.categoryId === categoryId).length;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="mx-4 w-full max-w-md max-h-full overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-soft pointer-events-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Manage Categories
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Add New Category */}
              <div className="space-y-3 mb-6">
                <Input
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-6 w-6 rounded-full transition-transform ${
                          selectedColor === color
                            ? 'scale-125 ring-2 ring-offset-2 ring-offset-card'
                            : ''
                        }`}
                        style={{
                          backgroundColor: color,
                          outlineColor: selectedColor === color ? color : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {/* Existing Categories */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Existing Categories
                </h3>
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No categories yet. Create one above!
                  </p>
                ) : (
                  categories.map((category) => (
                    <motion.div
                      key={category.id}
                      layout
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-foreground">{category.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {getCategoryTodoCount(category.id)} tasks
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
