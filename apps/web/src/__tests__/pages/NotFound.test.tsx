import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import NotFound from '@/pages/NotFound';

describe('NotFound', () => {
  it('should render 404 message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render not found text', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<NotFound />);

    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('should have a link to home page', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should log error on mount', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<NotFound />);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
