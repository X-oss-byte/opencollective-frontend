import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { defineMessages, useIntl } from 'react-intl';

import useLoggedInUser from '../lib/hooks/useLoggedInUser';
import { getRequestIntl } from '../lib/i18n/request';
import { PREVIEW_FEATURE_KEYS } from '../lib/preview-features';

// import Banner from '../components/collectives/Banner';
import JoinUsSection from '../components/collectives/sections/JoinUs';
import CollaborateWithMoney from '../components/home/CollaborateWithMoneySection';
import DedicatedTeam from '../components/home/DedicatedTeamSection';
import GetToKnowUs from '../components/home/GetToKnowUsSection';
import OpenCollectiveIs from '../components/home/OpenCollectiveIsSection';
import RaiseMoney from '../components/home/RaiseMoneySection';
import TheFutureIsCollective from '../components/home/TheFutureIsCollectiveSection';
import Page from '../components/Page';

const messages = defineMessages({
  defaultTitle: {
    defaultMessage: 'Raise and spend money with full transparency.',
  },
  defaultDescription: {
    defaultMessage:
      'Open Collective is a legal and financial toolbox for groups. It’s a fundraising + legal status + money management platform for your community. What do you want to do?',
  },
});

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { LoggedInUser } = useLoggedInUser();
  const router = useRouter();
  const shouldRedirectToDashboard =
    LoggedInUser?.hasPreviewFeatureEnabled(PREVIEW_FEATURE_KEYS.DASHBOARD) && router.asPath === '/';

  useEffect(() => {
    if (shouldRedirectToDashboard) {
      router.replace('/dashboard');
    }
  }, [shouldRedirectToDashboard]);

  return (
    <Page
      metaTitle={formatMessage(messages.defaultTitle)}
      title={formatMessage(messages.defaultTitle)}
      description={formatMessage(messages.defaultDescription)}
    >
      {/*
      <Banner />
      */}
      <TheFutureIsCollective />
      <RaiseMoney />
      <OpenCollectiveIs />
      <CollaborateWithMoney />
      <DedicatedTeam />
      <GetToKnowUs />
      <JoinUsSection />
    </Page>
  );
};

HomePage.getInitialProps = ({ req, res }) => {
  if (res && req) {
    const { locale } = getRequestIntl(req);
    if (locale === 'en') {
      res.setHeader('Cache-Control', 'public, s-maxage=3600');
    }
  }

  let skipDataFromTree = false;

  // If on server side
  if (req) {
    skipDataFromTree = true;
  }

  return { skipDataFromTree };
};

export default HomePage;
