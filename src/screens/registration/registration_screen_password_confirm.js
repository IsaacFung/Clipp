import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  StatusBar,
  Text,
} from 'react-native';
import { Button, Icon, Spinner } from 'native-base';
import AuthService from '../../../services/auth_service';
import { NavigationActions, StackActions } from 'react-navigation';
import colors from '../../../assets/color';
import Segment from '../../../Segment';

export default class RegistrationScreenConfirm extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
    // gesturesEnabled: false,
  };

  login() {
    let keys = [consts.HIGHLIGHT_ITEM_IMAGE_PATH, consts.HIGHLIGHT_ITEM_URL];
    AsyncStorage.multiRemove(keys).then(() => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Upload',
            params: { signup: true },
          }),
        ],
      });
      Segment.screen('Intial Upload');
      this.props.navigation.dispatch(resetAction);
    });
  }

  constructor(props) {
    super(props);
    
    this.state = {
      password_confirm: '',
      validated: false,
      loginLoading: false,
      name_input: '',
      email_input: '',
      password_input: '',
    };
  }

  // A helper function that checks and updates email_input only if input text is password format
  updatePassword = text => {
    const password_input = this.props.navigation.getParam('password') || null;
    if (!this.arrayMatch(text, password_input)) {
      this.setState({ validated: false });
    } else {
      this.setState({ password_confirm: text, validated: true });
    }
  };

  arrayMatch = (arr1, arr2) => {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;
    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    // Otherwise, return true
    return true;
  
  };

  userSignup = () => {
    this.setState({ loginLoading: true });
    const { navigation } = this.props;
    const name_input = navigation.getParam('name') || null;
    const email_input = navigation.getParam('email') || null;
    const password_input = navigation.getParam('password') || null;

    const user_info = {
      name: name_input,
      email: email_input.trim(),
      password: password_input,
    };
    AuthService.signUp(user_info)
      .then((user) => {
        Segment.alias(user.uid)
        Segment.identify(user.uid)
        this.login()
      })
      .catch(err => {
        Alert.alert(err.message || 'User Sign Up Error');
        this.setState({ loginLoading: false, validated: false });
      });
  };

  render() {
    const { navigation } = this.props;
    const { loginLoading } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
          keyboardVerticalOffset={-100}
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
          <View style={{width: '100%'}}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.updatePassword(text)}
              placeholder="CONFIRM YOUR PASSWORD"
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.buttonGroup}>
            <Button
              danger
              style={styles.cancelButtonStyle}
              onPress={() => navigation.navigate('Land')}
            >
              <Icon style={{ fontSize: 35 }} name="close" />
            </Button>
            <Button
              success
              disabled={!this.state.validated}
              style={styles.okButtonStyle}
              onPress={() => this.userSignup()}
            >
              {loginLoading ? (
                <Spinner size="small" color="white" />
              ) : (
                <Icon style={{ fontSize: 35 }} name="checkmark" />
              )}
            </Button>
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
    height: 140,
    width: '100%',
    color: 'white',
    backgroundColor: colors.DARK_GREEN_THEME,
    paddingLeft: '5%',
    fontSize: 25,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: 50,
  },
  cancelButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 180,
  },
  okButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  buttonText: {
    color: colors.WHITE,
    fontWeight: 'bold',
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
    marginBottom: 30,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.DARK_GREEN_THEME,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
  },
  textInputText:{
    marginLeft: '5%',
    marginTop: 10,
    color: 'grey',
  }
});
