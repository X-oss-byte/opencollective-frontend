import '../env';

import React from 'react';
import { pick } from 'lodash';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { v4 as uuid } from 'uuid';

import { getIntlProps, getLocaleMessages } from '../lib/i18n/request';
import { ServerIntl } from '../lib/i18n/ssr';
import { parseToBoolean } from '../lib/utils';
import { getCSPHeader } from '../server/content-security-policy';

const cspHeader = getCSPHeader();

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class IntlDocument extends Document {
  static async getInitialProps(ctx) {
    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const intlProps = getIntlProps(ctx);
    const messages = await getLocaleMessages(intlProps.locale);
    const ssrIntl = new ServerIntl(intlProps.locale, messages);

    if (ctx.req && ctx.res) {
      if (intlProps.locale !== 'en') {
        // Prevent server side caching of non english content
        ctx.res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0');
      } else {
        // When using Cloudflare, there might be a default cache
        // We're setting that for all requests to reduce the default to 1 minute
        ctx.res.setHeader('Cache-Control', 'public, max-age=60');
      }
    }

    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    const clientAnalytics = {
      enabled: parseToBoolean(process.env.CLIENT_ANALYTICS_ENABLED),
      domain: process.env.CLIENT_ANALYTICS_DOMAIN,
      scriptSrc:
        'development' === process.env.OC_ENV
          ? 'https://plausible.io/js/script.tagged-events.exclusions.local.js'
          : 'https://plausible.io/js/script.tagged-events.exclusions.js',
      exclusions: process.env.CLIENT_ANALYTICS_EXCLUSIONS,
    };

    // On server-side, add a CSP header
    let requestNonce;
    if (ctx.res && cspHeader) {
      requestNonce = uuid();
      ctx.res.setHeader(cspHeader.key, cspHeader.value.replace('__OC_REQUEST_NONCE__', requestNonce));
    }

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => ssrIntl.collectMessages(sheet.collectStyles(<App {...props} {...intlProps} />)),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        clientAnalytics,
        cspNonce: requestNonce,
        intl: {
          ...intlProps,
          // contains only the messages used on this SSR pass to be properly hydrated on the client side.
          messages: ssrIntl.getMessages(),
        },
        styles: (
          <React.Fragment>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </React.Fragment>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  constructor(props) {
    super(props);
    if (props.cspNonce) {
      props.__NEXT_DATA__.cspNonce = props.cspNonce;
    }

    if (props.intl) {
      props.__NEXT_DATA__.props = {
        ...props.__NEXT_DATA__.props,
        ...props.intl,
      };
    }

    // We pick the environment variables that we want to access from the client
    // They can later be read with getEnvVar()
    // Please, NEVER SECRETS!
    props.__NEXT_DATA__.env = pick(process.env, [
      'IMAGES_URL',
      'PAYPAL_ENVIRONMENT',
      'STRIPE_KEY',
      'SENTRY_DSN',
      'SENTRY_RELEASE',
      'WEBSITE_URL',
      'GOOGLE_MAPS_API_KEY',
      'RECAPTCHA_SITE_KEY',
      'RECAPTCHA_ENABLED',
      'WISE_ENVIRONMENT',
      'HCAPTCHA_SITEKEY',
      'CAPTCHA_ENABLED',
      'CAPTCHA_PROVIDER',
      'DISABLE_MOCK_UPLOADS',
    ]);
  }

  render() {
    return (
      <Html>
        <Head nonce={this.props.cspNonce}>
          {/* Preload locale message chunks to prevent flashing missing messages after hydration and state update on the client. */}
          {this?.props?.intl?.locale && (
            <script defer src={`_next/static/chunks/lang_${this.props.intl.locale}_json.js`} />
          )}
        </Head>
        <body>
          <Main nonce={this.props.cspNonce} />
          <NextScript nonce={this.props.cspNonce} />
          {this.props.clientAnalytics.enabled && (
            <script
              nonce={this.props.cspNonce}
              defer
              data-domain={this.props.clientAnalytics.domain}
              data-exclude={this.props.clientAnalytics.exclusions}
              src={this.props.clientAnalytics.scriptSrc}
            ></script>
          )}
        </body>
      </Html>
    );
  }
}
