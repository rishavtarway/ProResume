import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { TemplatesScreen } from './src/screens/TemplatesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { JobTrackerScreen } from './src/screens/JobTrackerScreen';
import { ResumeFormScreen } from './src/screens/ResumeFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{emoji}</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ResumeForm" component={ResumeFormScreen} options={{ headerShown: true, title: 'Edit Resume', headerStyle: { backgroundColor: '#4A90E2' }, headerTintColor: '#FFFFFF' }} />
  </Stack.Navigator>
);

const TemplatesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TemplatesMain" component={TemplatesScreen} />
  </Stack.Navigator>
);

const JobTrackerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JobTrackerMain" component={JobTrackerScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: '#4A90E2', tabBarInactiveTintColor: '#999999', tabBarLabelStyle: styles.tabLabel }}>
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
        <Tab.Screen name="Templates" component={TemplatesStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎨" focused={focused} /> }} />
        <Tab.Screen name="JobTracker" component={JobTrackerStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💼" focused={focused} />, title: 'Jobs' }} />
        <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#FFFFFF', borderTopWidth: 0, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, height: 85, paddingTop: 8, paddingBottom: 25 },
  tabLabel: { fontSize: 12, fontWeight: '600' },
  tabIconContainer: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 24, opacity: 0.6 },
  tabIconFocused: { opacity: 1 },
});

export default App;
