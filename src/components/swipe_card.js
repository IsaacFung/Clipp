import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../assets/color';

const { height } = Dimensions.get('window');

const Card = ({ image, description, name }) => {
  return (
    <View style={styles.card}>
      <Image style={styles.thumbnail} source={{ uri: image }} />
      <LinearGradient 
        style={styles.gradient}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)']}
      >
        <Text style={styles.text}>{name}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1,
    borderRadius: 15,
    height: height / 1.5,
    zIndex: 0,
  },
  thumbnail: {
    height: height / 1.5,
    width: '100%',
    zIndex: 1,
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    top: height / 1.5 - 70,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    borderRadius: 10,
  },
  text: {
    fontSize: 30,
    top: 25,
    bottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    zIndex: 3,
    opacity: 1,
  },
});

export default Card;
