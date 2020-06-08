import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { Button, Icon, Spinner } from 'native-base';
import colors from '../../../assets/color';

export default class RegistrationScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
    // gesturesEnabled: false,
  };

  login() {
    let keys = [consts.HIGHLIGHT_ITEM_IMAGE_PATH, consts.HIGHLIGHT_ITEM_URL, consts.HIGHLIGHT_ITEM_NAME];
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
      this.props.navigation.dispatch(resetAction);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      password_input: '',
      validated: false,
    };
  }

  // A helper function that checks and updates email_input only if input text is password format
  updatePassword = text => {
    if (text.length < 6) {
      this.setState({ validated: false });
    } else {
      this.setState({ password_input: text, validated: true });
    }
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
              placeholder="ENTER YOUR PASSWORD"
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Text style={styles.textInputText}>Password must be at least 6 characters.</Text>
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
              style={styles.okButtonStyle}
              disabled={!this.state.validated}
              onPress={() => {
                const name_input = navigation.getParam('name') || null;
                const email_input = navigation.getParam('email') || null;
                navigation.navigate('SignupPasswordConfirm', {
                  name: name_input,
                  email: email_input.trim(),
                  password: this.state.password_input,
                });
              }}
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
