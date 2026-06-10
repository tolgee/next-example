import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

jest.mock('./LangSelector', () => ({
  LangSelector: () => <div data-testid="lang-selector">LangSelector</div>,
}));

describe('Navbar', () => {
  it('renders with children', () => {
    render(<Navbar><span>Test Child</span></Navbar>);

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders LangSelector component', () => {
    render(<Navbar>Content</Navbar>);

    expect(screen.getByTestId('lang-selector')).toBeInTheDocument();
  });

  it('has correct className "navbar"', () => {
    const { container } = render(<Navbar>Content</Navbar>);

    expect(container.firstChild).toHaveClass('navbar');
  });

  it('renders multiple children', () => {
    render(
      <Navbar>
        <span>Child 1</span>
        <span>Child 2</span>
      </Navbar>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Navbar />);

    expect(screen.getByTestId('lang-selector')).toBeInTheDocument();
  });
});
