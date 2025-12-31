import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native'
import { logoStyle } from './logo'
export const stylesOnboarding = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    ...logoStyle
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
})