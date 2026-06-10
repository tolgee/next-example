import React from 'react';
import { render, screen } from '@testing-library/react';
import Namespaces from './Namespaces';

jest.mock('@tolgee/react', () => ({
  useTranslate: () => ({
    t: (key: string, options?: { ns?: string }) => {
      if (options?.ns === '') {
        return `translated_${key}_default_ns`;
      }
      return `translated_${key}_namespaced`;
    },
  }),
  T: ({ keyName, ns }: { keyName: string; ns?: string }) => (
    <span data-testid="t-component">{`translated_${keyName}_${ns || 'default'}`}</span>
  ),
}));

describe('Namespaces', () => {
  it('renders the component with correct structure', () => {
    render(<Namespaces />);

    expect(screen.getByText('t function with namespace')).toBeInTheDocument();
    expect(screen.getByText('t function with default namespace')).toBeInTheDocument();
    expect(screen.getByText('T component with namespace')).toBeInTheDocument();
  });

  it('renders t function with namespace correctly', () => {
    render(<Namespaces />);

    const namespaceSection = screen.getByText('t function with namespace').closest('div')?.querySelector('div');
    expect(namespaceSection).toHaveTextContent('translated_this_is_a_key_namespaced');
  });

  it('renders t function with default namespace correctly', () => {
    render(<Namespaces />);

    expect(screen.getByText('translated_this_is_a_key_default_ns')).toBeInTheDocument();
  });

  it('renders T component with namespace correctly', () => {
    render(<Namespaces />);

    expect(screen.getByTestId('t-component')).toHaveTextContent('translated_this_is_a_key_namespaced');
  });

  it('has correct container className', () => {
    render(<Namespaces />);

    expect(screen.getByText('t function with namespace').closest('.namespaces')).toBeInTheDocument();
  });

  it('renders all three sections with h1 headings', () => {
    render(<Namespaces />);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(3);
    expect(headings[0]).toHaveTextContent('t function with namespace');
    expect(headings[1]).toHaveTextContent('t function with default namespace');
    expect(headings[2]).toHaveTextContent('T component with namespace');
  });
});
