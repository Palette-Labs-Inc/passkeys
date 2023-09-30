package com.palettelabs.passkey

import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log

import androidx.credentials.CredentialManager
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.exceptions.*
import androidx.credentials.exceptions.publickeycredential.CreatePublicKeyCredentialDomException
import androidx.credentials.exceptions.publickeycredential.GetPublicKeyCredentialDomException

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

import java.security.MessageDigest
import java.nio.charset.StandardCharsets
import java.util.Base64
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class PasskeyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val mainScope = CoroutineScope(Dispatchers.Default)

  @Serializable
  data class PublicKeyCredentialRequestOptionsJSON(
    var challenge: String,
    val timeout: Long,
    val rpId: String,
    val userVerification: String = "preferred"
  )
  override fun getName(): String {
    return "Passkey"
  }

  @ReactMethod
  fun register(requestJson: String, promise: Promise) {
    val credentialManager = CredentialManager.create(reactApplicationContext.applicationContext)
    val createPublicKeyCredentialRequest = CreatePublicKeyCredentialRequest(requestJson)

    mainScope.launch {
      try {
        val result = currentActivity?.let { credentialManager.createCredential(it, createPublicKeyCredentialRequest) }

        val response =
          result?.data?.getString("androidx.credentials.BUNDLE_KEY_REGISTRATION_RESPONSE_JSON")
        promise.resolve(response)
      } catch (e: CreateCredentialException) {
        promise.reject("Passkey", handleRegistrationException(e))
      }
    }
  }

  private fun handleRegistrationException(e: CreateCredentialException): String {
    when (e) {
      is CreatePublicKeyCredentialDomException -> {
        return e.domError.toString()
      }
      is CreateCredentialCancellationException -> {
        return "UserCancelled"
      }
      is CreateCredentialInterruptedException -> {
        return "Interrupted"
      }
      is CreateCredentialProviderConfigurationException -> {
        return "NotConfigured"
      }
      is CreateCredentialUnknownException -> {
        return "UnknownError"
      }
      is CreateCredentialUnsupportedException -> {
        return "NotSupported"
      }
      else -> {
        return e.toString()
      }
    }
  }

  @RequiresApi(Build.VERSION_CODES.O)
  @ReactMethod
  fun authenticate(requestJson: String, promise: Promise) {
    Log.e("pk",requestJson)

    val credentialManager = CredentialManager.create(reactApplicationContext.applicationContext)
    Log.e("hash",requestJson)

    // Deserialize the JSON string into a data class
    val requestOptions = Json.decodeFromString<PublicKeyCredentialRequestOptionsJSON>(requestJson)

    // Extract the challenge and store it in a val
    val challenge = requestOptions.challenge
    Log.e("hash",challenge)

    //perform challenge hash
    val challengeData = computeSHA256Hash(challenge)

    if (challengeData !== null) {
      requestOptions.challenge = challengeData

      val encodedRequestJson = Json.encodeToString(requestOptions)

      Log.e("hash",encodedRequestJson)

      val getCredentialRequest =
        GetCredentialRequest(listOf(GetPublicKeyCredentialOption(encodedRequestJson)))

      mainScope.launch {
        try {
          val result =
            currentActivity?.let { credentialManager.getCredential(it, getCredentialRequest) }

          val response =
            result?.credential?.data?.getString("androidx.credentials.BUNDLE_KEY_AUTHENTICATION_RESPONSE_JSON")
          promise.resolve(response)
        } catch (e: GetCredentialException) {
          promise.reject("Passkey", handleAuthenticationException(e))
        }
      }
    }else{
      promise.reject("Passkey","invalid challenge. Unable to hash the provided string.")
    }
  }

  private fun handleAuthenticationException(e: GetCredentialException): String {
    when (e) {
      is GetPublicKeyCredentialDomException -> {
        return e.domError.toString()
      }
      is GetCredentialCancellationException -> {
        return "UserCancelled"
      }
      is GetCredentialInterruptedException -> {
        return "Interrupted"
      }
      is GetCredentialProviderConfigurationException -> {
        return "NotConfigured"
      }
      is GetCredentialUnknownException -> {
        return "UnknownError"
      }
      is GetCredentialUnsupportedException -> {
        return "NotSupported"
      }
      is NoCredentialException -> {
        return "NoCredentials"
      }
      else -> {
        return e.toString()
      }
    }
  }


  @RequiresApi(Build.VERSION_CODES.O)
  private fun computeSHA256Hash(challenge: String): String? {
    try {
      // Convert the challenge string to bytes
      val messageBytes = challenge.toByteArray(StandardCharsets.UTF_8)

      // Compute the SHA-256 hash
      val digest = MessageDigest.getInstance("SHA-256")
      val hashBytes = digest.digest(messageBytes)

      val hexString = hashBytes.joinToString("") { "%02x".format(it) }
      Log.e("hash",hexString)

      // If needed, you can convert the hex string back to bytes or other types
      val hexData = hexString.toByteArray(StandardCharsets.UTF_8)
      val uInt8Array = ByteArray(hexData.size) { hexData[it].toByte() }
      val encodedString = Base64.getUrlEncoder().encodeToString(uInt8Array)

      Log.e("hash",encodedString)
      return  encodedString

    } catch (e: Exception) {
      // Handle any exceptions (e.g., invalid challenge)
      return null
    }
  }
}
