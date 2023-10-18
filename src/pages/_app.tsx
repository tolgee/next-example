import { TolgeeProvider, useTolgeeSSR } from "@tolgee/react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";

import { tolgee } from "../components/tolgee";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const ssrTolgee = useTolgeeSSR(tolgee, router.locale);

  return (
    <TolgeeProvider tolgee={ssrTolgee}>
      <Component {...pageProps} />
    </TolgeeProvider>
  );
};

export default (App);
