import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
