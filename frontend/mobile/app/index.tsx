import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
interface OnboardingScreenProps {
  navigation?: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push("/(auth)")
    }, 2000);
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text style={styles.logo}>StudyAI</Text>

      <View style={styles.content}>
        <Text style={styles.title}>Dépose ton PDF, révise plus vite</Text>

        <Text style={styles.subtitle}>
          StudyAI transforme tes cours{'\n'}
          en quiz, résumés et échanges type chat pour{'\n'}
          t'aider à mémoriser.
        </Text>

        {/* Robot Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/robot-book.png')}
            style={styles.robotImage}
            resizeMode="contain"
          />
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
  logo: {
    fontSize: 36,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    textAlign: 'center',
    marginTop: 80,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Kufam-Bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  robotImage: {
    width: '100%',
    height: '100%',
    maxWidth: 350,
    maxHeight: 350,
  },
});

export default OnboardingScreen;