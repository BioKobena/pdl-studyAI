import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header/header';

interface RegisterScreenProps {
    navigation?: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [nom, setNom] = useState('');
    const [prenoms, setPrenoms] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />
            <Header />
            <View>

                <Text style={styles.logo}>StudyAI</Text>

                <Text style={styles.title}>S'inscrire !</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre nom"
                        placeholderTextColor="#B0B0B0"
                        value={nom}
                        onChangeText={setNom}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Prénoms</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre prénoms"
                        placeholderTextColor="#B0B0B0"
                        value={prenoms}
                        onChangeText={setPrenoms}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre email"
                        placeholderTextColor="#B0B0B0"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre mot de passe"
                        placeholderTextColor="#B0B0B0"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirmer votre mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer votre mot de passe"
                        placeholderTextColor="#B0B0B0"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <TouchableOpacity
                    style={styles.registerButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.registerButtonText}>Inscription</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Vous avez pas de compte ? </Text>
                    <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                        <Text style={styles.loginLink}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    backButton: {
        marginTop: 10,
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    logo: {
        fontSize: 32,
        fontFamily: 'Kufam-Bold',
        color: '#2C94CB',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Kufam-Bold',
        color: '#2C94CB',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Kufam-SemiBold',
        color: '#2C94CB',
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,
        borderColor: '#2C94CB',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 15,
        fontFamily: 'Kufam-Regular',
        color: '#000',
        backgroundColor: '#fff',
    },
    registerButton: {
        backgroundColor: '#2C94CB',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#2C94CB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonText: {
        fontSize: 18,
        fontFamily: 'Kufam-Bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
        fontSize: 14,
        fontFamily: 'Kufam-Regular',
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        fontFamily: 'Kufam-Bold',
        color: '#2C94CB',
    },
});

export default RegisterScreen;