// @flow
import React from 'react';
import {  
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Button, Header, Left, Icon, Right} from 'native-base';
import { Actions, Bubble, GiftedChat } from 'react-native-gifted-chat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MessagingServices from '../../services/messaging_services';
import firebase from '../../Firebase.js'

export default class Chat extends React.Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      recipient_username: props.navigation.state.params.recipient_username,
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    }
    console.log('Chat Constructed')
    console.log(props)
  }

  get user() {
    var user = firebase.auth().currentUser;
    var username = user.email;
    username = username.substring(0, username.indexOf('@'));
    return {
      name: username,
      _id: user.uid,
    };
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    var username = user.email;
    username = username.substring(0, username.indexOf('@'));

    cb = message => {
      console.log(message)
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    };
    console.log("Printing recipient username: ", this.state.recipient_username);
    MessagingServices.getMessages(cb, username, this.state.recipient_username);
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#65CE88',
          }
        }}
      />
    )
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <Header style={styles.header}>
          <Left style={{ marginTop: -20 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Messages')}
              hitSlop = {{top: 80, bottom: 80, left: 100, right: 150}}
            >
              <Icon name="arrow-back" style={styles.backButton} />
            </TouchableOpacity>
          </Left>
          <Text style={styles.title_text}>Chat</Text>
          <Right style={{ marginTop: -20 }}>
            <TouchableOpacity title='More Actions'
              transparent
              onPress={() => {
                Alert.alert(
                  'Complete or cancel this trade?',
                  'Select complete trade to remove both items from the marketplace. Select cancel trade to remove this chat and keep swiping for matches.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Complete trade', onPress: () => console.log("Complete trade")
                    },
                    {
                      text: 'Cancel trade', onPress: () => console.log("Cancel trade")
                    }
                  ],
                  { cancelable: false},
                );
              }}
            >
              <Image 
                style={styles.more_actions}
                source={require('../../assets/images/ellipsis.png')}
              />
            </TouchableOpacity>
          </Right>
      </Header>
      <GiftedChat
        renderBubble={this.renderBubble}
        messages={this.state.messages}
        onSend={messages => {
          console.log('onSend Call: ', messages);
          MessagingServices.sendMessages(messages, this.state.recipient_username);
        }}
        user={this.user}
      />
    </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DARK_GREEN_THEME,
    flex: 1,
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
  header: {
    backgroundColor: colors.DARK_GREEN_THEME,
    height: 90,
    borderBottomWidth: 0,
  },
  title_text: {
    color: colors.WHITE,
    fontSize: 45,
    textAlign: 'center',
  },
  more_actions: {
    marginTop: 10,
    width: 90,
    height: 90
},
});