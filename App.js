import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/welcomeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';
import RecieverDetailsScreen from './screens/RecieverDetailsScreen'
export default class App extends React.Component {
  render(){
  return (
    <AppContainer/>
  );}
}
const switchNavigator=createSwitchNavigator({
  WelcomeScreen : {screen : WelcomeScreen},
  Drawer : {screen: AppDrawerNavigator},
  RecieverDetails : {screen:RecieverDetailsScreen}
})
const AppContainer= createAppContainer(switchNavigator);
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
