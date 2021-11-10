import React from 'react';
import {View , Text} from 'react-native'
import{createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator=createDrawerNavigator({
    Home : {screen:AppTabNavigator},
    MyDonations:{screen:MyDonationScreen},
    Notifications:{screen:NotificationScreen},
    Settings:{screen:SettingsScreen}
},
{
    contentComponent : CustomSideBarMenu,
},
{
    initialRouteName:'Home'
})