import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Header from '@/components/header/header';
import { login } from '@/api/auth'
import { Alert } from "react-native";
import toast from "react-native-toast-message";
import axios from 'axios';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;

  const start = Date.now();
  const MIN = 700; //durée minimum visible

    try {
        setLoading(true); // start loader
      await login(email, password)
      toast.show(
        { type: "success", text1: "Connexion réussie" });
            const elapsed = Date.now() - start;
       const wait = Math.max(0, MIN - elapsed);
     
    setTimeout(() => {
      router.replace("/home");
      // pas besoin de setLoading(false) car l'écran se démonte
    }, wait);

    } catch (e: unknown) {
      const msg =
        axios.isAxiosError(e)
          ? (e.response?.data as any)?.error ?? e.message
          : "Erreur réseau/serveur";

      Alert.alert("Connexion impossible", msg);
         setLoading(false); // stop loader si erreur

    }

  }

  const handleRegister = () => {
    router.push("/(auth)/register")
  }

  const handleHome = () => {
    router.push("/home")
  }

      if (loading) {
        return (
          <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
              <ActivityIndicator size="large" />
              <Text style={{ color: "#666" }}>Connexion en cours…</Text>
            </View>
          </SafeAreaView>
  );
}
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark' animated />
      <Header />

      <View style={styles.mainView}>

        <Text style={styles.title}>Se Connecter !</Text>
        <Text style={styles.subtitle}>Connectez vous pour continuer</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#2C94CB"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Connexion</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Vous n'avez pas de compte ? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.signupLink} >S'inscrire</Text>
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
    padding: 10
  },
  // scrollContent: {
  //   flexGrow: 1,
  //   paddingHorizontal: 30,
  //   paddingBottom: 40,
  // },
  backButton: {
    // marginTop: 10,
    // marginBottom: 20,
    // width: 40,
    // height: 40,
    // justifyContent: 'center',
  },
  mainView: {
    padding: 15,
    marginTop: "15%"
  },
  logo: {
    fontSize: 22,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    marginBottom: -20,
  },
  subtitle: {
    fontSize: 19,
    fontFamily: 'Kufam-Regular',
    color: 'rgba(85, 85, 85, 0.47)',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
    marginBottom: -5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#2C94CB',
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#000',
    backgroundColor: '#fff',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -5,
    marginBottom: 30,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: 'Kufam-SemiBold',
    color: '#F9690E',
  },
  loginButton: {
    backgroundColor: '#2C94CB',
    borderRadius: 30,
    paddingVertical: 5,
    alignItems: 'center',
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
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'Kufam-SemiBold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 2,
    borderColor: '#2C94CB',
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },

});

export default LoginScreen;