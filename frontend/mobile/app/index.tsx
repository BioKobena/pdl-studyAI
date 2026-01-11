import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { stylesOnboarding } from '@/styles/onboarding';
interface OnboardingScreenProps {
  navigation?: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const router = useRouter()

    setTimeout(() => {
      router.push("/(auth)")
  }, 2000);


  return (
    <View style={stylesOnboarding.container}>
      <StatusBar style="dark" animated />
      <Text style={stylesOnboarding.logo}>StudyAI</Text>

      <View style={stylesOnboarding.content}>
        <Text style={stylesOnboarding.title}>Dépose ton PDF, révise plus vite</Text>

        <Text style={stylesOnboarding.subtitle}>
          StudyAI transforme tes cours{'\n'}
          en quiz, résumés et échanges type chat pour{'\n'}
          t'aider à mémoriser.
        </Text>

        <View style={stylesOnboarding.imageContainer}>
          <Image
            source={require('@/assets/images/robot-book.png')}
            style={stylesOnboarding.robotImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;