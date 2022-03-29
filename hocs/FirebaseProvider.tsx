import React, {  useState, ReactNode, useContext, useEffect, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import { useCookies } from "react-cookie";
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signInWithEmailAndPassword, signOut, User, sendPasswordResetEmail  } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { apiPostRequest } from './axiosRequests';

interface CurrentUser {
    user: User;
    accessToken: string;
}

interface ContextValue {
    currentUser: CurrentUser | null;
    firebaseClass: FirebaseAuthentication | null
}

const defaultValue: ContextValue = {
    currentUser: null,
    firebaseClass: null
}

const firebaseApp = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
});


const AuthContext = createContext(defaultValue);
const firebaseAuth = getAuth(firebaseApp);
export const FirebaseStorage = getStorage(firebaseApp);

class FirebaseAuthentication {

    signupWithEmailPassword(firstName: string, lastName: string, email: string, password: string, gender: string, middleName: string, phoneNumber: string) {
        const body = JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            email: email,
            password: password,
            gender: gender,
            phoneNumber: phoneNumber
        })

        return apiPostRequest('/accounts/emailSignup', body);
    }

    signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(firebaseAuth, provider);
    }

    signInWithFacebook() {
        const provider = new FacebookAuthProvider();

        return signInWithPopup(firebaseAuth, provider);
    }

    signInWithEmailAndPassword(email: string, password: string) {
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    }

    forgotPassword(email: string) {
        return sendPasswordResetEmail(firebaseAuth, email);
    }

    signOut() {
        return signOut(firebaseAuth);
    }

}

export default function FirebaseProvider({ children }: { children: ReactNode }) {
    const [cookie, setCookie, removeCookie] = useCookies(["loggedInUser"]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const firebaseAuthClass = new FirebaseAuthentication();

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                user.getIdToken().then(token => {
                    setCurrentUser(state => ({
                        accessToken: token,
                        user: user
                    }))
                }).catch(error => setCurrentUser(state => null))
            } else setCurrentUser(state => null);

            setLoading(false);
        });

        return unsubscribe;
    }, [])

    useEffect(() => {
        if (currentUser) {
            setCookie("loggedInUser", currentUser.accessToken, {
                path: "/",
                maxAge: 3600, // Expires after 1hr
                sameSite: true,
            })
        } else {
            removeCookie("loggedInUser", {
                path: "/"
            })
        }
    }, [currentUser, setCookie, removeCookie]);

    const firebaseValue = {
        currentUser: currentUser,
        firebaseClass: firebaseAuthClass
    }

    return (
        <AuthContext.Provider value={firebaseValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

