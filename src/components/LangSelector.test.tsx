import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { LangSelector } from './LangSelector';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LangSelector', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      locale: 'en',
      pathname: '/test',
      replace: mockReplace,
    } as unknown as ReturnType<typeof useRouter>);
  });

  it('renders language selector with options', () => {
    render(<LangSelector />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Česky')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('displays current locale as selected value', () => {
    mockUseRouter.mockReturnValue({
      locale: 'fr',
      pathname: '/test',
      replace: mockReplace,
    } as unknown as ReturnType<typeof useRouter>);

    render(<LangSelector />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('fr');
  });

  it('calls router.replace with selected locale on change', () => {
    render(<LangSelector />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'de' } });
    
    expect(mockReplace).toHaveBeenCalledWith(
      '/test',
      undefined,
      { locale: 'de' }
    );
  });

  it('has correct className', () => {
    render(<LangSelector />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('lang-selector');
  });

  it('has all language options with correct values', () => {
    render(<LangSelector />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const options = Array.from(select.options);
    
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveProperty('value', 'en');
    expect(options[0]).toHaveProperty('text', 'English');
    expect(options[1]).toHaveProperty('value', 'cs');
    expect(options[1]).toHaveProperty('text', 'Česky');
    expect(options[2]).toHaveProperty('value', 'fr');
    expect(options[2]).toHaveProperty('text', 'Français');
    expect(options[3]).toHaveProperty('value', 'de');
    expect(options[3]).toHaveProperty('text', 'Deutsch');
  });
});
