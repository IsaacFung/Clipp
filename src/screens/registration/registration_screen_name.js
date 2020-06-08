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
import { Button, Icon } from 'native-base';
import colors from '../../../assets/color';

export default class RegistrationScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
    // gesturesEnabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      name_input: '',
      validated: false,
    };
  }

  // A helper function that checks and updates name_input only if input text is not empty
  updateName = text => {
    if (text.length !== 0) this.setState({ name_input: text, validated: true });
  };

  render() {
    const { navigation } = this.props;
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
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.updateName(text)}
            placeholder="ENTER YOUR NAME"
          />
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
              onPress={() =>
                navigation.navigate('SignupEmail', {
                  name: this.state.name_input,
                })
              }
            >
              <Icon style={{ fontSize: 35 }} name="checkmark" />
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
    color: colors.WHITE,
    backgroundColor: colors.DARK_GREEN_THEME,
    paddingLeft: '10%',
    fontSize: 35,
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
});
