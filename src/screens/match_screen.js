import React from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";
import { Button } from "native-base";
import * as Font from "expo-font";
import colors from "../../assets/color";
import Segment from "../../Segment";
import Fire from "../../services/messaging_services";

export default class MatchScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      current_image: this.props.navigation.getParam('current_product'),
      current_item_name: this.props.navigation.getParam('current_product_name'),
      current_item_description: this.props.navigation.getParam('current_product_description'),
      matched_obj: this.props.navigation.getParam('matched_product'),
      name: '',
      chatStarted: false,
    };

    console.log(this.state.matched_obj.data.productName)
    console.log("Current item name", this.state.current_item_name)
    console.log("Current item description", this.state.current_item_description)

    console.log("Current Product:", this.props.navigation.getParam('current_product'))
    console.log("Matched Product" , this.props.navigation.getParam('matched_product'))

  }

  onPressChat = () => {
    Segment.screen('Chat');
    this.props.navigation.navigate('Chat', { name: this.state.name });
  }
  
  startChat(recipient_username, matched_name, item_name, current_item_name, current_item_description){
    console.log("Printing the item name over here man", item_name)
    console.log("Printing all the startChat params", recipient_username + " " + matched_name + " " + item_name + " " +
                                                     current_item_name + " " + current_item_description)
    Fire.start_chat(recipient_username, matched_name, item_name, current_item_name, current_item_description)
    .then(()=>{
      console.log("Starting chat")
    })
    .catch(err=>{
      console.log(err)
    })
  }

  async componentDidMount() {
    console.log("Printing component did mount")
    const { matched_obj, current_image } = this.state;
    console.log(matched_obj.data.username + " " + matched_obj.data.description + " " 
                + this.state.matched_obj.data.productName + " " + this.state.current_item_name + " " 
                + this.state.current_item_description)
    if(!this.state.chatStarted) {
      this.setState({chatStarted: true});
      console.log("Running start chat function", this.state.chatStarted)
      console.log("Print current item name:", this.state.current_item_name)
      this.startChat(matched_obj.data.username, matched_obj.data.description, 
                     this.state.matched_obj.data.productName,
                     this.state.current_item_name, this.state.current_item_description)
    }
  }

/*
  async componentWillMount() {
    console.log(this.state);
  }
*/
  render() {
    const { matched_obj, current_image } = this.state;
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.matchText} numberOfLines={1}>
            It's a match!
          </Text>
          <Text
            style={styles.descriptionText}
          >{`Your item matched with ${matched_obj.data.displayName}'s item.`}</Text>
          <View style={styles.imageGroup}>
            <Image
              source={
                current_image
                  ? { uri: current_image }
                  : require("../../assets/images/app_logo.png")
              }
              style={styles.image}
            />
            <Image
              source={
                matched_obj
                  ? { uri: matched_obj.url }
                  : require("../../assets/images/app_logo.png")
              }
              style={styles.image}
            />
          </View>
          <Button
            block
            style={styles.button}
            //startChat = {() => this.startChat(this.matched_obj.data.username)}
            onPress={() => {
              console.log(matched_obj.data)
              console.log(matched_obj.data.username)
              Segment.screen('Chat')
              this.props.navigation.navigate('Chat', { recipient_username: matched_obj.data.username }); 
            } }
            //onPressChat={() => this.props.navigation.navigate('Chat', this.state.name)}
            //{other_user: this.matched_obj.data.username}
          >
            <Text style={styles.buttonText}>Send Message</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.LIGHT_GREEN_THEME,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "86%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  matchText: {
    fontSize: 62,
    color: colors.WHITE,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 18,
    color: colors.WHITE,
    marginBottom: 60,
  },
  imageGroup: {
    marginBottom: 75,
    display: "flex",
    flexDirection: "row",
  },
  image: {
    width: 150,
    height: 220,
    margin: 15,
    borderRadius: 15,
  },
  button: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.WHITE,
    backgroundColor: colors.LIGHTER_GREEN_THEME,
    height: 70,
  },
  buttonText: {
    color: colors.LIGHT_GREEN_THEME,
    fontWeight: "bold",
    fontSize: 20,
  },
});
