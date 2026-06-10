import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TolgeeProvider, TolgeeInstance } from '@tolgee/react';
import { Tolgee } from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { TranslationMethods } from './TranslationMethods';

let tolgee: TolgeeInstance;

const createTestTolgee = () => {
  return Tolgee()
    .use(FormatIcu())
    .init({
      availableLanguages: ['en', 'cs'],
      defaultLanguage: 'en',
      staticData: {
        en: {
          this_is_a_key: 'This is a key',
          this_is_a_key_with_params: 'This is a key with {key} and {key2}',
          this_is_a_key_with_tags: 'Hey <b>bold</b> and <i>italic</i> {key}',
        },
      },
    });
};

const renderWithProviders = (ui: React.ReactElement) => {
  tolgee = createTestTolgee();
  return render(
    <TolgeeProvider tolgee={tolgee}>
      <RouterContext.Provider value={{
        locale: 'en',
        locales: ['en', 'cs'],
        pathname: '/',
        route: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
        events: {
          on: jest.fn(),
          off: jest.fn(),
          emit: jest.fn(),
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        isPreview: false,
      } as any}>
        {ui}
      </RouterContext.Provider>
    </TolgeeProvider>
  );
};

afterEach(async () => {
  if (tolgee) {
    await act(async () => {
      await tolgee.stop();
    });
  }
});

describe('TranslationMethods', () => {
  it('renders the TranslationMethods component with main element', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('renders Navbar with link to home page', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /the example app/i })).toBeInTheDocument();
    });
  });

  it('renders T component with default text', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component with default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is default');
    });
  });

  it('renders T component without default', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component without default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders T component with params', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component with params/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key with value and value2');
    });
  });

  it('renders T component with noWrap', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component with noWrap/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key with value and value2');
    });
  });

  it('renders T component with interpolation and tags', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const element = document.querySelector('[data-cy="translationWithTags"]');
      expect(element).toBeInTheDocument();
      expect(element).toContainHTML('<b>bold</b>');
      expect(element).toContainHTML('<i>italic</i>');
    });
  });

  it('renders t function without default', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function without default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders t function with params', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with params/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key with value and value2');
    });
  });

  it('renders t function with noWrap', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with noWrap/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders t function with default', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is default');
    });
  });

  it('renders t function with props object', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /^t function with props object$/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders t function with props object noWrap is true', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with props object noWrap is true/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders Load more button initially', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      expect(loadMoreButton).toBeInTheDocument();
    });
  });

  it('does not render Namespaces component initially', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /t function with namespace/i })).not.toBeInTheDocument();
    });
  });

  it('loads Namespaces component when Load more button is clicked', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      expect(loadMoreButton).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /t function with namespace/i })).toBeInTheDocument();
    });
  });

  it('hides Load more button after clicking it', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      expect(loadMoreButton).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
    });
  });

  it('renders all 11 translation method tiles', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      const main = screen.getByRole('main');
      const tiles = main.querySelector('.tiles');
      expect(tiles).toBeInTheDocument();
    });

    const main = screen.getByRole('main');
    const tiles = main.querySelector('.tiles');
    expect(tiles?.children).toHaveLength(11);
  });

  it('renders correct heading for each translation method', async () => {
    renderWithProviders(<TranslationMethods />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /T component with default/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /T component without default/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /T component with params/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /T component with noWrap/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /T component with interpolation/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /t function without default/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /t function with params/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /t function with noWrap/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /t function with default/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /^t function with props object$/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /t function with props object noWrap is true/i })).toBeInTheDocument();
    });
  });
});
