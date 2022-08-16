import React, {FunctionComponent} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HistoryStackNavigator,
  MainStackNavigator,
  OrderStackNavigator,
  ProfileStackNavigator,
} from './StackNavigator';
import {Icon} from '@rneui/themed';

const Tab = createBottomTabNavigator();

const BottomNavigator: FunctionComponent = () => {
  return (
    <Tab.Navigator initialRouteName="TabMain">
      <Tab.Screen
        name="TabMain"
        component={MainStackNavigator}
        options={{
          headerShown: false,
          title: 'Warung',
          tabBarIcon: (e: any) => {
            return (
              <Icon
                name="store"
                type="font-awesome-5"
                color={e.focused ? '#00a1e9' : e.color}
                size={25}
              />
            );
          },
          tabBarLabelStyle: {
            fontSize: 10,
            textTransform: 'uppercase',
            fontWeight: '500',
            color: '#a3a3c2',
          },
          tabBarStyle: {paddingBottom: 5},
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="TabOrder"
        component={OrderStackNavigator}
        options={{
          headerShown: false,
          title: 'Order',
          tabBarIcon: (e: any) => {
            return (
              <Icon
                name="shopping-cart"
                type="font-awesome"
                color={e.focused ? '#00a1e9' : e.color}
                size={25}
              />
            );
          },
          tabBarLabelStyle: {
            fontSize: 10,
            textTransform: 'uppercase',
            fontWeight: '500',
            color: '#a3a3c2',
          },
          tabBarStyle: {paddingBottom: 5},
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="TabHistory"
        component={HistoryStackNavigator}
        options={{
          headerShown: false,
          title: 'History',
          tabBarIcon: (e: any) => {
            return (
              <Icon
                name="newspaper-outline"
                type="ionicon"
                color={e.focused ? '#00a1e9' : e.color}
                size={25}
              />
            );
          },
          tabBarLabelStyle: {
            fontSize: 10,
            textTransform: 'uppercase',
            fontWeight: '500',
            color: '#a3a3c2',
          },
          tabBarStyle: {paddingBottom: 5},
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="TabProfile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: (e: any) => {
            return (
              <Icon
                name="face-woman"
                type="material-community"
                color={e.focused ? '#00a1e9' : e.color}
                size={25}
              />
            );
          },
          tabBarLabelStyle: {
            fontSize: 10,
            textTransform: 'uppercase',
            fontWeight: '500',
            color: '#a3a3c2',
          },
          tabBarStyle: {paddingBottom: 5},
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
