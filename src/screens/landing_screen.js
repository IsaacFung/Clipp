import React from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import colors from '../../assets/color.js';
import {Button} from "native-base";
import Segment from '../../Segment';
const {width} = Dimensions.get('window');

export default class LandingScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.renderLoginScreen = this.renderLoginScreen.bind(this);
    this.renderRegistrationScreen = this.renderRegistrationScreen.bind(this);
  }

  renderLoginScreen() {
    this.props.navigation.navigate('Login');
  }

  renderRegistrationScreen() {
    this.props.navigation.navigate('SignupName');
  }

  render() {
    return (
        <View style={styles.container}>
          <StatusBar hidden/>
          <Image
              style={styles.appLogo}
              source={require('../../assets/images/app_logo.png')}
          />
          <Button
              active
              success
              large
              style={styles.navButton}
              onPress={() => this.renderLoginScreen()}
              title="Log In"
          >
            <Text style={styles.navText}>Log In</Text>
          </Button>
          <Button
              active
              success
              large
              style={styles.navButton}
              onPress={() => this.renderRegistrationScreen()}
              title="Sign Up"
          >
            <Text style={styles.navText}>Sign Up</Text>
          </Button>
        </View>
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
  appLogo: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: width / 1.3,
    marginBottom: -30,
  },
  navButton: {
    paddingRight: 16,
    paddingLeft: 16,
    marginBottom: 30,
    backgroundColor: colors.DARK_GREEN_THEME,
    borderRadius: 4,
  },
  navText: {
    color: colors.WHITE,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
  },
});
