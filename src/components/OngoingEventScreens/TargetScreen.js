import React from 'react'
import { KYPPI_URL } from 'react-native-dotenv'
import { View, Text, FlatList, Linking } from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import styles from '../../styles/global'
import colors from '../../styles/colors'
import locationService from '../../services/location'
import { getAll, resetTargets } from '../../reducers/targetReducer'

const style = {
  buttonEnd: {
    ...styles.roundButton,
    backgroundColor: colors.red,
  },
  buttonInvite: {
    backgroundColor: colors.green
  },
  main: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
}

const magicNumber = 180

Number.prototype.toRad = function () {
  return this * Math.PI / magicNumber
}

class TargetScreen extends React.Component {
  constructor(props) {
    super(props)
    this.renderListItem = this.renderListItem.bind(this)
    this.state = {
      location: {
        coords: {
          latitude: null,
          longitude: null
        }
      },
      closestTargets: []
    }
  }
  componentDidMount() {
    this.updateLocation()
    this.loadTargets()
    if (this.state.location.coords.latitude && this.state.location.coords.longitude) {
      this.getClosestTargets()
    }

  }

  loadTargets = async () => {
    await this.props.getAll()
    this.forceUpdate()
  }

  navigate = (value, target) => this.props.navigation.navigate(value, { target })

  getDistance = (lat1, lon1) => {
    if (!this.state.location.coords.latitude || !this.state.location.coords.longitude) {
      this.updateLocation()
    }
    const location = this.state.location
    const lat2 = location.coords.latitude
    const lon2 = location.coords.longitude
    var R = 6371 // km
    var x1 = lat2 - lat1
    var dLat = x1.toRad()
    var x2 = lon2 - lon1
    var dLon = x2.toRad()
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c

    return d * 1000
  }

  updateLocation = async () => {
    console.log('Updating location, OLD: ' + this.state.location.coords.latitude)
    let location = await locationService.getLocationAsync()

    this.setState({ location })
    this.forceUpdate()

    console.log('New location: ' + this.state.location.coords.latitude)
  }

  getClosestTargets = async () => {
    console.log('Getting closest targets ------------')

    const { targets } = this.props

    for (let i = 0; i < targets.length; i++) {
      targets[i].distance = this.getDistance(targets[i].latitude, targets[i].longitude)
    }

    targets.sort(function (a, b) {
      return a.distance - b.distance
    })
    let closestTargets = targets.slice(0, 5)

    this.setState({ closestTargets })
    this.forceUpdate()
    this.render()
  }

  reset = () => {
    this.props.resetTargets()
    this.render()
  }

  renderListItem = (item) => {
    const distance = this.getDistance(item.latitude, item.longitude).toFixed(0)

    const target = {
      item,
      distance
    }
    var distanceString

    if (distance > 999) {
      distanceString = `${(distance / 1000).toFixed(1)} kilometriä`
    } else {
      distanceString = `${distance} metriä`
    }

    return (
      <ListItem
        title={<Text style={style.title}>{item.name}</Text>}
        subtitle={`Etäisyys: ${distanceString}`}
        onPress={() => this.navigate('SingleTargetScreen', target)}
        rightIcon={{ type: 'feather', name: 'chevron-right' }}
        bottomDivider
      />
    )
  }

  render() {
    const { currentTarget } = this.props
    const closestTargets = this.state.closestTargets

    if (!currentTarget) {
      return (
        <View>
          <Button
            title='Päivitä lähimmät kohteet'
            onPress={() => this.getClosestTargets()}
            buttonStyle={{ backgroundColor: colors.success, marginTop: 8 }}
          />

          <FlatList
            data={closestTargets}
            renderItem={({ item }) =>
              this.renderListItem(item)
            }
            keyExtractor={item => item.id}
          />
        </View>

      )
    }
    const { latitude, longitude, name, type, material, mj_id } = currentTarget
    const distance = this.getDistance(latitude, longitude).toFixed(0)

    return (
      <View style={styles.noPadding}>
        {this.state.location.coords.latitude
          && <View style={style.container}>

            <Text style={style.title}>{name}</Text>
            <Text style={style.text}>Etäisyys kohteeseen: {distance} metriä</Text>
            <Text style={style.text}>Kohteen tyyppi: {type}</Text>
            <Text style={style.text}>Kohteen materiaali: {material}</Text>
            <Button
              title='MJ-rekisteri'
              onPress={() => { Linking.openURL(`${KYPPI_URL}${mj_id}`) }}
              buttonStyle={{ marginTop: 8 }}
            />

            <Button
              title='Poista kohteen valinta'
              onPress={() => this.reset()}
              buttonStyle={{ backgroundColor: colors.warning, marginTop: 8 }}

            />

          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  currentTarget: state.ongoingEvent && state.ongoingEvent.target ? state.ongoingEvent.target : null,
  targets: state.targets,
  closestTargets: state.closestTargets
})

export default connect(
  mapStateToProps,
  { getAll, resetTargets }
)(TargetScreen)
