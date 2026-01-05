// import { Tabs } from 'expo-router';
// import React from 'react';
// import { StyleSheet, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { BlurView } from 'expo-blur';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#2C94CB',
//         tabBarInactiveTintColor: '#999',
//         headerShown: false,
//         tabBarStyle: styles.tabBar,
//         tabBarLabelStyle: styles.tabBarLabel,
//         tabBarIconStyle: styles.tabBarIcon,
//         tabBarBackground: () => (
//           Platform.OS === 'ios' ? (
//             <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
//           ) : null
//         ),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Résumé',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? 'document-text' : 'document-text-outline'}
//               size={26}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="quiz"
//         options={{
//           title: 'Quiz',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? 'help-circle' : 'help-circle-outline'}
//               size={26}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
//               size={26}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profil',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? 'person-circle' : 'person-circle-outline'}
//               size={26}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: 'absolute',
//     bottom: 25,
//     // left: "30%",
//     // right: -50,
//     elevation: 0,
//     backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.05)',
//     borderRadius: 90,
//     width: "95%",
//     height: 60,
//     paddingBottom: 10,
//     paddingTop: 0,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//     marginLeft: "2%"

//   },
//   tabBarLabel: {
//     fontSize: 12,
//     fontFamily: 'Kufam-SemiBold',
//     marginTop: -5,
//   },
//   tabBarIcon: {
//     marginTop: 5,
//   },
// });