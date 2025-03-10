import { defineMessages } from 'react-intl';

import { CollectiveType } from '../../lib/constants/collectives';

const { USER, ORGANIZATION, COLLECTIVE, FUND, EVENT, PROJECT } = CollectiveType;

export const HOST_DASHBOARD_SECTIONS = {
  // New Host Dashboard
  BUDGET_MANAGEMENT: 'budget',
  COLLECTIVES: 'collectives',
  OVERVIEW: 'info',
  REPORTS: 'reports',
  // Existing Host Dashboard Sections
  HOST_EXPENSES: 'host-expenses',
  HOST_AGREEMENTS: 'host-agreements',
  FINANCIAL_CONTRIBUTIONS: 'orders',
  PENDING_CONTRIBUTIONS: 'pending-contributions',
  HOSTED_COLLECTIVES: 'hosted-collectives',
  HOST_VIRTUAL_CARDS: 'host-virtual-cards',
  HOST_VIRTUAL_CARD_REQUESTS: 'host-virtual-card-requests',
  PENDING_APPLICATIONS: 'pending-applications',
};

export const ABOUT_ORG_SECTIONS = {
  COLLECTIVE_PAGE: 'collective-page',
  CONNECTED_ACCOUNTS: 'connected-accounts',
  INFO: 'info',
  TEAM: 'team',
};

export const ORG_BUDGET_SECTIONS = {
  GIFT_CARDS: 'gift-cards',
  CREATE_GIFT_CARDS: 'gift-cards-create',
  PAYMENT_METHODS: 'payment-methods',
  PAYMENT_RECEIPTS: 'payment-receipts',
  FINANCIAL_CONTRIBUTIONS: 'orders',
  TIERS: 'tiers',
  // Manage Contributions
};

export const FISCAL_HOST_SECTIONS = {
  FISCAL_HOSTING: 'fiscal-hosting',
  SECURITY: 'security',
  HOST_VIRTUAL_CARDS: 'host-virtual-cards',
  HOST_VIRTUAL_CARD_REQUESTS: 'host-virtual-card-requests',
  HOST_VIRTUAL_CARDS_SETTINGS: 'host-virtual-cards-settings',
  INVOICES_RECEIPTS: 'invoices-receipts',
  POLICIES: 'policies',
  RECEIVING_MONEY: 'receiving-money',
  SENDING_MONEY: 'sending-money',
};

export const COLLECTIVE_SECTIONS = {
  HOME: 'home',
  DASHBOARD_OVERVIEW: 'overview',
  CONTRIBUTORS: 'contributors',
  CONTRIBUTIONS: 'contributions',
  ADVANCED: 'advanced',
  AUTHORIZED_APPS: 'authorized-apps',
  COLLECTIVE_GOALS: 'goals',
  COLLECTIVE_PAGE: 'collective-page',
  CONNECTED_ACCOUNTS: 'connected-accounts',
  EXPORT: 'export',
  FOR_DEVELOPERS: 'for-developers',
  HOST: 'host',
  INFO: 'info',
  EXPENSES: 'expenses',
  MANAGE_CONTRIBUTIONS: 'manage-contributions',
  TRANSACTIONS: 'transactions',
  PAYMENT_METHODS: 'payment-methods',
  PAYMENT_RECEIPTS: 'payment-receipts',
  NOTIFICATIONS: 'notifications',
  POLICIES: 'policies',
  CUSTOM_EMAIL: 'custom-email',
  TEAM: 'team',
  TICKETS: 'tickets',
  TIERS: 'tiers',
  USER_SECURITY: 'user-security',
  VIRTUAL_CARDS: 'virtual-cards',
  WEBHOOKS: 'webhooks',
  ACTIVITY_LOG: 'activity-log',
} as const;

export const LEGACY_COLLECTIVE_SETTINGS_SECTIONS = {
  ...COLLECTIVE_SECTIONS,
  ...ABOUT_ORG_SECTIONS,
  ...ORG_BUDGET_SECTIONS,
  ...FISCAL_HOST_SECTIONS,
} as const;

export const ALL_SECTIONS = {
  ...COLLECTIVE_SECTIONS,
  ...ABOUT_ORG_SECTIONS,
  ...ORG_BUDGET_SECTIONS,
  ...FISCAL_HOST_SECTIONS,
  ...HOST_DASHBOARD_SECTIONS,
} as const;

export const SECTIONS_ACCESSIBLE_TO_ACCOUNTANTS = [
  ALL_SECTIONS.REPORTS,
  ALL_SECTIONS.PAYMENT_RECEIPTS,
  ALL_SECTIONS.HOST_EXPENSES,
  ALL_SECTIONS.FINANCIAL_CONTRIBUTIONS,
  ALL_SECTIONS.TRANSACTIONS,
  ALL_SECTIONS.EXPENSES,
  ALL_SECTIONS.HOST_AGREEMENTS,
];

export const PAGE_TITLES = defineMessages({
  [USER]: { id: 'UserDashboard', defaultMessage: 'User Dashboard' },
  [ORGANIZATION]: { id: 'OrganizationDashboard', defaultMessage: 'Organization Dashboard' },
  [COLLECTIVE]: { id: 'CollectiveDashboard', defaultMessage: 'Collective Dashboard' },
  [FUND]: { id: 'FundDashboard', defaultMessage: 'Fund Dashboard' },
  [EVENT]: { id: 'EventDashboard', defaultMessage: 'Event Dashboard' },
  [PROJECT]: { id: 'ProjectDashboard', defaultMessage: 'Project Dashboard' },
});

export const SECTION_LABELS = defineMessages({
  [ALL_SECTIONS.EXPENSES]: {
    id: 'Expenses',
    defaultMessage: 'Expenses',
  },
  [ALL_SECTIONS.MANAGE_CONTRIBUTIONS]: {
    id: 'menu.subscriptions',
    defaultMessage: 'Manage Contributions',
  },
  [ALL_SECTIONS.TRANSACTIONS]: {
    id: 'menu.transactions',
    defaultMessage: 'Transactions',
  },
  [ALL_SECTIONS.ACTIVITY_LOG]: {
    defaultMessage: 'Activity log',
  },
  [ALL_SECTIONS.HOST_EXPENSES]: {
    id: 'Expenses',
    defaultMessage: 'Expenses',
  },
  [ALL_SECTIONS.HOST_AGREEMENTS]: {
    id: 'Agreements',
    defaultMessage: 'Agreements',
  },
  [ALL_SECTIONS.FINANCIAL_CONTRIBUTIONS]: {
    id: 'FinancialContributions',
    defaultMessage: 'Financial Contributions',
  },
  [ALL_SECTIONS.PENDING_CONTRIBUTIONS]: {
    id: 'PendingContributions',
    defaultMessage: 'Pending Contributions',
  },
  [ALL_SECTIONS.PENDING_APPLICATIONS]: {
    id: 'AdminPanel.Menu.PendingApplications',
    defaultMessage: 'Pending Applications',
  },
  [ALL_SECTIONS.OVERVIEW]: {
    id: 'AdminPanel.Menu.Overview',
    defaultMessage: 'Overview',
  },
  [ALL_SECTIONS.BUDGET_MANAGEMENT]: {
    id: 'AdminPanel.Menu.Overview',
    defaultMessage: 'Overview',
  },
  [ALL_SECTIONS.DASHBOARD_OVERVIEW]: {
    id: 'AdminPanel.Menu.Overview',
    defaultMessage: 'Overview',
  },
  [ALL_SECTIONS.COLLECTIVES]: {
    id: 'Collectives',
    defaultMessage: 'Collectives',
  },
  [ALL_SECTIONS.REPORTS]: {
    id: 'Reports',
    defaultMessage: 'Reports',
  },
  [ALL_SECTIONS.ADVANCED]: {
    id: 'editCollective.menu.advanced',
    defaultMessage: 'Advanced',
  },
  [ALL_SECTIONS.COLLECTIVE_GOALS]: {
    id: 'Goals',
    defaultMessage: 'Goals',
  },
  [ALL_SECTIONS.COLLECTIVE_PAGE]: {
    id: 'editCollective.menu.collectivePage',
    defaultMessage: 'Profile Page',
  },
  [ALL_SECTIONS.CONNECTED_ACCOUNTS]: {
    id: 'editCollective.menu.connectedAccounts',
    defaultMessage: 'Connected Accounts',
  },
  [ALL_SECTIONS.EXPORT]: {
    id: 'editCollective.menu.export',
    defaultMessage: 'Export',
  },
  [ALL_SECTIONS.POLICIES]: {
    id: 'editCollective.menu.policies',
    defaultMessage: 'Policies',
  },
  [ALL_SECTIONS.CUSTOM_EMAIL]: {
    defaultMessage: 'Custom Email',
  },
  [ALL_SECTIONS.HOST]: {
    id: 'Fiscalhost',
    defaultMessage: 'Fiscal Host',
  },
  [ALL_SECTIONS.INFO]: {
    id: 'editCollective.menu.info',
    defaultMessage: 'Info',
  },
  [ALL_SECTIONS.INVOICES_RECEIPTS]: {
    id: 'becomeASponsor.invoiceReceipts',
    defaultMessage: 'Invoices & Receipts',
  },
  [ALL_SECTIONS.RECEIVING_MONEY]: {
    id: 'editCollective.receivingMoney',
    defaultMessage: 'Receiving Money',
  },
  [ALL_SECTIONS.SENDING_MONEY]: {
    id: 'editCollective.sendingMoney',
    defaultMessage: 'Sending Money',
  },
  [ALL_SECTIONS.FISCAL_HOSTING]: {
    id: 'editCollective.fiscalHosting',
    defaultMessage: 'Fiscal Hosting',
  },
  [ALL_SECTIONS.TEAM]: {
    id: 'ContributorsFilter.Core',
    defaultMessage: 'Team',
  },
  [ALL_SECTIONS.PAYMENT_METHODS]: {
    id: 'editCollective.menu.paymentMethods',
    defaultMessage: 'Payment Methods',
  },
  [ALL_SECTIONS.TIERS]: {
    id: 'Tiers',
    defaultMessage: 'Tiers',
  },
  [ALL_SECTIONS.GIFT_CARDS]: {
    id: 'editCollective.menu.giftCards',
    defaultMessage: 'Gift Cards',
  },
  [ALL_SECTIONS.WEBHOOKS]: {
    id: 'editCollective.menu.webhooks',
    defaultMessage: 'Webhooks',
  },
  [ALL_SECTIONS.AUTHORIZED_APPS]: {
    defaultMessage: 'Authorized Apps',
  },
  [ALL_SECTIONS.FOR_DEVELOPERS]: {
    defaultMessage: 'For developers',
  },
  [ALL_SECTIONS.TICKETS]: {
    id: 'section.tickets.title',
    defaultMessage: 'Tickets',
  },
  [ALL_SECTIONS.USER_SECURITY]: {
    id: 'Security',
    defaultMessage: 'Security',
  },
  [ALL_SECTIONS.PAYMENT_RECEIPTS]: {
    id: 'editCollective.menu.paymentReceipts',
    defaultMessage: 'Payment Receipts',
  },
  [ALL_SECTIONS.SECURITY]: {
    id: 'Security',
    defaultMessage: 'Security',
  },
  [ALL_SECTIONS.HOST_VIRTUAL_CARDS]: {
    id: 'VirtualCards.Title',
    defaultMessage: 'Virtual Cards',
  },
  [ALL_SECTIONS.HOST_VIRTUAL_CARD_REQUESTS]: {
    id: 'VirtualCardRequests.Title',
    defaultMessage: 'Virtual Card Requests',
  },
  [ALL_SECTIONS.HOST_VIRTUAL_CARDS_SETTINGS]: {
    id: 'VirtualCardsSettings.Title',
    defaultMessage: 'Virtual Cards Settings',
  },
  [ALL_SECTIONS.VIRTUAL_CARDS]: {
    id: 'VirtualCards.Title',
    defaultMessage: 'Virtual Cards',
  },
  [ALL_SECTIONS.HOSTED_COLLECTIVES]: {
    id: 'HostedCollectives',
    defaultMessage: 'Hosted Collectives',
  },
  [ALL_SECTIONS.HOME]: {
    id: 'home',
    defaultMessage: 'Home',
  },
  [ALL_SECTIONS.NOTIFICATIONS]: {
    id: 'NotificationsSettings.Title',
    defaultMessage: 'Notification Settings',
  },
  [ALL_SECTIONS.CONTRIBUTIONS]: {
    id: 'Contributions',
    defaultMessage: 'Contributions',
  },
  [ALL_SECTIONS.CONTRIBUTORS]: {
    id: 'Contributors',
    defaultMessage: 'Contributors',
  },
});
