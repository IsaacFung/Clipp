import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import ImageEdit from '../components/image_edit';
import { TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import ImageService from '../../services/image_service';
import colors from '../../assets/color';
import firebase from '../../Firebase.js'
import {Spinner} from 'native-base';
import { Header, Left, Right, Icon } from 'native-base'
import Segment from '../../Segment';


export default class EditScreen extends React.Component {
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
          image_path: '',
          username: '',
          product_data: {},
          displayName:'',
          categories:''
      };
  }

  componentDidMount(){
      this.getImagesAndMetadata()
  }

  callbackFunction(uri, index){
      var temp = this.state.images;
      
      if (this.state.images.length <= index){
          temp = this.state.images.concat(uri)
      }
      else{
          temp[index] = uri
      }
      this.setState({ images: temp });
      console.log('temp', this.state.images);
    };

  getImagesAndMetadata(){
      var user = firebase.auth().currentUser
      var username = user.email
      var displayName = user.displayName
      username = username.substring(0, username.indexOf('@'));

      console.log("Edit username", username)
      this.setState({username: username})
      this.setState({displayName: displayName})
      this.setState({image_path:this.props.navigation.getParam('image_path')})
      
      image_path = this.props.navigation.getParam('image_path')
      console.log("Retrieving all images for item", image_path)

      ImageService.retrieveAllImagesForProduct(image_path)
      .then(uris=>{
          console.log(uris)
          this.setState({images:uris.sort()})
      })
      .then(()=>{
        ImageService.retrieveMetadataForObjectMongo(image_path)
        .then(metadata=>{
          this.setState({product_data: metadata})
          var temp = ""
          for (category in metadata.categories){
              temp += category
              temp += " "
          }
          this.setState({tags_input: temp})
          this.setState({name_input: this.state.product_data.productName})
          this.setState({description_input: this.state.product_data.description})
        
        })
      })
      .then(()=>{
          this.setState({ loading: false });
      })
  }

  updateData() {
    username = this.state.username
    displayName = this.state.displayName
    var oldPath = this.state.product_data.imagePath
    var product_image_path = this.state.product_data.imagePath
    promises = []
    if (this.state.product_data.productName != this.state.name_input){
        console.log("needs to delete and then upload")
        product_image_path = 'images/' + username + '/' + this.state.name_input
        promises.push(ImageService.deleteImagesOfItem(this.state.product_data.imagePath))
    }

    for (var i = 0; i < this.state.images.length; i++) {
        console.log(product_image_path)
        promises.push(ImageService.uploadImage(product_image_path, i, this.state.images[i]))
        console.log("finishing uploading")
    }

    categories_parsed = this.state.tags_input.split(',')
    var product_metadata = this.state.product_data 
    product_metadata.categories = categories_parsed
    product_metadata.categoriesInterested = categories_parsed
    product_metadata.productName = this.state.name_input
    product_metadata.description = this.state.description_input

    Promise.all(promises)
    .then(() => {
        console.log('Successfully updated an image ');
        ImageService.updateDataMongo(oldPath, product_metadata)            
    })
    .then(()=>{
        console.log("Successfully updated image metadata")
    })
    .catch(err => {
        Alert.alert('Failed to update image or metadata', err);
    });
  }

  validateandUpdate() {
    const { name_input, description_input, images } = this.state;
    const { navigation } = this.props;

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
    }
    else {
      this.updateData();
      Segment.screen('Items')
      navigation.pop();
    }
  }

  async componentWillMount() {
      try {
      await Font.loadAsync({
          GothamRoundedLight: require('../../assets/fonts/GothamRoundedLight.otf'),
      });
      } catch (e) {}

      console.log(this.state);
  }

  render() {
    const {navigation} = this.props;
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <ScrollView style={styles.container}>
        <Header style={styles.header}>
          <Left style={{ marginTop: -15 }}>
            <TouchableOpacity
              onPress={() => {
                Segment.screen('Items')
                navigation.pop();
              }}
            >
              <Icon name="arrow-back" style={styles.backButton} />
            </TouchableOpacity>
          </Left>
          <Text style={styles.title_text}>Update Item</Text>
          <Right>
            <Text></Text>
          </Right>
        </Header>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Error',
              `You can't change the item name!`,
              [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
              { cancelable: false },
            );
          }}
        >
          <Text style={styles.header_text}>Name</Text>
          <TextInput
            placeholder={this.state.product_data.productName}
            style={styles.text_input}
            onChangeText={name_input => this.setState({ name_input })}
            value={this.state.name_input}
            editable={false}
            selectTextOnFocus={false}
          />
        </TouchableOpacity>
        <View style={styles.image_row}>
          <ImageEdit images={this.state.images} index={0} callbackFromParent={this.callbackFunction.bind(this)} />
          <ImageEdit images={this.state.images} index={1} callbackFromParent={this.callbackFunction.bind(this)} />
          <ImageEdit images={this.state.images} index={2} callbackFromParent={this.callbackFunction.bind(this)} />
        </View>
        <View style={styles.image_row}>
          <ImageEdit images={this.state.images} index={3} callbackFromParent={this.callbackFunction.bind(this)} />
          <ImageEdit images={this.state.images} index={4} callbackFromParent={this.callbackFunction.bind(this)} />
          <ImageEdit images={this.state.images} index={5} callbackFromParent={this.callbackFunction.bind(this)} />
        </View>
        <Text style={styles.header_text}>Description</Text>
        <TextInput
          placeholder={this.state.product_data.description}
          style={styles.text_input2}
          multiline={true}
          onChangeText={description_input =>
              this.setState({ description_input })
          }
          value={this.state.description_input}
        />
        {/* <Text style={styles.header_text}>Tags</Text>
        <TextInput
        placeholder={this.state.tags_input}
        style={styles.text_input2}
        multiline={true}
        onChangeText={tags_input => this.setState({ tags_input })}
        value={this.state.tags_input}
        /> */}
        <TouchableOpacity
          style={styles.submit_button}
          onPress={() => this.validateandUpdate()}
        >
          <Text style={styles.button_text}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginLeft: 10,
    fontSize: 30,
    color: colors.WHITE,
  },
  header: {
    backgroundColor: colors.DARK_GREEN_THEME,
    height: 90,
    borderBottomWidth: 0,
  },
});
