import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TolgeeProvider, TolgeeInstance } from '@tolgee/react';
import { Tolgee } from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import Page from './translation-methods';

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

describe('TranslationMethods Page', () => {
  it('renders the TranslationMethods component', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('renders T component with default text', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component with default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is default');
    });
  });

  it('renders T component without default', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component without default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders T component with params', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component with params/i });
      expect(heading.nextElementSibling).toHaveTextContent(/This is a key with/);
    });
  });

  it('renders T component with noWrap', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /T component with noWrap/i });
      expect(heading.nextElementSibling).toHaveTextContent(/This is a key with/);
    });
  });

  it('renders T component with interpolation', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const element = document.querySelector('[data-cy="translationWithTags"]');
      expect(element).toBeInTheDocument();
    });
  });

  it('renders t function without default', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function without default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders t function with params', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with params/i });
      expect(heading.nextElementSibling).toHaveTextContent(/This is a key with/);
    });
  });

  it('renders t function with noWrap', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with noWrap/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders t function with default', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with default/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is default');
    });
  });

  it('renders t function with props object', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /^t function with props object$/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders t function with props object noWrap is true', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /t function with props object noWrap is true/i });
      expect(heading.nextElementSibling).toHaveTextContent('This is a key');
    });
  });

  it('renders Load more button', async () => {
    renderWithProviders(<Page />);
    await waitFor(() => {
      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      expect(loadMoreButton).toBeInTheDocument();
    });
  });

  it('loads Namespaces component when Load more button is clicked', async () => {
    renderWithProviders(<Page />);
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
});
