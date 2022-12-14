import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import OrderScreen from '../Screens/OrderScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import ListMenu from '../Screens/ListMenu';
import DetailProfileScreen from '../Screens/DetailProfileScreen';
import ChangePasswordScreen from '../Screens/ChangePasswordScreen';
import ScannerScreen from '../Screens/ScannerScreen';

const Stack = createStackNavigator();

const MainStackNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{headerShown: false}}
        component={HomeScreen}
      />
      <Stack.Screen
        name="ListMenu"
        options={{headerShown: false}}
        component={ListMenu}
      />
    </Stack.Navigator>
  );
};

const OrderStackNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        options={{headerShown: false}}
        component={OrderScreen}
      />
    </Stack.Navigator>
  );
};

const HistoryStackNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        options={{headerShown: false}}
        component={HistoryScreen}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={{headerShown: false}}
        component={ProfileScreen}
      />
      <Stack.Screen
        name="DetailProfile"
        options={{headerShown: false}}
        component={DetailProfileScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{headerShown: false}}
        component={ChangePasswordScreen}
      />
    </Stack.Navigator>
  );
};

const ScannerStackNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Scanner"
        options={{headerShown: false}}
        component={ScannerScreen}
      />
    </Stack.Navigator>
  );
};

export {
  MainStackNavigator,
  OrderStackNavigator,
  HistoryStackNavigator,
  ProfileStackNavigator,
  ScannerStackNavigator,
};
