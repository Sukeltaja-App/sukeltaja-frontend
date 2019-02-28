import React from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { endEvent, mergeOngoingEvent } from '../../reducers/eventReducer'
import { startDive } from '../../reducers/diveReducer'
import locationService from '../../services/location'
import styles from '../../styles/global'
import colors from '../../styles/colors'

const style = {
  buttonEnd: {
    backgroundColor: colors.red,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonDive: {
    backgroundColor: colors.green,
    width: 100,
    height: 100,
    borderRadius: 50,
  }
}

const magic1 = 59.9
const magic2 = 24.9

const OngoingEventScreen = (props) => {

  const navigate = (value) => props.navigation.navigate(value)

  const endEventButton = async () => {
    const { ongoingEvent, selectedTargets } = props
    const length = selectedTargets.length

    if(length > 0) ongoingEvent.target = selectedTargets[length-1].id

    await props.mergeOngoingEvent(ongoingEvent)
    await props.endEvent(ongoingEvent)

    navigate('StartEventScreen')
  }

  const diveButton = async () => {
    const { ongoingEvent } = props

    let dive = {
      event: ongoingEvent.id,
      startdate: new Date(),
      latitude: magic1 + Math.random(),
      longitude: magic2 + Math.random()
    }

    const location = await locationService.getLocationAsync()

    dive.latitude = location.coords.latitude
    dive.longitude = location.coords.longitude

    await props.startDive(dive)
    await props.mergeOngoingEvent(ongoingEvent)

    navigate('DiveScreen')
  }

  return (
    <View style={styles.centered}>
      <Text h1>Meneillään oleva tapahtuma</Text>
      <View style={styles.bottom}>
        <Button title='Lopeta' onPress={() => endEventButton()} buttonStyle={style.buttonEnd} raised />
      </View>
      <View style={styles.bottom}>
        <Button title='Sukella' onPress={() => diveButton()} buttonStyle={style.buttonDive} raised />
      </View>
    </View>
  )
}

const mapStateToProps = (state) => ({
  ongoingEvent: state.ongoingEvent,
  selectedTargets: state.selectedTargets
})

export default connect(
  mapStateToProps,
  { endEvent, startDive, mergeOngoingEvent }
)(OngoingEventScreen)
