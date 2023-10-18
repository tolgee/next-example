import { TolgeeProvider, useTolgeeSSR } from "@tolgee/react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";

import { tolgee } from "../components/tolgee";
import { ChakraProvider } from "@chakra-ui/react";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const ssrTolgee = useTolgeeSSR(tolgee, router.locale);

  return (
    <ChakraProvider>
      <TolgeeProvider tolgee={ssrTolgee}>
        <Component {...pageProps} />
      </TolgeeProvider>
    </ChakraProvider>
  );
};

export default App;
