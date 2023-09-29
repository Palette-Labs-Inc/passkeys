- [ ] Create and Abstract a `ReactNativeWebAuthnStamper` class into the typescripy Passkey class.
- [ ] write tests for iOS and Android
- [ ] add requirements section to readme for turnkey API keys.
- [ ] sha256 hash Android attestations.
- [ ] Turnkey only allows for -7 algorithm in registration. Write about this.
- [ ] write about simulator testing and enrolled biometrics

- [ ] Write a how to guide for setting up the turnkey example project.
- [ ] Regex enforce the challenge length.
- [ ] If user does not have fingerprint setup on Android, then the auth flow for Passkeys just throws a user cancelled error and dismisses the passkeys modal. Need to handle this error.
- [ ] Android took two attempts on new device to successfully create the passkey.




- [ ] Determine transports in registration response.
["Make sure to save the transports value returned from @simplewebauthn/browser's startRegistration() method too. Advanced WebAuthn functionality like cross-device auth (i.e. authenticating into a website displayed in Chrome on Windows by using your iPhone) is hard to design good UX around. You can use the browser to figure out when it is available by including each credential's transports in the allowCredentials array passed later into generateAuthenticateOptions(). They will help the browser figure out when a credential might enable a user to log in using new technology that wasn't available before."](https://simplewebauthn.dev/docs/advanced/passkeys)

- [ ] Add support for credential recovery
[If a user no longer has access to a device where they had stored their credentials, they might need to recover from a secure online backup. To learn more about how to support this credential recovery process, read the section titled "Recovering access or adding new devices" in this blog post: Security of Passkeys in the Google Password Manager.](https://developer.android.com/training/sign-in/passkeys#credential-recovery)




## wishlist:
- GCP Alloy secure enclaves.
- [ ] Add support for Turnkey and regular WebAuthN.
- [ ] Add supoport for cross-platform auth
- [ ] Add support for Account Abstraction



Add Passkey links to readme:
- https://developer.android.com/training/sign-in/passkeys
- https://support.apple.com/guide/iphone/sign-in-with-passkeys-iphf538ea8d0/ios


- No viable credential is available for this user.