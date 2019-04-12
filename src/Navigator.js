import React from 'react'
import { createBottomTabNavigator, BottomTabBar, createAppContainer } from 'react-navigation'

import OngoingEventScreen from './components/OngoingEventScreens/OngoingEventScreen'
import MainMapScreen from './components/MapScreens/MainMapScreen'
import EventScreens from './components/EventScreens'
import ProfileScreens from './components/ProfileScreens'

import { Icon } from 'react-native-elements'

import colors from './styles/colors'

const TabBarComponent = (props) => (<BottomTabBar { ...props } />)

const style = {
  activeTintColor: '#fff',
  labelStyle: {
    fontWeight: 'bold'
  }
}

export const MainTabNavigator = createBottomTabNavigator({
  OngoingEvent : {
    screen: OngoingEventScreen,
    navigationOptions: {
      tabBarLabel: 'SUKELLUS',
      tabBarOptions: style,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='anchor' type='feather' color={tintColor} />
      )
    }
  },
  Map : {
    screen: MainMapScreen,
    navigationOptions: {
      tabBarLabel: 'KARTTA',
      tabBarOptions: style,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='map-pin' type='feather' color={tintColor} />
      )
    }
  },
  EventList : {
    screen: EventScreens,
    navigationOptions: {
      tabBarLabel: 'TAPAHTUMAT',
      tabBarOptions: style,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='archive' type='feather' color={tintColor} />
      )
    }
  },
  Profile : {
    screen: ProfileScreens,
    navigationOptions: {
      tabBarLabel: 'KÄYTTÄJÄ',
      tabBarOptions: style,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='user' type='feather' color={tintColor} />
      )
    }
  }
}, {
  tabBarComponent: props => {
    return(
      <TabBarComponent
        {...props}
        style={{ backgroundColor: colors.primary }}
      />
    )
  },
  initialRouteName: 'Profile'
})

const Navigator = createAppContainer(MainTabNavigator)

export default Navigator
