import React from 'react'

import { AppRegistry } from 'react-native';
import { connect, Provider } from 'react-redux'
import store from './src/store'

import { login } from './src/reducers/userReducer'
import { initializeEvents } from './src/reducers/EventReducer'

import AppEntry from './src/AppEntry'

const mapStateToProps = (state) => {
  return {
    ongoingEvent: state.ongoingEvent,
    events: state.events,
    user: state.user
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  { login, initializeEvents }
)(AppEntry)

const ProviderPackedApp = () => {
  return (
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  )
}

AppRegistry.registerComponent('SukeltajaApp', () => ProviderPackedApp)

export default ProviderPackedApp
