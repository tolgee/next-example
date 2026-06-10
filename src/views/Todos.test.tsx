import { render, screen, fireEvent } from '@testing-library/react';
import { Todos } from './Todos';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/router
jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      pathname: '/',
      locale: 'en',
      replace: jest.fn(),
    }),
  };
});

// Mock @tolgee/react
jest.mock('@tolgee/react', () => {
  return {
    T: ({ keyName }: { keyName: string }) => <span>{keyName}</span>,
    useTranslate: () => ({
      t: (key: string) => key,
    }),
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Todos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the component with default items', () => {
    render(<Todos />);

    expect(screen.getByText('app-title')).toBeInTheDocument();
    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Maps and directions')).toBeInTheDocument();
    expect(screen.getByText('Travel guide')).toBeInTheDocument();
  });

  it('renders the link to translation methods', () => {
    render(<Todos />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/translation-methods');
    expect(link).toHaveTextContent('menu-item-translation-methods');
  });

  it('renders the add item input with placeholder', () => {
    render(<Todos />);

    const input = screen.getByPlaceholderText('add-item-input-placeholder');
    expect(input).toBeInTheDocument();
  });

  it('renders the add button with text', () => {
    render(<Todos />);

    expect(screen.getByText('add-item-add-button')).toBeInTheDocument();
  });

  it('renders the delete buttons for each item', () => {
    render(<Todos />);

    const deleteButtons = screen.getAllByText('delete-item-button');
    expect(deleteButtons).toHaveLength(3);
  });

  it('renders the share and email buttons', () => {
    render(<Todos />);

    expect(screen.getByText('share-button')).toBeInTheDocument();
    expect(screen.getByText('send-via-email')).toBeInTheDocument();
  });

  it('adds a new item when form is submitted', () => {
    const { container } = render(<Todos />);

    const input = screen.getByPlaceholderText('add-item-input-placeholder');
    fireEvent.change(input, { target: { value: 'New Item' } });

    const form = container.querySelector('.items__new-item') as HTMLFormElement;
    fireEvent.submit(form);

    expect(screen.getByText('New Item')).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'tolgee-example-app-items',
      JSON.stringify(['Passport', 'Maps and directions', 'Travel guide', 'New Item'])
    );
  });

  it('clears the input after adding an item', () => {
    const { container } = render(<Todos />);

    const input = screen.getByPlaceholderText('add-item-input-placeholder') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Item' } });

    const form = container.querySelector('.items__new-item') as HTMLFormElement;
    fireEvent.submit(form);

    expect(input.value).toBe('');
  });

  it('disables the add button when input is empty', () => {
    render(<Todos />);

    const addButton = screen.getByRole('button', { name: /add-item-add-button/i });
    expect(addButton).toBeDisabled();
  });

  it('enables the add button when input has value', () => {
    render(<Todos />);

    const input = screen.getByPlaceholderText('add-item-input-placeholder');
    fireEvent.change(input, { target: { value: 'Some value' } });

    const addButton = screen.getByRole('button', { name: /add-item-add-button/i });
    expect(addButton).not.toBeDisabled();
  });

  it('deletes an item when delete button is clicked', () => {
    render(<Todos />);

    const deleteButtons = screen.getAllByText('delete-item-button');
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText('Passport')).not.toBeInTheDocument();
    expect(screen.getByText('Maps and directions')).toBeInTheDocument();
    expect(screen.getByText('Travel guide')).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'tolgee-example-app-items',
      JSON.stringify(['Maps and directions', 'Travel guide'])
    );
  });

  it('shows an alert when share button is clicked', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Todos />);

    const shareButton = screen.getByText('share-button').closest('button');
    fireEvent.click(shareButton!);

    expect(alertMock).toHaveBeenCalledWith('action: share');
    alertMock.mockRestore();
  });

  it('shows an alert when email button is clicked', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Todos />);

    const emailButton = screen.getByText('send-via-email').closest('button');
    fireEvent.click(emailButton!);

    expect(alertMock).toHaveBeenCalledWith('action: email');
    alertMock.mockRestore();
  });

  it('uses stored items from localStorage when available', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(['Stored Item 1', 'Stored Item 2'])
    );

    render(<Todos />);

    expect(screen.getByText('Stored Item 1')).toBeInTheDocument();
    expect(screen.getByText('Stored Item 2')).toBeInTheDocument();
    expect(screen.queryByText('Passport')).not.toBeInTheDocument();
  });

  it('uses default items when localStorage parsing fails', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Parsing error');
    });

    render(<Todos />);

    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Maps and directions')).toBeInTheDocument();
    expect(screen.getByText('Travel guide')).toBeInTheDocument();
  });
});
