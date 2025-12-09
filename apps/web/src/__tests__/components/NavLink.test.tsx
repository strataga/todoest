import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { NavLink } from '@/components/NavLink';

describe('NavLink', () => {
  it('should render a link with correct href', () => {
    render(<NavLink to="/test">Test Link</NavLink>);

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should apply className', () => {
    render(
      <NavLink to="/test" className="my-class">
        Test Link
      </NavLink>
    );

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveClass('my-class');
  });

  it('should apply activeClassName when active', () => {
    // Render with MemoryRouter set to the target route
    render(<NavLink to="/" activeClassName="active-class">Home</NavLink>);

    const link = screen.getByRole('link', { name: 'Home' });
    // The link should have active class when on matching route
    expect(link).toHaveClass('active-class');
  });

  it('should not apply activeClassName when not active', () => {
    render(<NavLink to="/other" activeClassName="active-class">Other</NavLink>);

    const link = screen.getByRole('link', { name: 'Other' });
    expect(link).not.toHaveClass('active-class');
  });

  it('should forward other props', () => {
    render(
      <NavLink to="/test" data-testid="custom-link" aria-label="Custom Label">
        Test Link
      </NavLink>
    );

    const link = screen.getByTestId('custom-link');
    expect(link).toHaveAttribute('aria-label', 'Custom Label');
  });
});
