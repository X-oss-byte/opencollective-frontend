import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';

import { i18nGraphqlException } from '../../lib/errors';
import { API_V2_CONTEXT } from '../../lib/graphql/helpers';
import { Individual } from '../../lib/graphql/types/v2/graphql';
import { TwoFactorAuthenticationHeader } from '../../lib/two-factor-authentication';
import { useTwoFactorAuthenticationPrompt } from '../../lib/two-factor-authentication/TwoFactorAuthenticationContext';

import ConfirmationModal, { CONFIRMATION_MODAL_TERMINATE } from '../ConfirmationModal';
import { Box, Flex } from '../Grid';
import MessageBox from '../MessageBox';
import StyledButton from '../StyledButton';
import StyledCard from '../StyledCard';
import { H3, P } from '../Text';
import { TOAST_TYPE, useToasts } from '../ToastProvider';

const RemoveTwoFactorAuthenticationMutation = gql`
  mutation RemoveTwoFactorAuthentication($account: AccountReferenceInput!) {
    removeTwoFactorAuthTokenFromIndividual(account: $account) {
      id
      hasTwoFactorAuth
      twoFactorMethods {
        id
        method
        name
        createdAt
        description
        icon
      }
    }
  }
`;

type RecoverySettingsProps = {
  individual: Pick<Individual, 'id'>;
};

export function RecoverySettings(props: RecoverySettingsProps) {
  const intl = useIntl();
  const { addToast } = useToasts();

  const [isRemovingTwoFactorAuthentication, setIsRemovingTwoFactorAuthentication] = React.useState(false);
  const [removeTwoFactorAuthentication] = useMutation(RemoveTwoFactorAuthenticationMutation);

  const prompt = useTwoFactorAuthenticationPrompt();

  const onRemoveConfirmation = React.useCallback(async () => {
    let twoFactorResult: { code: string; type: string };
    try {
      twoFactorResult = await prompt.open({ supportedMethods: ['recovery_code'], allowRecovery: true });
    } catch (e) {
      return;
    }

    try {
      await removeTwoFactorAuthentication({
        context: {
          ...API_V2_CONTEXT,
          headers: {
            [TwoFactorAuthenticationHeader]: `${twoFactorResult.type} ${twoFactorResult.code}`,
          },
        },
        variables: {
          account: {
            id: props.individual.id,
          },
        },
      });
      addToast({
        type: TOAST_TYPE.SUCCESS,
        message: <FormattedMessage defaultMessage="Two factor authentication disabled." />,
      });
      return CONFIRMATION_MODAL_TERMINATE;
    } catch (e) {
      addToast({
        type: TOAST_TYPE.ERROR,
        message: i18nGraphqlException(intl, e),
      });
    } finally {
      setIsRemovingTwoFactorAuthentication(false);
    }
  }, [removeTwoFactorAuthentication, props.individual]);

  return (
    <StyledCard px={3} py={2}>
      <Flex alignItems="center">
        <H3 fontSize="14px" fontWeight="700">
          <FormattedMessage defaultMessage="Recovery" />
        </H3>
      </Flex>
      <Box mt={3}>
        <StyledButton
          onClick={() => setIsRemovingTwoFactorAuthentication(true)}
          buttonSize="tiny"
          buttonStyle="dangerSecondary"
        >
          <FormattedMessage defaultMessage="Reset Two Factor Authentication" />
        </StyledButton>
      </Box>
      {isRemovingTwoFactorAuthentication && (
        <ConfirmationModal
          isDanger
          type="delete"
          onClose={() => setIsRemovingTwoFactorAuthentication(false)}
          header={
            <FormattedMessage defaultMessage="Are you sure you want to remove two-factor authentication from your account?" />
          }
          continueHandler={onRemoveConfirmation}
        >
          <MessageBox type="warning" withIcon>
            <FormattedMessage defaultMessage="Removing 2FA from your account can make it less secure." />
          </MessageBox>
          <P mt={3}>
            <FormattedMessage defaultMessage="If you would like to remove 2FA from your account, you will need to enter a recovery code" />
          </P>
        </ConfirmationModal>
      )}
    </StyledCard>
  );
}
