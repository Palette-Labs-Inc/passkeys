export interface PasskeyError {
  error: string;
  message: string;
  code: PasskeyErrorCode;
}

export declare enum PasskeyErrorCode {
  UnknownError = 'UnknownError',
  NotSupported = 'NotSupported',
  RequestFailed = 'RequestFailed',
  UserCancelled = 'UserCancelled',
  InvalidChallenge = 'InvalidChallenge',
  InvalidUserId = 'InvalidUserId',
  NotConfigured = 'NotConfigured',
  NoCredentials = 'NoCredentials',
  Interrupted = 'Interrupted',
}

export const UnknownError: PasskeyError = {
  error: 'Unknown error',
  message: 'An unknown error occurred',
  code: PasskeyErrorCode.UnknownError,
};

export const NotSupportedError: PasskeyError = {
  error: 'NotSupported',
  message:
    'Passkeys are not supported on this device. iOS 15 and above is required to use Passkeys',
  code: PasskeyErrorCode.NotSupported,
};

export const RequestFailedError: PasskeyError = {
  error: 'RequestFailed',
  message: 'The request failed. No Credentials were returned.',
  code: PasskeyErrorCode.RequestFailed,
};

export const UserCancelledError: PasskeyError = {
  error: 'UserCancelled',
  message: 'The user cancelled the request.',
  code: PasskeyErrorCode.UserCancelled,
};

export const InvalidChallengeError: PasskeyError = {
  error: 'InvalidChallenge',
  message: 'The provided challenge was invalid',
  code: PasskeyErrorCode.InvalidChallenge,
};

export const InvalidUserIdError: PasskeyError = {
  error: 'InvalidUserId',
  message: 'The provided userId was invalid',
  code: PasskeyErrorCode.InvalidUserId,
};

export const NotConfiguredError: PasskeyError = {
  error: 'NotConfigured',
  message: 'Your app is not properly configured. Refer to the docs for help.',
  code: PasskeyErrorCode.NotConfigured,
};

export const NoCredentialsError: PasskeyError = {
  error: 'NoCredentials',
  message: 'No viable credential is available for the user.',
  code: PasskeyErrorCode.NoCredentials,
};

export const InterruptedError: PasskeyError = {
  error: 'Interrupted',
  message: 'The operation was interrupted and may be retried.',
  code: PasskeyErrorCode.Interrupted,
};

export const NativeError = (
  message = 'An unknown error occurred'
): PasskeyError => {
  return {
    error: 'Native error',
    message: message,
    code: PasskeyErrorCode.UnknownError,
  };
};

export function handleNativeError(_error: unknown): PasskeyError {
  if (typeof _error !== 'object') {
    return UnknownError;
  }

  const error = String(_error).split(' ')[1];

  switch (error) {
    case 'NotSupported': {
      return NotSupportedError;
    }
    case 'RequestFailed': {
      return RequestFailedError;
    }
    case 'UserCancelled': {
      return UserCancelledError;
    }
    case 'InvalidChallenge': {
      return InvalidChallengeError;
    }
    case 'NotConfigured': {
      return NotConfiguredError;
    }
    case 'Interrupted': {
      return InterruptedError;
    }
    case 'NoCredentials': {
      return NoCredentialsError;
    }
    case 'UnknownError': {
      return UnknownError;
    }
    default: {
      return NativeError(error);
    }
  }
}
