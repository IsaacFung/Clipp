import React from 'react';
import {
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import AuthService from '../../services/auth_service';
import { NavigationActions, StackActions } from 'react-navigation';
import { Button, Input, Item, Label, Spinner, Text, Icon } from 'native-base';
import colors from '../../assets/color';
import consts from '../../assets/const';
import * as Segment from 'expo-analytics-segment';
import firebase from 'firebase'

export default class LoginScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
    // gesturesEnabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loginLoading: false,
      emailInput: '',
      passwordInput: '',
    };
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  login(email, password) {
    email = email.trim(); // remove trailing email whitespace when user tries to log in
    const user_info = { email: email, password: password };

    this.setState({ loginLoading: true });
    AuthService.login(user_info)
      .then(user => {
        Segment.identify(user.uid)
        
        this.setState({ loginLoading: false });
        console.log('Logging in user: \n' + user.uid);
        let keys = [consts.HIGHLIGHT_ITEM_IMAGE_PATH, consts.HIGHLIGHT_ITEM_URL, consts.HIGHLIGHT_ITEM_NAME];
        AsyncStorage.multiRemove(keys)
        .then(()=>{
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Items' })],
          });
          Segment.screen('Items')
          this.props.navigation.dispatch(resetAction);
        })
      })
      .catch(err => {
        Alert.alert(
          'Error',
          'Invalid login!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false },
        );
        this.setState({ loginLoading: false });
      });
  }

  forgotPassword() {
    console.log('Forgot password button clicked');
    //TODO: trigger forgot password flow
  }

  render() {
    const { navigation } = this.props;
    const loginLoadingComponent =
      this.state.loginLoading === false ? (
        <Button
          active
          success
          large
          style={styles.submitButton}
          onPress={() =>
            this.login(this.state.emailInput, this.state.passwordInput)
          }
          title="Log In"
        >
          <Text style={styles.submitText}>LOG IN</Text>
        </Button>
      ) : (
        <Spinner size="large" />
      );
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
          keyboardVerticalOffset={70}
        >
          <StatusBar hidden />
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
            style={styles.backButton}
          >
            <Icon name="arrow-back" style={styles.backButtonIcon} />
            {/* <Text style={styles.backButtonText}>Back</Text> */}
          </TouchableOpacity>
          <Image
            style={styles.appLogo}
            source={require('../../assets/images/app_logo.png')}
          />
          <Item floatingLabel style={styles.textInputWrapper}>
            <Label>Email</Label>
            <Input
              style={styles.textInput}
              value={this.state.emailInput}
              onChangeText={emailInput =>
                this.setState({ emailInput: emailInput })
              }
              textContentType="emailAddress"
              blurOnSubmit={false}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                this.passwordTextInput._root.focus();
              }}
            />
          </Item>
          <Item floatingLabel style={styles.textInputWrapper}>
            <Label>Password</Label>
            <Input
              ref={r => (this._passwordID = r)}
              style={styles.textInput}
              value={this.state.passwordInput}
              onChangeText={passwordInput =>
                this.setState({ passwordInput: passwordInput })
              }
              secureTextEntry={true}
              textContentType="password"
              placeholder="Password"
              onSubmitEditing={() =>
                this.login(this.state.emailInput, this.state.passwordInput)
              }
              getRef={input => {
                this.passwordTextInput = input;
              }}
            />
          </Item>
          {loginLoadingComponent}
          <View>
            <Text onPress={() => this.forgotPassword()}>Forgot Password?</Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    margin: 12,
    width: '90%',
  },
  textInputWrapper: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 20,
    marginBottom: 20,
  },
  appLogo: {
    marginTop: 50,
    margin: 'auto',
    height: 144,
    resizeMode: 'center',
  },
  submitButton: {
    margin: 16,
    backgroundColor: colors.DARK_GREEN_THEME,
    borderRadius: 4,
  },
  submitText: {
    color: colors.WHITE,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
  },
  backButtonIcon: {
    marginLeft: 10,
    fontSize: 30,
    color: colors.DARK_GREEN_THEME,
  },
  backButton: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    left: 15,
    top: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonText: {
    color: colors.DARK_GREEN_THEME,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
  },
});
