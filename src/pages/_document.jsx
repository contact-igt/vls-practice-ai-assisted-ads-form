import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="/assets/vendors/font-awesome/css/font-awesome.min.css"
        />

        {/* Slick Carousel CSS — loaded via CDN to avoid Turbopack node_modules CSS issue */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
        />
        {/* Google Tag Manager */}
        <Script
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
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
                     c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                     t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                     y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                     })(window, document, "clarity", "script", "xxmf9savzj");`,
          }}
          strategy="lazyOnload"
        />
        {/* End Google Tag Manager */}

        {/* Meta Pixel */}
        {/* <Script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1728779184910879');
              fbq('track', 'PageView');`,
          }}
          strategy="lazyOnload"
        /> */}
        {/* End Meta Pixel */}
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K4PLSSB2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1728779184910879&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Main />
        <NextScript />
        {/* JS scripts */}

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </Html>
  );
}

