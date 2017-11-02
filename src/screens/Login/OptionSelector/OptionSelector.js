/* @flow */
import React from 'react'
import { Text } from '@components'
import strings from './strings'
import screenLayout from '../../screenLayout'
import LoginScreenLayout from '../LoginScreenLayout'

@screenLayout(LoginScreenLayout)
export default class OptionSelector extends React.Component {
  static screenOptions = {
    title: 'Login',
    subtitle: 'Select login options:'
  }

  static navigatorStyle = {
    animated: false,
    animationType: 'fade'
  }

  render () {
    return (
      <Text>{strings.selectOption}</Text>
    )
  }
}
