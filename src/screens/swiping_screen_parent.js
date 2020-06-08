'use strict';

import React from 'react';
import {Alert, AsyncStorage, Dimensions, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Icon, Spinner} from 'native-base';
import ImageService from '../../services/image_service';
import SwipeScreenDeck from './swiping_screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firebase from '../../Firebase.js';
import {NavigationEvents} from 'react-navigation';
import colors from '../../assets/color';
import NoCards from '../components/no_cards';
import AuthService from "../../services/auth_service";
import consts from "../../assets/const";
import Segment from '../../Segment';

const {height} = Dimensions.get('window');

var cards = [];
var cards_metadata = [];
export default class SwipeScreenDeckParent extends React.Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            cards: cards,
            cards_metadata: cards_metadata,
            highlight_item_url: null,
            highlight_item_path: null,
            no_more_cards: false,
            highlight_item_name: "",
            product_description: "",
            loading: true,
            chatUpdate: false
        };
        var user = firebase.auth().currentUser;
        var username = user.email;
        console.log('Match page', username);
        this.logoutUser = this.logoutUser.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    async checkChats() {
		try {
			var user = firebase.auth().currentUser;
			var username = user.email;
			username = username.substring(0, username.indexOf('@'));
			var db = firebase.firestore()
			snapshot1 = await db.collection('chatrooms').where('updated', '==', true).where('user1', '==', username).get()
			snapshot2 = await db.collection('chatrooms').where('updated', '==', true).where('user2', '==', username).get()
		
			filteredChats1 = snapshot1.docs.filter((doc) => doc.data().updatedUser !== username)
			filteredChats2 = snapshot2.docs.filter((doc) => doc.data().updatedUser !== username)
	
			if(filteredChats1.length + filteredChats2.length > 0) {
				this.setState({chatUpdate: true})
			}
			else {
				this.setState({chatUpdate: false})
			}
		}
		catch(e) {

		}
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setAsyncItems() {
        if (this.mounted) {
            this.setState({loading: true, cards: [], card_metadata: []});
            AsyncStorage.getItem(consts.HIGHLIGHT_ITEM_URL)
                .then(value => {
                    console.log('image url is: ', value);
                    this.setState({highlight_item_url: value});
                    console.log(this.state.highlight_item_url);
                })
                .catch(err => {
                    Alert.alert('Error trying to read highlight item caught: ', err);
                });

            AsyncStorage.getItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH)
                .then(value => {
                    console.log('item path is : ', value);
                    this.setState({highlight_item_path: value});
                    console.log(this.state.highlight_item_path);
                    this.retrieveTopImagesForCategory('', value);
                })
                .catch(err => {
                    Alert.alert('Error trying to read highlight item caught: ', err);
                });

          AsyncStorage.getItem(consts.HIGHLIGHT_ITEM_NAME, (err, result) => {
            if (result !== null) {
                console.log("Printing the highlight item name: ", result)
              this.setState({highlight_item_name: result});
            }
          })
          AsyncStorage.getItem(consts.description, (err, result) => {
            if (result != null) {
                console.log("Printing the product description: ", result)
                this.setState({product_description: description});
            }
          })
        }
    }

    setNoMoreCards = () => {
        this.setState({loading: true});
    };

  // This function is used to retrieve the top images
    retrieveTopImagesForCategory(category, item_path) {
      this.setState({ cards: [] });
      ImageService.retrieveTopImagesForCategoryMongo(category, item_path)
        .then(uri_obj => {
          console.log(
            'Successfully retrieved all products for ',
            category,
            uri_obj,
          );
          var temp_cards = [];
          var temp_cards_metadata = [];
          if (uri_obj.length == 0){
            this.setState({no_more_cards:true, loading:false});
          }
          uri_obj.forEach(obj => {
            var card = {
              name: obj.data.productName,
              description: obj.data.description,
              image: obj.uris[0],
            };
            var card_metadata = obj;
            temp_cards.push(card);
            temp_cards_metadata.push(card_metadata);
            if (temp_cards.length == uri_obj.length) {
              temp_cards, temp_cards_metadata = this.shuffle(temp_cards, temp_cards_metadata)
              this.setState({
                cards: temp_cards,
                cards_metadata: temp_cards_metadata,
                loading: false,
              });
            }
          });
        })
        .catch(err => {
          Alert.alert('Failed to retrieve all images for product', err);
        });
    }

    shuffle(array1, array2) {
        console.log("shuffling", array1.length);
        var j, array1_x, array2_x, i;
        for (i = array1.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            array1_x = array1[i];
            array2_x = array2[i];

            array1[i] = array1[j];
            array2[i] = array2[j];
            array1[j] = array1_x;
            array2[j] = array2_x
        }
        return array1, array2;
    }

    logoutUser() {
        console.log("Logging out user");
        const {navigation} = this.props;
        AuthService.signout().then(() =>
            navigation.navigate('Land')
        )
    }

    confirmLogOut() {
        Alert.alert(
            'Logout',
            'Are you sure you woud like to log out?',
            [{text: 'Cancel', onPress: () => console.log('Cancel Log out')},
                {
                    text: 'Yes', onPress: () => {
                        this.logoutUser();
                        Alert.alert('You have been logged out')
                    }
                }],
            {cancelable: false}
        );
    }

    navigateToMatch(matched_obj) {
        this.props.navigation.navigate('Match', {
            current_product: this.state.highlight_item_url,
            matched_product: matched_obj,
            current_product_name: this.state.highlight_item_name,
            current_product_description: this.state.product_description
        });
    }

    render() {
        const {highlight_item_url, highlight_item_name} = this.state;
        const {navigation} = this.props;
        let swipe;
        if (this.state.cards.length != 0 && !this.state.loading) {
            swipe = (
                <SwipeScreenDeck
                    navigateToMatch={this.navigateToMatch.bind(this)}
                    callbackFromParent={this.setAsyncItems.bind(this)}
					checkChatsCallback={this.checkChats.bind(this)}
                    cards={this.state.cards}
                    cards_metadata={this.state.cards_metadata}
                    image_path={this.state.highlight_item_path}
                    setNoMoreCards={this.setNoMoreCards}
                navigation={this.props.navigation}/>
            );
        } else {
            if (this.state.highlight_item_url === null || this.state.no_more_cards) {
                swipe = <NoCards/>;
            } else if (this.state.loading) {
                swipe = (
                    <View style={styles.spinner_container}>
                        <Spinner size={'large'}/>
                    </View>
                );
            }
        }
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onDidFocus={() => {if(!navigation.hasOwnProperty('state') ||
               navigation.state === undefined ||
               !navigation.state.hasOwnProperty('params') ||
               navigation.state.params === undefined ||
               !navigation.state.params.hasOwnProperty('do_not_rerender')) {
                        console.log('Rerender swipe page');
                        this.setAsyncItems();}
						this.checkChats();
                    }}
                />
                <StatusBar hidden/>
                <View style={styles.top_bar}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log(navigation);
                            Segment.screen('Messages')
                            navigation.navigate('Messages')

                        }}
                    >
                        <Image
                            style={styles.messages_button}
                            source={this.state.chatUpdate ? require('../../assets/images/messages_icon_alert.png') : require('../../assets/images/messages_icon.png')}
                        />
                    </TouchableOpacity>
                    <View style={styles.text_container}>
                        <Text style={styles.logo_text}>{highlight_item_name}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Segment.screen('Items')
                            navigation.navigate('Items')
                        }}
                    >
                        <Image
                            style={
                                highlight_item_url
                                    ? styles.items_button
                                    : styles.items_button_default
                            }
                            source={
                                highlight_item_url
                                    ? {url: highlight_item_url}
                                    : require('../../assets/images/items-icon.png')
                            }
                        />
                    </TouchableOpacity>
                </View>
                {swipe}
                <Button
                    block
                    style={styles.button}
                    onPress={() => {
                        Segment.screen('GenericFeedback')
                        navigation.navigate('GenericFeedback')
                    }}
                >
                    <Text style={styles.feedbackText}>Feedback</Text>
                </Button>
                <Button
                    light
                    style={styles.logoutButton}
                    onPress={() => this.confirmLogOut()}
                >
                    <Icon style={{fontSize: 35}} name="exit"/>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    swipe_deck_container: {
        position: 'absolute',
        zIndex: 2,
    },
    top_bar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: '5%',
        paddingTop: 30,
        zIndex: 1,
    },
    text_container: {
        paddingTop: 5 
    },
    logo_text: {
        fontSize: 26,
    },
    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        position: 'absolute',
        bottom: 4,
        right: 4
    },
    profile_button: {
        marginTop: 10,
        width: 30,
        height: 30,
    },
    items_button_default: {
        width: 30,
        marginTop: 10,
        height: 30,
    },
    items_button: {
        width: 30,
        height: 30,
        marginTop: 10,
        borderRadius: 15,
    },
    button: {
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.WHITE,
        backgroundColor: colors.DARK_GREEN_THEME,
        height: 70,
        width: '60%',
        marginLeft: '20%',
        shadowOpacity: 0.75,
        shadowColor: 'grey',
        shadowOffset: {height: 0, width: 0},
        zIndex: 1,
        position: 'absolute',
        top: height - (70 + height / 30),
    },
    feedbackText: {
        color: colors.WHITE,
        fontSize: 30,
    },
    spinner_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messages_button: {
        marginTop: 10,
        width: 30,
        height: 30
    },
    backButton: {
        marginLeft: 10,
        fontSize: 30,
        color: colors.WHITE,
    }
});

/*
The profile button
          <TouchableOpacity
            onPress={() => console.log('Profile button pressed')}
          >
            <Image
              style={styles.profile_button}
              source={require('../../assets/images/profile.png')}
            />
          </TouchableOpacity>
*/