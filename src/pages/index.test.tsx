import { render, screen } from '@testing-library/react';
import Page from './index';
import { Todos } from '../views/Todos';

jest.mock('../views/Todos', () => ({
  Todos: () => <div data-testid="todos-mock">Todos Component</div>,
}));

describe('Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
  });

  it('renders the Todos component', () => {
    render(<Page />);
    expect(screen.getByTestId('todos-mock')).toBeInTheDocument();
  });

  it('exports Page as default export', () => {
    expect(typeof Page).toBe('function');
  });
});
