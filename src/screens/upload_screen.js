import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import ImageUpload2 from '../components/image_upload';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import ImageService from '../../services/image_service';
import colors from '../../assets/color';
import firebase from '../../Firebase.js';
import { NavigationActions, StackActions } from 'react-navigation';
import { Header, Left, Right, Icon, Spinner } from 'native-base';
import Segment from '../../Segment';
export default class UploadScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      name_input: '',
      description_input: '',
      tags_input: '',
      loading: true,
      images: [],
      existing_product_names: new Set([]),
      existing_products_loaded: false,
      uploading: false,
      shouldAvoidKeyboard: false,
    };
    var user = firebase.auth().currentUser;
    var username = user.email;
    username = username.substring(0, username.indexOf('@'));
    this.retrieveProductNames();
    console.log('Upload username', username);
  }

  callbackFunction = uri => {
    var temp = this.state.images.concat(uri);
    this.setState({ images: temp });
    console.log('temp', this.state.images);
  };

  _highlightItem = async (imagePath, url, name) => {
    try {
      await AsyncStorage.setItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH, imagePath);
      await AsyncStorage.setItem(consts.HIGHLIGHT_ITEM_URL, url);
      await AsyncStorage.setItem(consts.HIGHLIGHT_ITEM_NAME, name);
    } catch (error) {
      Alert.alert(
        `Error trying to highlight titem ${imagePath} with error ${error}`,
      );
    }
  };

  uploadImages() {
    const { navigation } = this.props;
    this.setState({ uploading: true });
    var user = firebase.auth().currentUser;
    var username = user.email;
    var displayName = user.displayName;
    username = username.substring(0, username.indexOf('@'));
    console.log('Upload username', username);

    var product_image_path = 'images/' + username + '/' + this.state.name_input;
    promises = [];
    for (var i = 0; i < this.state.images.length; i++) {
      promises.push(
        ImageService.uploadImage(product_image_path, i, this.state.images[i]),
      );
    }

    categories_parsed = this.state.tags_input.split(',');
    const product_metadata = {
      categories: categories_parsed,
      categoriesInterested: categories_parsed,
      imagePath: product_image_path,
      isSold: false,
      priceHigh: 10,
      priceLow: 0,
      swipedLeft: [],
      swipedRight: [],
      username: username,
      productName: this.state.name_input,
      eloRank: 0,
      description: this.state.description_input,
      displayName: displayName,
      isMatched: false,
    };
    Promise.all(promises)
        .then(()=>{
          console.log('Successfully uploaded an image on Mongo');
          ImageService.uploadMetadataMongo(product_metadata)  
        })
        .then(()=>{
            console.log("Successfully uploaded image metadata")
        })
        .then(()=>{
          console.log("Clearing data")
          this._highlightItem(product_metadata.imagePath, this.state.images[0], product_metadata.productName)
          this.setState({
            name_input: '',
            description_input: '',
            tags_input: '',
            images: [],
            uploading: false,
          },
          () => {
            const { navigation } = this.props;
            const { params } = navigation.state;
            const signup = params ? params.signup === true : null;

            Segment.trackWithProperties('Upload Item', {
              user: {
                displayName: firebase.auth().currentUser.displayName,
                uid: firebase.auth().currentUser.uid,
                email: firebase.auth().currentUser.email
              },
              item: {
                item_name: product_metadata.productName,
                item_image: product_metadata.imagePath,
                item_description: product_metadata.description                
              },
            })

            if (signup) {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Items' })],
              });
              this.props.navigation.dispatch(resetAction);
            } else {
              Segment.screen('Items')
              navigation.navigate('Items');
            }
          },
        );
      })
      .catch(err => {
        Alert.alert('Failed to upload image or metadata', err);
      });
  }

  retrieveProductNames() {
    const allProducts = ImageService.retrieveAllProductsForUserMongo();
    set = new Set([]);
    allProducts.then(result => {
      result.forEach(product => {
        set.add(product.data.productName);
      });
      this.setState({
        existing_product_names: set,
        existing_products_loaded: true,
      });
    });
  }

  // Validates the current input fields, uploads and navigates to home if the user has valid input
  validateAndUpload() {
    const {
      name_input,
      images,
      description_input,
      existing_product_names,
      existing_products_loaded,
    } = this.state;
    if (name_input === null || name_input.length === 0) {
      Alert.alert(
        'Error',
        'Must fill in item name!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } else if (
      images.length - images.filter(obj => obj === null).length ===
      0
    ) {
      Alert.alert(
        'Error',
        'Must upload at least 1 image!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } else if (description_input === null || description_input.length === 0) {
      Alert.alert(
        'Error',
        'Must have a description!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } else if (!existing_products_loaded) {
      setTimeout(this.validateAndUpload, 1000);
    } else if (existing_product_names.has(name_input)) {
      Alert.alert(
        'Error',
        `You can't post another item with the same name!`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } else {
      this.uploadImages();
    }
  }

  // This function is used to display all images for a certain product (tap to change image).
  // The imagePath represents the path to the base directory. All the images will be returned
  // as a list of uris which can be embedded to the image.
  retrieveAllImagesForProduct(imagePath) {
    ImageService.retrieveAllImagesForProduct(imagePath)
      .then(uris => {
        console.log(
          'Successfully retrieved all images for product',
          imagePath,
          uris,
        );
      })
      .catch(() => {
        Alert.alert('Failed to retrieve all images for product', imagePath);
      });
  }

  async componentWillMount() {
    try {
      await Font.loadAsync({
        GothamRoundedLight: require('../../assets/fonts/GothamRoundedLight.otf'),
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const signup = params ? params.signup === true : null;
    let submit_button;
    if (!this.state.uploading) {
      submit_button = (
        <TouchableOpacity
          style={styles.submit_button}
          onPress={() => this.validateAndUpload()}
        >
          <Text style={styles.button_text}>Submit</Text>
        </TouchableOpacity>
      );
    } else {
      submit_button = <Spinner color="#ffffff" />;
    }

    if (this.state.loading) {
      return <Text>Loading</Text>;
    }
    return (
      <KeyboardAvoidingView
        style={{ ...styles.container }}
        behavior="position"
        enabled={this.state.shouldAvoidKeyboard}
      >
        <ScrollView>
          <Header style={styles.header}>
            <Left style={{ marginTop: -15 }}>
              {!signup && (
                <TouchableOpacity onPress={() => {
                  Segment.screen('Items')
                  navigation.pop()
                }}>
                  <Icon name="close" style={styles.backButton} />
                </TouchableOpacity>
              )}
            </Left>
            <Text style={styles.title_text}>Upload Item</Text>
            <Right>
              <Text></Text>
            </Right>
          </Header>
          <Text style={styles.header_text}>Name</Text>
          <TextInput
            placeholder="Item Name"
            style={styles.text_input}
            onChangeText={name_input => this.setState({ name_input })}
            value={this.state.name_input}
            onFocus={() => this.setState({ shouldAvoidKeyboard: false })}
            maxLength={20}
          />
          <View style={styles.image_row}>
            <ImageUpload2 callbackFromParent={this.callbackFunction} />
            <ImageUpload2 callbackFromParent={this.callbackFunction} />
            <ImageUpload2 callbackFromParent={this.callbackFunction} />
          </View>
          <View style={styles.image_row}>
            <ImageUpload2 callbackFromParent={this.callbackFunction} />
            <ImageUpload2 callbackFromParent={this.callbackFunction} />
            <ImageUpload2 callbackFromParent={this.callbackFunction} />
          </View>
          <Text style={styles.header_text}>Description</Text>
          <TextInput
            placeholder="Item Description"
            style={styles.text_input2}
            multiline={true}
            blurOnSubmit={true}
            returnKeyType="done"
            onChangeText={description_input => {
              this.setState({ description_input });
            }}
            value={this.state.description_input}
            onFocus={() => this.setState({ shouldAvoidKeyboard: true })}
          />
          {/* <Text style={styles.header_text}>Tags</Text>
        <TextInput
          placeholder="Item Tags"
          style={styles.text_input2}
          multiline={true}
          onChangeText={tags_input => this.setState({ tags_input })}
          value={this.state.tags_input}
        /> */}
          {submit_button}
        </ScrollView>
      </KeyboardAvoidingView>
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
  image_row: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  title_text: {
    color: colors.WHITE,
    fontSize: 45,
    textAlign: 'center',
  },
  header_text: {
    color: colors.WHITE,
    fontSize: 30,
    marginLeft: 20,
    marginHorizontal: 5,
    marginTop: 20,
    fontFamily: 'GothamRoundedLight',
  },
  text_input: {
    color: colors.WHITE,
    fontSize: 20,
    marginHorizontal: 20,
    height: 50,
    borderWidth: 5,
    borderColor: colors.DARK_GREEN_THEME,
    borderBottomColor: colors.WHITE,
    marginVertical: 20,
    fontFamily: 'GothamRoundedLight',
  },
  text_input2: {
    color: colors.WHITE,
    fontSize: 20,
    marginHorizontal: 20,
    marginVertical: 15,
    height: 150,
    borderWidth: 5,
    borderColor: colors.DARK_GREEN_THEME,
    borderBottomColor: colors.WHITE,
    textAlignVertical: 'top',
    fontFamily: 'GothamRoundedLight',
  },
  submit_button: {
    marginHorizontal: 20,
    height: 60,
    width: 200,
    borderColor: colors.WHITE,
    borderWidth: 3,
    borderRadius: 30,
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    marginVertical: 50,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    shadowOffset: { height: 0, width: 0 },
  },
  button_text: {
    color: colors.DARK_GREEN_THEME,
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 40,
  },
  backButton: {
    marginLeft: 20,
    fontSize: 30,
    color: colors.WHITE,
  },
  header: {
    backgroundColor: colors.DARK_GREEN_THEME,
    height: 90,
    borderBottomWidth: 0,
  },
});
