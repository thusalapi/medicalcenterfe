import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  // Use state to store the QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // Client-side only code
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a minimal UI until client-side hydration completes
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
