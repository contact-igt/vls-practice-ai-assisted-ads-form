import Footer from "@/common/Footer";
import Header from "@/common/Header";
import "@/styles/globals.css";
import useUTMSource from "@/utils/useUTMSource";
// slick-carousel CSS loaded via CDN in _document.jsx (Turbopack cannot resolve node_modules CSS)
import "bootstrap/dist/css/bootstrap.min.css";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";
import Preloader from "@/common/Preloader";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();
  useUTMSource();

  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />

      {/* Load Slick AFTER jQuery */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"
        strategy="afterInteractive"
      />

      {/* Load Bootstrap Bundle */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />

      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <Preloader/>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </SnackbarProvider>
      </QueryClientProvider>
    </>
  );
}
