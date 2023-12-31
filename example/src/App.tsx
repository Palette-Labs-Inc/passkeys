import * as React from 'react';

import { StyleSheet, View, Button, TextInput, Alert } from 'react-native';
import { Passkey } from '@palette-labs/passkey';
import { PasskeyErrorCode } from 'src/PasskeyError';

//import RegRequest from '../../src/__tests__/testData/RegRequest.json';
//import AuthRequest from '../../src/__tests__/testData/AuthRequest.json';

export default function App() {
  const [email, setEmail] = React.useState('');

  const RegRequest = {
    challenge: 'R19ndDhQcWJlM05lN25Mb2NpbDE4ekxX',
    rp: {
      name: 'Passkey Test',
      id: 'mperhats.github.io',
    },
    user: {
      id: '2HzoHm_hY0CjuEESY9tY6-3SdjmNHOoNqaPDcZGzsr0',
      name: 'Passkey Test',
      displayName: 'Passkey Test',
    },
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7,
      },
    ],
    timeout: 1800000,
    attestation: 'none',
    excludeCredentials: [],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      requireResidentKey: true,
      residentKey: 'required',
      userVerification: 'required',
    },
  };

  const AuthRequest = {
    challenge: 'T1xCsnxM2DNL2KdK5CLa6fMhD7OBqho6syzInk_n-Uo',
    timeout: 1800000,
    userVerification: 'required',
    rpId: 'mperhats.github.io',
  };

  async function createAccount() {
    const requestJson = {
      // ...Retrieve request from server
      ...RegRequest,
    };

    const { error, result } = await Passkey.register(requestJson);

    if (error?.code !== PasskeyErrorCode.UserCancelled) {
      console.log(error);
    }

    console.log('Registration result: ', result);
  }

  async function authenticateAccount() {
    const requestJson = {
      // ...Retrieve request from server
      ...AuthRequest,
    };

    const { error, result } = await Passkey.authenticate(requestJson);
    if (error?.code !== PasskeyErrorCode.UserCancelled) {
      console.log(error);
    }
    console.log('Authentication result: ', result);
  }

  async function createAccountWithSecurityKey() {
    const requestJson = {
      // ...Retrieve request from server
      ...RegRequest,
    };

    const { error, result } = await Passkey.register(requestJson, {
      withSecurityKey: true,
    });

    if (error?.code !== PasskeyErrorCode.UserCancelled) {
      console.log(error);
    }

    console.log('Registration result: ', result);
  }

  async function authenticateAccountWithSecurityKey() {
    const requestJson = {
      // ...Retrieve request from server
      ...AuthRequest,
    };

    const { error, result } = await Passkey.authenticate(requestJson, {
      withSecurityKey: true,
    });
    if (error?.code !== PasskeyErrorCode.UserCancelled) {
      console.log(error);
    }

    console.log('Authentication result: ', result);
  }

  async function isSupported() {
    const result = Passkey.isSupported();
    Alert.alert(result ? 'Supported' : 'Not supported');
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="email" value={email} onChangeText={setEmail} />
      <Button title="Create Account" onPress={createAccount} />
      <Button
        title="Create Account with Security Key"
        onPress={createAccountWithSecurityKey}
      />
      <Button title="Authenticate" onPress={authenticateAccount} />
      <Button
        title="Authenticate with Security Key"
        onPress={authenticateAccountWithSecurityKey}
      />
      <Button title="isSupported?" onPress={isSupported} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
