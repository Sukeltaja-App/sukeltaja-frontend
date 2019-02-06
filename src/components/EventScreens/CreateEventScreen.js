import React from 'react'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import t from 'tcomb-form-native'

import { createEvent, endEvent, updateEvent } from '../../reducers/eventReducer'
import styles from '../../styles/global'

const stylesLocal = StyleSheet.create({
  roundButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    width: 175,
    height: 70,
    borderRadius: 150
  }
})

const Form = t.form.Form

const Event = t.struct({
  content:t.String,
  startdate:t.Date,
  enddate:t.Date,
})

const options = {
  fields: {
    content: {
      label: 'Kuvaus'
    },
    startdate: {
      label: 'Aloitus aika',
      mode: 'datetime'
    },
    enddate: {
      label: 'Lopetus aika',
      mode: 'datetime'
    }
  }
}

class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props)
    this.createValue = {
      content: '',
      startdate: new Date(),
      enddate: new Date()
    }
  }

  navigate = (value) => this.props.navigation.navigate(value)

  createButton = async () => {
    let event = await this.props.createEvent(this.createValue)

    event.content = this.createValue.content
    event.startdate = this.createValue.startdate
    event.enddate = this.createValue.enddate

    await this.props.updateEvent(event)
    this.navigate('EventListScreen')
  }

  render() {
    const reference = 'form'

    return (
      <ScrollView>

        <Text style={styles.h1}>
          Lisää tapahtuma
        </Text>

        <Form
          ref={reference}
          type={Event}
          options={options}
          value={this.createValue}
          onChange={(value) => this.createValue = value} />

        <TouchableOpacity onPress={this.createButton} style={stylesLocal.roundButton} >
          <Text style={styles.buttonText}>Lisää</Text>
        </TouchableOpacity>

      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    ongoingEvent: state.ongoingEvent
  }
}

const ConnectedCreateEventScreen = connect(
  mapStateToProps,
  { createEvent, endEvent, updateEvent }
)(CreateEventScreen)

export default ConnectedCreateEventScreen
