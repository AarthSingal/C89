import React from 'react';
import {Image} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookDonateScreen from '../screens/BookDonateScreen';
import BookRequestScreen from '../screens/BookRequestScreen';

export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks : {screen : BookDonateScreen,
    navigationOptions:{
        tabBarIcon : <Image style={{width:20,height:20}} source={require('../assets/request-list.png')}/>,
        tabBarLabel : "Donate Books"
    }},
    BookRequests : {screen : BookRequestScreen,
    navigationOptions:{
        tabBarIcon : <Image style={{width:20,height:20}} source={require('../assets/request-book.png')}/>,
        tabBarLabel : "Book Requests"
    }}
})

