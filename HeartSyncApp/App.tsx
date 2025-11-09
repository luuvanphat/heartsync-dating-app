import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from './src/store/useStore';
import {RootStackParamList, MainTabParamList} from './src/types';
import { SafeAreaView } from 'react-native-safe-area-context';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatDetailScreen from './src/screens/ChatDetailScreen';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import FiltersScreen from './src/screens/FiltersScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import UpgradePremiumScreen from './src/screens/UpgradePremiumScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = 'home';

          if (route.name === 'Swipe') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'Matches') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00BCD4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Swipe" component={SwipeScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = (): React.JSX.Element => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen
                name="ChatDetail"
                component={ChatDetailScreen}
                
              />
              <Stack.Screen
                name="ProfileDetail"
                component={ProfileDetailScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                
              />
              <Stack.Screen
                name="Filters"
                component={FiltersScreen}
                
              />
              <Stack.Screen
                name="VideoCall"
                component={VideoCallScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="UpgradePremium"
                component={UpgradePremiumScreen}
                options={{
                  presentation: 'modal',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;