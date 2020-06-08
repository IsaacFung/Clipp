import React from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {Button, Container, Content, Header, Icon, Left, Right, Spinner, Text, Textarea} from 'native-base';
import FirestoreService from '../../services/firestore_service';
import colors from "../../assets/color";
import Segment from '../../Segment';

export default class GenericFeedbackScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      feedbackInput: '',
      submitLoading: false,
    };
    this.sendFeedback = this.sendFeedback.bind(this);
  }

  sendFeedback(feedbackText) {
    if (!feedbackText) {
      return;
    }
    this.setState({submitLoading: true});
    console.log(feedbackText);
    FirestoreService.sendFeedback(feedbackText)
        .then(() => {
          console.log('Feedback submitted, returning to previous page.');
          this.setState({submitLoading: false});
          Segment.screen('Home')
          this.props.navigation.goBack();
        })
        .catch(err => {
          Alert.alert("Error sending feedback", err);
          this.setState({submitLoading: false});
        });
  }

  render() {
    const {navigation} = this.props;
    const feedbackLoadingComponent =
        this.state.submitLoading === false ? (
            <Button
                active
                success
                large
                style={styles.submitButton}
                onPress={() => this.sendFeedback(this.state.feedbackInput)}
                title="Submit"
            >
              <Text style={styles.submitText}>Submit</Text>
            </Button>
        ) : (
            <Spinner size="large"/>
        );
    return (
        <Container>
          <Header style={styles.header}>
            <Left style={{marginTop: -20}}>
              <TouchableOpacity
                  onPress={() => {
                    Segment.screen('Home')
                    navigation.pop();
                  }}
              >
                <Icon name="arrow-back" style={styles.backButton}/>
              </TouchableOpacity>
            </Left>
            <Text style={styles.headerTitle}>Feedback</Text>
            <Right style={{marginTop: -20}}>
              <Text/>
            </Right>
          </Header>
          <Content>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <KeyboardAvoidingView
                  style={styles.container}
                  behavior="padding"
                  enabled
              >

                <Image
                    style={styles.appLogo}
                    source={require('../../assets/images/app_logo.png')}
                />
                <View>
                  <Text style={styles.titleText}>
                    Please leave some feedback for the app. We appreciate any comments
                    or suggestions to help us improve your experience!
                  </Text>
                </View>
                <Textarea
                    rowSpan={5}
                    bordered
                    placeholder="Please leave some feedback..."
                    style={styles.textInputWrapper}
                    value={this.state.feedbackInput}
                    onChangeText={feedbackInput =>
                        this.setState({feedbackInput: feedbackInput})
                    }
                    textContentType="none"
                />
                {feedbackLoadingComponent}
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  textInput: {
    height: 200,
    width: '90%',
  },
  textInputWrapper: {
    marginTop: 16,
    marginBottom: 16,
    marginRight: 8,
    width: '90%',
  },
  appLogo: {
    margin: 'auto',
    height: 144,
    resizeMode: 'center',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
  },
  header: {
    backgroundColor: colors.LIGHT_GREEN_THEME,
    height: 90,
  },
  backButton: {
    marginLeft: 10,
    fontSize: 30,
    color: colors.WHITE,
  },
  headerTitle: {
    color: colors.WHITE,
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
