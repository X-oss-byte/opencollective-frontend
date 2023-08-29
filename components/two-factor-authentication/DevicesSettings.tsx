import React from 'react';
import { gql, useMutation } from '@apollo/client';
import * as webauthn from '@simplewebauthn/browser';
import { CheckCircle2Icon, CircleIcon, PlusIcon } from 'lucide-react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { API_V2_CONTEXT } from '../../lib/graphql/helpers';
import { Individual, TwoFactorMethod, UserTwoFactorMethod } from '../../lib/graphql/types/v2/graphql';

import { Box, Flex } from '../Grid';
import StyledButton from '../StyledButton';
import StyledCard from '../StyledCard';
import { H3 } from '../Text';
import { TOAST_TYPE, useToasts } from '../ToastProvider';

import { UserTwoFactorMethodItem } from './UserTwoFactorMethodItem';

const I18nMessages = defineMessages({
  DEVICE_ADDED: {
    defaultMessage: 'Device added',
  },
});

const CreateWebAuthnRegistrationOptionsMutation = gql`
  mutation CreateWebAuthnRegistrationOptions($account: AccountReferenceInput!) {
    createWebAuthnRegistrationOptions(account: $account)
  }
`;

const AddTwoFactorAuthToIndividualMutation = gql`
  mutation AddTwoFactorAuthToIndividual($account: AccountReferenceInput!, $token: String!) {
    addTwoFactorAuthTokenToIndividual(account: $account, token: $token, type: WEBAUTHN) {
      account {
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
      recoveryCodes
    }
  }
`;

type DevicesSettingsProps = {
  userTwoFactorAuthenticationMethods: UserTwoFactorMethod[];
  individual: Pick<Individual, 'id' | 'email'>;
  onRecoveryCodes: (recoveryCodes: string[]) => void;
};

export function DevicesSettings(props: DevicesSettingsProps) {
  const intl = useIntl();
  const twoFactorMethods = props.userTwoFactorAuthenticationMethods.filter(m => m.method === TwoFactorMethod.WEBAUTHN);
  const hasTwoFactorMethod = twoFactorMethods.length > 0;
  const { addToast } = useToasts();

  const [createPublicKeyRequestOptions] = useMutation(CreateWebAuthnRegistrationOptionsMutation, {
    context: API_V2_CONTEXT,
  });

  const [addWebauthnDevice] = useMutation(AddTwoFactorAuthToIndividualMutation, {
    context: API_V2_CONTEXT,
  });

  const startWebauthnDeviceRegistration = React.useCallback(async () => {
    const response = await createPublicKeyRequestOptions({
      variables: {
        account: {
          id: props.individual.id,
        },
      },
    });

    try {
      const registration = await webauthn.startRegistration(response.data.createWebAuthnRegistrationOptions);
      const registrationBase64 = Buffer.from(JSON.stringify(registration)).toString('base64');

      const result = await addWebauthnDevice({
        variables: {
          account: {
            id: props.individual.id,
          },
          token: registrationBase64,
        },
      });

      if (result.data.addTwoFactorAuthTokenToIndividual.recoveryCodes) {
        props.onRecoveryCodes(result.data.addTwoFactorAuthTokenToIndividual.recoveryCodes);
      }

      addToast({
        type: TOAST_TYPE.SUCCESS,
        message: intl.formatMessage(I18nMessages.DEVICE_ADDED),
      });
    } catch (e) {
      addToast({ type: TOAST_TYPE.ERROR, message: e.message });
    }
  }, [props.individual.id, intl]);

  return (
    <StyledCard px={3} py={2}>
      <Flex alignItems="center">
        <Box mr={3}>{hasTwoFactorMethod ? <CheckCircle2Icon color="#0EA755" /> : <CircleIcon />}</Box>
        <H3 fontSize="14px" fontWeight="700">
          <FormattedMessage defaultMessage="U2F (Universal 2nd Factor)" />
        </H3>
      </Flex>
      <Box>
        {twoFactorMethods.map(device => {
          return (
            <Box px={4} key={device.id}>
              <UserTwoFactorMethodItem individual={props.individual} userTwoFactorMethod={device} />
            </Box>
          );
        })}
      </Box>
      <Box mt={3}>
        <StyledButton
          onClick={startWebauthnDeviceRegistration}
          buttonSize="tiny"
          buttonStyle="secondary"
          display="flex"
        >
          <FormattedMessage defaultMessage="Add device" /> <PlusIcon size="14px" />
        </StyledButton>
      </Box>
    </StyledCard>
  );
}
