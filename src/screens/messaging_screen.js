import React from 'react';
import {
  Container,
  Content,
  Header,
  Icon,
  Left,
  Right,
  Spinner,
  Text,
  View,
  List
} from 'native-base';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colors from '../../assets/color';
import MessagingServices from '../../services/messaging_services';
import { NavigationEvents } from 'react-navigation';
import firebase from '../../Firebase';
const { height, width } = Dimensions.get('window');

export default class MessageScreen extends React.Component {
  static navigationOptions = {
    //title: 'Chat',
  };
  constructor(props) {
    super(props);
    this.state = {
      chatsLoading: true,
      dataArray: null,
      fontLoading: true,
      recipient_username: '',
      updatedChats: []
    }
    this.loadChats = this.loadChats.bind(this);
  }

  onPress = () =>
    this.props.navigation.navigate('Chat', { recipient_username: this.state.recipient_username });

  //onChangeText = name => this.setState({ name });

  loadChats = async () => {
    this.setState({
      dataArray: null,
      chatsLoading: true
    });
    const allChats = await MessagingServices.retrieveAllChatsForUser();
 
    console.log("--------------------check here: ")
    console.log(allChats);
    this.setState({
      dataArray: allChats,
      chatsLoading: false,
    });
  }

  async checkChats() {
    var user = firebase.auth().currentUser;
    var username = user.email;
    username = username.substring(0, username.indexOf('@'));

    var db = firebase.firestore()
    snapshot1 = await db.collection('chatrooms').where('updated', '==', true).where('user1', '==', username).get()
    snapshot2 = await db.collection('chatrooms').where('updated', '==', true).where('user2', '==', username).get()

    filteredChats1 = snapshot1.docs.filter((doc) => doc.data().updatedUser !== username)
    filteredChats2 = snapshot2.docs.filter((doc) => doc.data().updatedUser !== username)

    updatedChats = [...filteredChats1, ...filteredChats2].map((doc) => {
      if (doc.data().user1 === username) return doc.data().user2
      if (doc.data().user2 === username) return doc.data().user1
    })
    console.log(updatedChats);
    this.setState({updatedChats})
  }

  componentDidMount() {
    this.loadChats();
  }

  _renderContent = recipient_username => {
    return (
      <View
        style={{
          borderBottomColor: '#D3D3D3',
          borderBottomWidth: 1,
          borderTopColor: '#D3D3D3',
          borderTopWidth: 1,
        }}
      >
        <TouchableOpacity 
          style={{height: height / 8, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            this.props.navigation.navigate('Chat', {
              recipient_username: recipient_username,
            });
          }}
        >
          {this.state.updatedChats.includes(recipient_username) ? <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', position: 'absolute', zIndex: 2, right: width - 30}}></View> : <View></View>}
          <Text
            style={{
              color: 'black',
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {recipient_username + "@umich.edu"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { fontLoading, chatsLoading, dataArray } = this.state;
    console.log(this.state)
    //if (fontLoading) return <Spinner />;
    return (
      <Container>
        <NavigationEvents
          onDidFocus={() => {
            console.log('Rerendering Messaging Screen');
            this.loadChats();
            this.checkChats();
          }}
        />
        <Header style={styles.header}>
          <Left style={{ marginTop: -20 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              hitSlop = {{top: 80, bottom: 80, left: 100, right: 100}}
            >
              <Icon name="arrow-back" style={{ marginLeft: 10, fontSize: 30, color: 'white', marginTop: 20 }} />
            </TouchableOpacity>
          </Left>
          <Text style={styles.title}>Messages</Text>
          <Right style={{ marginTop: -20 }}>
            <Text />
          </Right>
        </Header>
        <Content>
          {chatsLoading ? (
            <Spinner />
          ) : (
            <List
              style={styles.accordion}
              dataArray={dataArray}
              // animation={true}
              // expanded={true}
              renderRow={chat=> this._renderContent(chat)}
            />
          )}
        </Content>
      </Container>
    );
  }
}

const offset = 24;
const styles = StyleSheet.create({
  accordion: { marginTop: 20 },
  accordion_header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  header: {
    backgroundColor: colors.LIGHT_GREEN_THEME,
    height: 90,
  },
  title: {
    color: colors.WHITE,
    fontSize: 40,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  nameInput: {
    height: offset * 2,

    margin: offset,
    paddingHorizontal: offset,
    borderColor: colors.LIGHT_GREEN_THEME,
    borderWidth: 2,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset,
    color: colors.LIGHT_GREEN_THEME
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE
  }
});