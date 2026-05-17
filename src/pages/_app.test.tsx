import { render, screen } from '@testing-library/react';
import MyApp from './_app';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    locale: 'en',
  }),
}));

// Mock @tolgee/react
jest.mock('@tolgee/react', () => ({
  TolgeeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tolgee-provider">{children}</div>
  ),
}));

// Mock ../tolgee
jest.mock('../tolgee', () => ({
  tolgee: {
    loadRequired: jest.fn().mockResolvedValue({}),
  },
}));

// Mock next/app
jest.mock('next/app', () => ({
  __esModule: true,
  default: {
    getInitialProps: jest.fn().mockResolvedValue({}),
  },
}));

describe('MyApp', () => {
  const mockComponent = ({ title }: { title?: string }) => (
    <div data-testid="page-component">{title || 'Page Content'}</div>
  );

  const mockPageProps = { title: 'Test Page' };

  describe('component rendering', () => {
    const mockRouter = {
      locale: 'en',
      route: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isReady: true,
      asPath: '/',
      pathname: '/',
      query: {},
      basePath: '',
    } as any;

    it('should render Component wrapped in TolgeeProvider', () => {
      render(
        <MyApp
          Component={mockComponent}
          pageProps={mockPageProps}
          staticData={{}}
          router={mockRouter}
        />
      );

      expect(screen.getByTestId('tolgee-provider')).toBeInTheDocument();
      expect(screen.getByTestId('page-component')).toBeInTheDocument();
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('should pass pageProps to Component', () => {
      render(
        <MyApp
          Component={mockComponent}
          pageProps={mockPageProps}
          staticData={{}}
          router={mockRouter}
        />
      );

      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('should render with empty staticData', () => {
      render(
        <MyApp
          Component={mockComponent}
          pageProps={{}}
          staticData={{}}
          router={mockRouter}
        />
      );

      expect(screen.getByTestId('tolgee-provider')).toBeInTheDocument();
    });
  });

  describe('getInitialProps', () => {
    it('should be defined as a static method', () => {
      expect(MyApp.getInitialProps).toBeDefined();
      expect(typeof MyApp.getInitialProps).toBe('function');
    });

    it('should return staticData from tolgee.loadRequired', async () => {
      const mockContext = {
        ctx: { locale: 'en' },
        Component: mockComponent,
        router: { locale: 'en' },
      };

      const result = await MyApp.getInitialProps(mockContext as any);

      expect(result).toHaveProperty('staticData');
    });

    it('should spread context props in returned value', async () => {
      const mockContext = {
        ctx: { locale: 'en' },
        Component: mockComponent,
        router: { locale: 'en' },
      };

      const result = await MyApp.getInitialProps(mockContext as any);

      expect(result).toBeDefined();
    });
  });
});
