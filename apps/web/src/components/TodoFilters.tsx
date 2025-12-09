import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setStatusFilter, setSortBy, toggleSortOrder } from '@/store/filtersSlice';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TodoFilters() {
  const dispatch = useAppDispatch();
  const { status, sortBy, sortOrder } = useAppSelector((state) => state.filters);
  const todos = useAppSelector((state) => state.todos.items);

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const statusFilters = [
    { key: 'all' as const, label: 'All' },
    { key: 'active' as const, label: 'Active' },
    { key: 'completed' as const, label: 'Completed' },
  ];

  const sortOptions = [
    { key: 'dueDate' as const, label: 'Due Date' },
    { key: 'createdAt' as const, label: 'Created' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Status Filters */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl">
        {statusFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => dispatch(setStatusFilter(filter.key))}
            className={cn(
              'filter-button',
              status === filter.key ? 'filter-button-active' : 'filter-button-inactive'
            )}
          >
            {filter.label}
            <span className="ml-1.5 text-xs opacity-70">{counts[filter.key]}</span>
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <div className="flex items-center gap-1">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                if (sortBy === option.key) {
                  dispatch(toggleSortOrder());
                } else {
                  dispatch(setSortBy(option.key));
                }
              }}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors',
                sortBy === option.key
                  ? 'bg-secondary text-secondary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
              {sortBy === option.key &&
                (sortOrder === 'asc' ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
