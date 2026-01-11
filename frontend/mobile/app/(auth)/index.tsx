import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { logoStyle } from '@/styles/logo';
import { useRouter } from 'expo-router';
import { storage } from '@/api/storage/token';

interface AuthIndexScreenProps {
    navigation?: any;
}

const AuthIndexScreen: React.FC<AuthIndexScreenProps> = () => {
    const animationRef = useRef<LottieView>(null);

    const router = useRouter();
    const [checking,setChecking]=useState(true);
    useEffect(() => {
        // Vérifie si une session existe (token + user + exp si possible)
        (async () => {
        try {
            const res = await storage.verifySession();
            if (res.ok) {
            // utilisateur encore connecté -> redirige vers Upload (/home)
            router.replace('/home');
            return;
            }
        } finally {
            setChecking(false);
        }
        })();
  }, []);


    const handleLogin = () => {
        router.push("/(auth)/login")
    }

      if (checking) {
            return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10, color: "#666" }}>Vérification de session…</Text>
            </View>
            );
        }
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Text style={logoStyle}>StudyAI</Text>

            <View style={styles.robotContainer}>
                <LottieView
                    ref={animationRef}
                    source={require('@/assets/animations/robot.json')}
                    autoPlay
                    loop
                    style={styles.robotAnimation}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Connexion</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    // onPress={}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryButtonText}>Inscription</Text>
                </TouchableOpacity>

                <Text style={styles.socialText}>
                    Ou connecte toi à partir de tes réseaux
                </Text>

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, styles.facebookButton]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-facebook" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.googleButton]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-google" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.linkedinButton]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-linkedin" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logo: {
        fontSize: 36,
        fontFamily: 'Kufam-Bold',
        color: '#2C94CB',
        textAlign: 'center',
        marginTop: 40,
        letterSpacing: 0.5,
    },
    robotContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50,
    },
    robotAnimation: {
        width: 300,
        height: 300,
    },
    buttonContainer: {
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#2C94CB',
        borderRadius: 30,
        paddingVertical: 2,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#2C94CB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Kufam-Bold',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 2,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#2C94CB',
        marginBottom: 15,
    },
    secondaryButtonText: {
        color: '#2C94CB',
        fontSize: 18,
        fontFamily: 'Kufam-Bold',
        letterSpacing: 0.5,
    },
    socialText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 13,
        fontFamily: 'Kufam-Regular',
        marginBottom: 15,
        marginTop: 10,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    facebookButton: {
        backgroundColor: '#3b5998',
    },
    googleButton: {
        backgroundColor: '#DB4437',
    },
    linkedinButton: {
        backgroundColor: '#0077B5',
    },
});

export default AuthIndexScreen;