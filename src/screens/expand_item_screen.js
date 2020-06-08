import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import colors from '../../assets/color';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon, Spinner } from 'native-base';
import Segment from '../../Segment';
const { height, width } = Dimensions.get('window');

export default class extends React.Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);
    console.log(props);
    const { productName, description, uris } = props.navigation.state.params;
    this.state = {
      name: productName,
      description,
      images: uris,
    };
    // this.state = {name: null, description: null, images: []}
    // console.log(this.state);
    // setTimeout(this.loaditem, 100);
  }

  render() {
    const { navigation } = this.props;
    console.log('nav object in render $$$');
    console.log(navigation);
    if (
      this.state.name === null ||
      this.state.description === null ||
      this.state.images === []
    ) {
      return (
        <View style={styles.spinner_container}>
          <Spinner />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.top_bar}>
          <TouchableOpacity
            onPress={() => {
              Segment.screen('Home');
              navigation.navigate('Home', { do_not_rerender: true });
            }}
          >
            <Icon name="close" style={styles.backButtonIcon} />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/home_clipp.png')}
            style={styles.clipp}
          />
          <Icon name="close" style={{ color: '#FFFFFF', marginRight: 10 }} />
        </View>
        <Swiper
          style={styles.wrapper}
          height={width}
          onMomentumScrollEnd={(e, state, context) =>
            console.log('index:', state.index)
          }
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={{
            marginTop: height / 10,
            bottom: -height / 15,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          loop
        >
          {this.state.images.map(image_uri => {
            return (
              <View style={styles.slide} key={image_uri}>
                <Image style={styles.image} source={{ uri: image_uri }} />
              </View>
            );
          })}
        </Swiper>
        <Text style={styles.item_name}>{this.state.name}</Text>
        <Text style={styles.item_description}>{this.state.description}</Text>
      </ScrollView>
    );
  }

  // Leaving this here for ease of testing in the future, currently not used
  loaditem = async () => {
    this.setState({
      name: `Hitchhiker's Guide to the Galaxy`,
      description:
        '“For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man—for precisely the same reasons.”',
      images: [
        'https://upload.wikimedia.org/wikipedia/en/b/bd/H2G2_UK_front_cover.jpg',
        'https://upload.wikimedia.org/wikipedia/en/2/24/Ultimate_Hitchhikers_Guide_front.jpg',
        'https://upload.wikimedia.org/wikipedia/en/5/51/H2G2_first_comic_front_cover.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Answer_to_Life_42.svg/330px-Answer_to_Life_42.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Towelday-Innsbruck.jpg/330px-Towelday-Innsbruck.jpg',
      ],
    });
  };
}

const styles = StyleSheet.create({
  spinner_container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  container: {
    flex: 1,
  },

  top_bar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingTop: 30,
    marginBottom: 30,
    flex: 1,
  },

  backButtonIcon: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 30,
    color: colors.DARK_GREEN_THEME,
  },

  clipp: {
    height: 40,
    width: 112,
  },

  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    marginBottom: 7,
  },

  activeDot: {
    backgroundColor: colors.DARK_GREEN_THEME,
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    marginBottom: 7,
  },

  image: {
    width: width * 0.8,
    height: width,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    resizeMode: 'stretch',
  },

  item_name: {
    marginTop: height / 15,
    marginBottom: height / 20,
    marginHorizontal: width * 0.1,
    fontSize: 40,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'black',
  },

  item_description: {
    fontSize: 15,
    alignSelf: 'center',
    marginHorizontal: width * 0.1,
  },
});
