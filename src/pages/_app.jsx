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
      {/* Google Tag Manager */}
      <Script
        id="google-tag-manager"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K4PLSSB2');`,
        }}
        strategy="lazyOnload"
      />

      <Script
        id="microsoft-clarity"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
                   c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                   t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                   y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                   })(window, document, "clarity", "script", "xxmf9savzj");`,
        }}
        strategy="lazyOnload"
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
