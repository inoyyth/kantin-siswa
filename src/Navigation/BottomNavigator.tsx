import React, {FunctionComponent} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HistoryStackNavigator,
  MainStackNavigator,
  OrderStackNavigator,
  ProfileStackNavigator,
  ScannerStackNavigator,
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
        name="TabScanner"
        component={ScannerStackNavigator}
        options={{
          headerShown: false,
          title: 'Top Up',
          tabBarIcon: (e: any) => (
            <Icon
              type="ant-design"
              name="qrcode"
              color={e.focused ? '#59b300' : e.color}
              size={30}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            textTransform: 'uppercase',
            fontWeight: '500',
            color: '#a3a3c2',
          },
          tabBarStyle: {paddingBottom: 5},
          tabBarIconStyle: {
            height: 40,
            width: 40,
            position: 'absolute',
            top: -13,
            borderWidth: 1,
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
            borderRadius: 10,
            padding: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 3,
          },
          unmountOnBlur: true,
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
