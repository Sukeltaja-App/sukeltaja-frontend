import React from 'react'
import { View, FlatList } from 'react-native'
import EventEntry from '../simple/EventEntry'
import { connect } from 'react-redux'

class EventListScreen extends React.Component {

  static navigationOptions = {
    header: null ,
  };

  navigate = (value) => this.props.navigation.navigate(value);

  _onPress = () => {}

render() {
  const data = this.props.events
  return (
    <View style={{ flex: 9, backgroundColor: '#eee' }}>
      <View style={{ flex: 0.2, backgroundColor: '#eee'}} />
      <FlatList
        data={data}

        renderItem={({ item }) => (
          <EventEntry
            username={item.user.username}
            startTime={item.startdate}
            endTime={item.enddate}
            content={item.content}
            onPress={this._onPress}
            displayArrow
          />
        )}
        keyExtractor={item  => item.id.toString()}
      />
    </View>
  )
}
}

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

const ConnectedEventListScreen = connect(
  mapStateToProps,
  null
)(EventListScreen)

export default ConnectedEventListScreen