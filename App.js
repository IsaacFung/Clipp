import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LandingScreen from './src/screens/landing_screen'
import LoginScreen from './src/screens/login_screen'
import UploadScreen from './src/screens/upload_screen'
import MatchScreen from './src/screens/match_screen'
import GenericFeedbackScreen from './src/screens/feedback_screen'
import RegistrationScreenName from './src/screens/registration/registration_screen_name.js'
import RegistrationScreenEmail from './src/screens/registration/registration_screen_email'
import RegistrationScreenPassword from './src/screens/registration/registration_screen_password'
import RegistrationScreenPasswordConfirm from './src/screens/registration/registration_screen_password_confirm'
import SwipeScreenDeckParent from './src/screens/swiping_screen_parent'
import ItemsScreen from './src/screens/items_screen'
import EditScreen from './src/screens/edit_screen'
import ChatScreen from './src/screens/chat_screen'
import MessageScreen from './src/screens/messaging_screen'
import ExpandItemScreen from './src/screens/expand_item_screen'

export default class App extends React.Component {
  render () {
    return <AppContainer />
  }
}

const RootStack = createStackNavigator(
  {
    Land: LandingScreen,
    Login: LoginScreen,
    SignupName: RegistrationScreenName,
    SignupEmail: RegistrationScreenEmail,
    SignupPassword: RegistrationScreenPassword,
    SignupPasswordConfirm: RegistrationScreenPasswordConfirm,
    Upload: UploadScreen,
    GenericFeedback: GenericFeedbackScreen,
    Match: MatchScreen,
    Items: ItemsScreen,
    Home: SwipeScreenDeckParent,
    Edit: EditScreen,
    Chat: ChatScreen,
    Messages: MessageScreen,
    Expand: ExpandItemScreen
  },
  {
    initialRouteName: 'Land',
    headerMode: 'none'
  }
)

export const AppContainer = createAppContainer(RootStack)
