import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const unstable_settings = {
  anchor: '',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Kufam-Black': require('@/assets/fonts/Kufam-Black.ttf'),
    'Kufam-Regular': require('@/assets/fonts/Kufam-Regular.ttf'),
    'Kufam-Italic': require('@/assets/fonts/Kufam-Italic.ttf'),
    'Kufam-Medium': require('@/assets/fonts/Kufam-Medium.ttf'),
    'Kufam-Bold': require('@/assets/fonts/Kufam-Bold.ttf'),
    'Kufam-SemiBold': require('@/assets/fonts/Kufam-SemiBold.ttf'),
  });

  const colorScheme = useColorScheme();
  const stackOptionStyle: NativeStackNavigationOptions = {
    headerShown: false
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={stackOptionStyle} />
      <Stack.Screen name="home" options={stackOptionStyle} />
      <Stack.Screen name="choose" options={stackOptionStyle} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="chat" options={stackOptionStyle} />
      <Stack.Screen name="quiz" options={stackOptionStyle} />
      <Stack.Screen name="summary" options={stackOptionStyle} />
    </Stack>
  );
}
