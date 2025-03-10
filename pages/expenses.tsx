import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { has, isNil, omitBy } from 'lodash';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { defineMessages, useIntl } from 'react-intl';

import { FEATURES, isFeatureSupported } from '../lib/allowed-features';
import { initClient } from '../lib/apollo-client';
import { getCollectivePageMetadata, loggedInUserCanAccessFinancialData } from '../lib/collective.lib';
import expenseTypes from '../lib/constants/expenseTypes';
import { PayoutMethodType } from '../lib/constants/payout-method';
import { parseDateInterval } from '../lib/date-utils';
import { generateNotFoundError } from '../lib/errors';
import { API_V2_CONTEXT } from '../lib/graphql/helpers';
import { ExpensesPageQuery, ExpenseStatus } from '../lib/graphql/types/v2/graphql';
import useLoggedInUser from '../lib/hooks/useLoggedInUser';
import { getCollectivePageCanonicalURL } from '../lib/url-helpers';

import { parseAmountRange } from '../components/budget/filters/AmountFilter';
import CollectiveNavbar from '../components/collective-navbar';
import { NAVBAR_CATEGORIES } from '../components/collective-navbar/constants';
import { Dimensions } from '../components/collective-page/_constants';
import { collectiveNavbarFieldsFragment } from '../components/collective-page/graphql/fragments';
import Container from '../components/Container';
import ErrorPage from '../components/ErrorPage';
import Expenses from '../components/expenses/ExpensesPage';
import { parseChronologicalOrderInput } from '../components/expenses/filters/ExpensesOrder';
import { expenseHostFields, expensesListFieldsFragment } from '../components/expenses/graphql/fragments';
import { Box } from '../components/Grid';
import Page from '../components/Page';
import PageFeatureNotSupported from '../components/PageFeatureNotSupported';

const messages = defineMessages({
  title: {
    id: 'ExpensesPage.title',
    defaultMessage: '{collectiveName} · Expenses',
  },
});

const EXPENSES_PER_PAGE = 10;

export const expensesPageQuery = gql`
  query ExpensesPage(
    $collectiveSlug: String!
    $account: AccountReferenceInput
    $fromAccount: AccountReferenceInput
    $limit: Int!
    $offset: Int!
    $type: ExpenseType
    $tags: [String]
    $status: ExpenseStatusFilter
    $minAmount: Int
    $maxAmount: Int
    $payoutMethodType: PayoutMethodType
    $dateFrom: DateTime
    $dateTo: DateTime
    $searchTerm: String
    $orderBy: ChronologicalOrderInput
    $chargeHasReceipts: Boolean
    $virtualCards: [VirtualCardReferenceInput]
    $createdByAccount: AccountReferenceInput
  ) {
    account(slug: $collectiveSlug) {
      id
      legacyId
      slug
      type
      imageUrl
      backgroundImageUrl
      twitterHandle
      name
      currency
      isArchived
      isActive
      settings
      createdAt
      supportedExpenseTypes
      expensesTags {
        id
        tag
      }
      features {
        id
        ...NavbarFields
      }

      stats {
        id
        balanceWithBlockedFunds {
          valueInCents
          currency
        }
      }

      ... on AccountWithHost {
        isApproved
        host {
          id
          ...ExpenseHostFields
        }
      }

      ... on AccountWithParent {
        parent {
          id
          slug
          imageUrl
          backgroundImageUrl
          twitterHandle
        }
      }

      ... on Organization {
        # We add that for hasFeature
        isHost
        isActive
      }

      ... on Event {
        parent {
          id
          name
          slug
          type
        }
      }

      ... on Project {
        parent {
          id
          name
          slug
          type
        }
      }
    }
    expenses(
      account: $account
      fromAccount: $fromAccount
      limit: $limit
      offset: $offset
      type: $type
      tag: $tags
      status: $status
      minAmount: $minAmount
      maxAmount: $maxAmount
      payoutMethodType: $payoutMethodType
      dateFrom: $dateFrom
      dateTo: $dateTo
      searchTerm: $searchTerm
      orderBy: $orderBy
      chargeHasReceipts: $chargeHasReceipts
      virtualCards: $virtualCards
      createdByAccount: $createdByAccount
    ) {
      totalCount
      offset
      limit
      nodes {
        id
        ...ExpensesListFieldsFragment
      }
    }
    # limit: 1 as current best practice to avoid the API fetching entries it doesn't need
    # TODO: We don't need to try and fetch this field on non-host accounts (should use a ... on Host)
    scheduledExpenses: expenses(
      host: { slug: $collectiveSlug }
      status: SCHEDULED_FOR_PAYMENT
      payoutMethodType: BANK_ACCOUNT
      limit: 1
    ) {
      totalCount
    }
  }

  ${expensesListFieldsFragment}
  ${collectiveNavbarFieldsFragment}
  ${expenseHostFields}
`;

const getPropsFromQuery = query => ({
  parentCollectiveSlug: query.parentCollectiveSlug || null,
  collectiveSlug: query.collectiveSlug,
  query: omitBy(
    {
      offset: parseInt(query.offset) || undefined,
      limit: parseInt(query.limit) || undefined,
      type: has(expenseTypes, query.type) ? query.type : undefined,
      status: has(ExpenseStatus, query.status) || query.status === 'READY_TO_PAY' ? query.status : undefined,
      payout: has(PayoutMethodType, query.payout) ? query.payout : undefined,
      direction: query.direction,
      period: query.period,
      amount: query.amount,
      tag: query.tag,
      searchTerm: query.searchTerm,
      orderBy: query.orderBy,
    },
    isNil,
  ),
});

const getVariablesFromQuery = query => {
  const props = getPropsFromQuery(query);
  const amountRange = parseAmountRange(props.query.amount);
  const { from: dateFrom, to: dateTo } = parseDateInterval(props.query.period);
  const showSubmitted = props.query.direction === 'SUBMITTED';
  const fromAccount = showSubmitted ? { slug: props.collectiveSlug } : null;
  const account = !showSubmitted ? { slug: props.collectiveSlug } : null;
  return {
    collectiveSlug: props.collectiveSlug,
    fromAccount,
    account,
    offset: props.query.offset || 0,
    limit: props.query.limit || EXPENSES_PER_PAGE,
    type: props.query.type,
    status: props.query.status,
    tags: props.query.tag ? (props.query.tag === 'untagged' ? null : [props.query.tag]) : undefined,
    minAmount: amountRange[0] && amountRange[0] * 100,
    maxAmount: amountRange[1] && amountRange[1] * 100,
    payoutMethodType: props.query.payout,
    dateFrom,
    dateTo,
    orderBy: props.query.orderBy && parseChronologicalOrderInput(props.query.orderBy),
    searchTerm: props.query.searchTerm,
  };
};

type ExpensesPageProps = {
  collectiveSlug: string;
  parentCollectiveSlug: string;
  data: Partial<ExpensesPageQuery>;
  error?: any;
};

export const getServerSideProps: GetServerSideProps<ExpensesPageProps> = async ctx => {
  const props = getPropsFromQuery(ctx.query);
  const variables = getVariablesFromQuery(ctx.query);

  // Fetch data from GraphQL API for SSR
  const client = initClient();
  const { data, error } = await client.query({
    query: expensesPageQuery,
    variables,
    context: API_V2_CONTEXT,
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  });

  return {
    props: {
      ...props,
      data,
      error: error || null,
    },
  };
};

export default function ExpensesPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const intl = useIntl();
  const router = useRouter();
  const { LoggedInUser } = useLoggedInUser();

  const [fetchData, query] = useLazyQuery(expensesPageQuery, {
    variables: getVariablesFromQuery(router.query),
    context: API_V2_CONTEXT,
  });

  useEffect(() => {
    if (LoggedInUser) {
      fetchData();
    }
  }, [LoggedInUser]);

  const error = query?.error || props.error;
  const data: ExpensesPageQuery = query?.data || props.data;

  const metadata = {
    ...getCollectivePageMetadata(data.account),
    title: intl.formatMessage(messages.title, { collectiveName: data.account.name }),
  };

  if (!query.loading) {
    if (error) {
      return <ErrorPage data={data} />;
    } else if (!data.account || !data.expenses?.nodes) {
      return <ErrorPage error={generateNotFoundError(props.collectiveSlug)} log={false} />;
    } else if (!isFeatureSupported(data.account, FEATURES.RECEIVE_EXPENSES)) {
      return <PageFeatureNotSupported showContactSupportLink />;
    } else if (!loggedInUserCanAccessFinancialData(LoggedInUser, data.account)) {
      // Hack for funds that want to keep their budget "private"
      return <PageFeatureNotSupported showContactSupportLink={false} />;
    }
  }

  return (
    <Page
      collective={data.account}
      canonicalURL={`${getCollectivePageCanonicalURL(data.account)}/expenses`}
      {...metadata}
    >
      <CollectiveNavbar
        collective={data.account}
        isLoading={!data.account}
        selectedCategory={NAVBAR_CATEGORIES.BUDGET}
      />
      <Container position="relative" minHeight={[null, 800]}>
        <Box maxWidth={Dimensions.MAX_SECTION_WIDTH} m="0 auto" px={[2, 3, 4]} py={[0, 5]}>
          <Expenses
            data={data}
            refetch={query.refetch}
            query={router.query}
            loading={query.loading}
            variables={query.variables}
            LoggedInUser={LoggedInUser}
          />
        </Box>
      </Container>
    </Page>
  );
}
