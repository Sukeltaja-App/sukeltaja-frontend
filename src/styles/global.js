import { StyleSheet } from 'react-native'
import colors from './colors'

export const paddingSides = 21

export default StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: paddingSides,
    paddingRight: paddingSides
  },
  noPadding: {
    flex: 1,
    backgroundColor: colors.background
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50
  },
  row: {
    flexDirection: 'row'
  },
  h5: {
    marginTop: 50,
    fontSize: 18,
    textAlign: 'center'
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#0530fc'
  },
  button: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#50d8ee',
    width: 120,
    height: 40,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 20
  }
})
