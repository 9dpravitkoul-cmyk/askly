/**
 * Maps Firebase Authentication error codes to user-friendly messages.
 */
export function getFriendlyAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your spelling or create an account.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or click "Forgot password".';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please log in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completion.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was interrupted. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for localhost / this domain.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized in Firebase Console. Please add your domain (e.g. localhost) in Firebase Authentication > Settings > Authorized domains.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in your Firebase Console. Please enable Email/Password or Google under Authentication > Sign-in method.';
    case 'auth/admin-restricted-operation':
      return 'This sign-in method is disabled for the Firebase project. For audience joining, enable Anonymous under Authentication → Sign-in method.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access to this account has been temporarily restricted. Try again later or reset your password.';
    case 'auth/configuration-missing':
      return 'Firebase configuration is missing in .env.local. Please provide your Firebase project keys.';
    default:
      return 'Authentication failed. Please check your details and try again.';
  }
}
