import React, {Component} from "react";
import {Alert, Image, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

export default class ImageEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: (this.props.index < this.props.images.length) ? this.props.images[this.props.index] : null,
    };
    console.log(this.props.index, this.props.images.length)
  }


  sendData = () => {
    this.props.callbackFromParent(this.state.image, this.props.index);
  };

  render() {
    console.log(this.state);
    let {image} = this.state;
    console.log("image", image);

    return (
        <View style={styles.container}>
          <StatusBar hidden/>
          <TouchableOpacity onPress={this._pickImage}>
            <Image
                source={
                  image ? {uri: image} : require("../../assets/images/upload_icon.png")
                }
                style={styles.image}
            />
          </TouchableOpacity>
        </View>
    );
  }

  async getCameraRollPermissionAsync() {
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (newPermission.status !== 'granted') {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    } 
  }

  async getCameraPermissionAsync() {
    const permission = await Permissions.getAsync(Permissions.CAMERA);
    if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA);
      if (newPermission.status !== 'granted') {
        alert("Sorry, we need camera permissions to make this work!");
      }
    } 
  }


  _pickImage = async () => {
    console.log(this.state.image);
    Alert.alert('Please Upload An Image', '', [
      {text: 'Take Photo', onPress: this._cameraUpload},
      {text: 'Use Camera Roll', onPress: this._cameraRollUpload},
      {text: 'Cancel', onPress: () => console.log("Cancel")},
    ], {cancelable: false});
  };

  _cameraUpload = async () => {
    if (Constants.platform.ios) {
      this.getCameraPermissionAsync();
      this.getCameraRollPermissionAsync();
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3]
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({image: result.uri});
      this.sendData()
    }
  };

  _cameraRollUpload = async () => {
    if (Constants.platform.ios) {
      this.getCameraRollPermissionAsync();
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3]
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({image: result.uri});
      this.sendData()
    }
  };
}

const styles = StyleSheet.create({
  container: {},
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "stretch",
    borderRadius: 15
  }
});
