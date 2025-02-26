import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '../../config/firebase';

// Create a single instance of GoogleAuthProvider
const googleProvider = new GoogleAuthProvider();

export const firebaseAuth = {
  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Sign up failed' };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      // First try popup
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
      } catch (popupError) {
        // If popup is blocked, fall back to redirect
        if ((popupError as Error).message?.includes('popup')) {
          await signInWithRedirect(auth, googleProvider);
          // The result will be handled by getRedirectResult
          return { user: null, error: null };
        }
        throw popupError;
      }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Google sign in failed' };
    }
  },

  // Get redirect result
  getRedirectResult: async () => {
    try {
      const result = await getRedirectResult(auth);
      return result ? { user: result.user, error: null } : { user: null, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Failed to get redirect result' };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  },

  // Subscribe to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};