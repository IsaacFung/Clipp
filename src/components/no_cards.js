import React from 'react';
import {StyleSheet, Image, Text, View, Dimensions} from 'react-native';

const { width } = Dimensions.get('window');

export default class NoCards extends React.Component {
  render() {
    return <View style={styles.container}>
      <Image
        style={styles.appLogo}
        source={require('../../assets/images/clipp.png')}
      />
      <View style={styles.text_container}>
        <Text>
          No more items! Try uploading a new item!
        </Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogo: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: width / 10
  },
  text_container: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width / 10 * 3
  },
  text: {
    fontSize: 15,
  }
})
