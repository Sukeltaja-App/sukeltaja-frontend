import React from 'react'
import { View, FlatList, Text } from 'react-native'
import { CheckBox, Button } from 'react-native-elements'
import styles from '../../styles/global'
import colors from '../../styles/colors'
import { connect } from 'react-redux'
import { loadAllUsers } from '../../reducers/userReducer'
import { sendMessage } from '../../reducers/messageReducer'
import { getOngoingEvent } from '../../reducers/eventReducer'
import { userIsInArray } from '../../utils/userHandler'

const style = {
  divider: {
    height: 10
  },
  buttonGreen: {
    backgroundColor: colors.green,
  },
  top: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10
  }
}

class InviteScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUsers: []
    }
    this.showList = this.showList.bind(this)
  }

  componentDidMount() {
    if(this.props.users.length === 0) this.loadUsers()
  }

  navigate = (value) => this.props.navigation.navigate(value)

  loadUsers = async () => {
    await this.props.loadAllUsers()
  }

  sendInvite = async (type) => {
    const { selectedUsers } = this.state
    const { sendMessage, user, ongoingEvent, getOngoingEvent } = this.props
    const { creator, admins } = ongoingEvent

    if (!selectedUsers || user._id !== creator._id && !userIsInArray(user, admins)) return

    const receivers = selectedUsers.map(receiver => receiver._id)

    await sendMessage(
      type,
      ongoingEvent,
      user._id,
      receivers
    )

    await getOngoingEvent(ongoingEvent)

    this.loadUsers()
  }

  inviteAdmins = () => this.sendInvite('invitation_admin')

  inviteParticipants = () => this.sendInvite('invitation_participant')

  backButton = async () => {
    const { ongoingEvent, getOngoingEvent } = this.props

    await getOngoingEvent(ongoingEvent)
    this.navigate('OngoingEvent')
  }

  toggleUserSelection = (user) => {
    const { selectedUsers } = this.state

    if (!selectedUsers.includes(user)) {
      this.setState({ selectedUsers: [...selectedUsers, user] })
    } else {
      this.setState({ selectedUsers: selectedUsers.filter(u => u._id !== user._id) })
    }
  }

  renderListItem = (user) => {
    const { selectedUsers } = this.state

    return (
      <CheckBox
        title={user.username}
        onPress={() => this.toggleUserSelection(user)}
        checked={selectedUsers.includes(user)}
      />
    )
  }

  showList = () => {
    let { users, ongoingEvent } = this.props

    users = users.filter(c => (c._id !== ongoingEvent.creator._id)
      && !userIsInArray(c, ongoingEvent.admins)
      && !userIsInArray(c, ongoingEvent.participants))

    if (users.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.h5}>Ei käyttäjiä.</Text>
        </View>
      )
    } else {
      return (
        <FlatList
          data={users}
          renderItem={({ item }) => this.renderListItem(item) }
          keyExtractor={item => item._id}
          extraData={this.state}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.noPadding}>

        <View style={style.top}>
          {this.showList()}
        </View>

        <View style={style.bottom}>
          <View style={style.divider}/>
          <Button
            title="+ Kutsu Ylläpitäjiä"
            onPress={this.inviteAdmins}
            buttonStyle={style.buttonGreen}
            raised
          />
          <View style={style.divider}/>
          <Button
            title="+ Kutsu Osallistujia"
            onPress={this.inviteParticipants}
            buttonStyle={style.buttonGreen}
            raised
          />
          <View style={style.divider}/>
          <Button
            title="<-- Takaisin"
            onPress={this.backButton}
            raised
          />
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  ongoingEvent: state.ongoingEvent,
  users: state.users,
  user: state.user
})

export default connect(
  mapStateToProps,
  { sendMessage, loadAllUsers, getOngoingEvent }
)(InviteScreen)
