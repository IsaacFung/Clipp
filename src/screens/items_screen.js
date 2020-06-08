import React from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  Accordion,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Right,
  Spinner,
  Text,
  View,
} from 'native-base';
import * as Font from 'expo-font';
import colors from '../../assets/color';
import { Ionicons } from '@expo/vector-icons';
import ImageService from '../../services/image_service';
import consts from '../../assets/const';
import { NavigationEvents } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from '../../Firebase.js';
import Segment from '../../Segment';

export default class ItemsScreen extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true,
      dataArray: null,
      itemsLoading: true,
      highlightedItem: null,
    };
    this.loadProducts = this.loadProducts.bind(this);
    this.deleteItemAndMetadata = this.deleteItemAndMetadata.bind(this);
  }

  _highlightItem = async (imagePath, url, name) => {
    try {
      AsyncStorage.setItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH, imagePath, response => console.log("items_screen.js: highlighted item image path response: " + response));
      AsyncStorage.setItem(consts.HIGHLIGHT_ITEM_URL, url.url, response => console.log("items_screen.js: highlighted item url response: " + response));
      AsyncStorage.setItem(consts.HIGHLIGHT_ITEM_NAME, name.toString(), response => console.log("items_screen.js: highlighted item name response: " + response));
    } catch (error) {
      Alert.alert(
        `Error trying to highlight item ${imagePath} with error:`,
        ` ${error}`,
      );
    }
  };

  _retrieveData = async () => {
    let value;
    try {
      AsyncStorage.getItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH).then(
        val => (value = val),
      );
    } catch (error) {
      // Error retrieving data
      Alert.alert(error.message);
    }
    Alert.alert(value);
    return value;
  };

  loadProducts() {
    this.setState({
      dataArray: null,
      itemsLoading: true,
      highlightedItem: null,
    });

    const allProducts = ImageService.retrieveAllProductsForUserMongo();
    allProducts.then(result => {
      const dataArray = result.map(item => {
        var { data, url } = item;
        if (data.isSold) return;
        Image.prefetch(url);
        const content = data.description;
        return {
          content: content || 'Error',
          title: data.productName || 'Error',
          image: url
            ? { url: url }
            : require('../../assets/images/app_logo.png'),
          imagePath: data.imagePath,
        };
      });

      // Sort the data array to show a more consistent order
      sortedArray = dataArray.sort((a, b) => (a.title > b.title ? 1 : -1));

      AsyncStorage.getItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH).then(val => {
        this.setState({
          highlightedItem: val,
          dataArray: sortedArray,
          itemsLoading: false,
        });
        return;
      });

      // No highlighted item
      this.setState({
        dataArray: sortedArray,
        itemsLoading: false,
      });
    });
  }

  deleteItemAndMetadata(imagePath) {
    console.log('deleting', imagePath);
    ImageService.deleteItemAndMetadataMongo(imagePath)
        .then(product_image_path => {
          console.log('Successfully deleted', product_image_path);
          this.loadProducts();

          Segment.trackWithProperties('Delete Item', {
            user: {
              displayName: firebase.auth().currentUser.displayName,
              uid: firebase.auth().currentUser.uid,
              email: firebase.auth().currentUser.email
            },
            item: product_image_path
          });

          // Clear AsyncStorage if deleted item is previously highlighted
          try {
            AsyncStorage.getItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH).then(val => {
              if (val == product_image_path) {
                AsyncStorage.removeItem(consts.HIGHLIGHT_ITEM_IMAGE_PATH);
                AsyncStorage.removeItem(consts.HIGHLIGHT_ITEM_URL);
                AsyncStorage.removeItem(consts.HIGHLIGHT_ITEM_NAME);
              }
            });
          } catch (error) {
            // Error retrieving data
            Alert.alert(error.message);
          }
      })
      .catch(err => {
        Alert.alert(err);
      });
  }

  componentDidMount() {
    this.loadProducts();
  }

  async componentWillMount() {
    try {
      await Font.loadAsync({
        GothamRoundedLight: require('../../assets/fonts/GothamRoundedLight.otf'),
        ...Ionicons.font,
      });
    } catch (e) {}

    this.setState({ fontLoading: false });
  }

  _renderHeader = (item, expanded) => {
    console.log(item.imagePath, this.state.highlightedItem);
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor:
            item.imagePath === this.state.highlightedItem
              ? 'rgba(255,255,0,0.5)'
              : null,
        }}
      >
        <Text
          style={
            item.imagePath === this.state.highlightedItem
              ? styles.highlightedItemTitle
              : styles.normalItemTitle
          }
        >
          {item.imagePath === this.state.highlightedItem
            ? item.title + ' (Currently Trading) '
            : item.title}
        </Text>
        {expanded ? (
          <Icon style={{ fontSize: 18 }} name="arrow-down" />
        ) : (
          <Icon style={{ fontSize: 18 }} name="arrow-back" />
        )}
      </View>
    );
  };
  _renderContent = item => {
    return (
      <View
        style={{
          borderBottomColor: '#D3D3D3',
          borderBottomWidth: 1,
          borderTopColor: '#D3D3D3',
          borderTopWidth: 1,
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <Text
            style={{
              padding: 10,
              marginLeft: 20,
              marginBottom: 5,
              width: '65%',
              color: 'grey',
            }}
          >
            {item.content}
          </Text>
          <Image
            // Use force-cache method to force the caching for images for a smoother experience
            source={{ ...item.image, cache: 'force-cache' }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.button_group}>
          <Button
            style={styles.button_group_button}
            transparent
            onPress={() => {
              Segment.screen('Edit')
              this.props.navigation.navigate('Edit', {
                image_path: item.imagePath,
              });
            }}
          >
            <Text>Edit info</Text>
          </Button>
          {item.imagePath !== this.state.highlightedItem && (
            <Button
              style={styles.button_group_button}
              transparent
              onPress={() => {
                Alert.alert(
                  'Turn on trade mode for this item?',
                  'Once you turn on trade mode, you will be swiping for the potential trading objects for this item.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',

                      onPress: async () => {
                        this._highlightItem(item.imagePath, item.image, item.title);
                        this.setState({ highlightedItem: item.imagePath });
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }}
            >
              <Text>Trade item</Text>
            </Button>
          )}
          <Button
            style={styles.button_group_button}
            danger
            transparent
            onPress={() => {
              Alert.alert(
                'Delete item?',
                'Once you delete this item, you cannot undo the action.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: async () => {
                      this.deleteItemAndMetadata(item.imagePath);
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
          >
            <Text>Delete item</Text>
          </Button>
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { fontLoading, itemsLoading, dataArray } = this.state;
    if (fontLoading) return <Spinner />;
    return (
      <Container>
        <StatusBar hidden />
        <NavigationEvents
          onDidFocus={() => {
            Segment.screen('Items')
            console.log('Rerendering Items Screen');
            this.loadProducts();
          }}
        />
        <Header style={styles.header}>
          <Left style={{ marginTop: -20 }}>
            <TouchableOpacity
              onPress={() => {
                Segment.screen('Home')
                navigation.navigate('Home')
              }}
              hitSlop={{ top: 80, bottom: 80, left: 100, right: 100 }}
            >
              <Icon name="arrow-back" style={styles.backButton} />
            </TouchableOpacity>
          </Left>
          <Text style={styles.title}>My Items</Text>
          <Right style={{ marginTop: -20 }}>
            <Button
              rounded
              style={styles.uploadButton}
              onPress={() => {
                Segment.screen('Upload');
                navigation.navigate('Upload', {
                  signup: false,
                });
              }}
            >
              <Icon name="add-circle" style={styles.uploadIcon} />
            </Button>
          </Right>
        </Header>
        <Content>
          {itemsLoading ? (
            <Spinner />
          ) : (
            <Accordion
              style={styles.accordion}
              dataArray={dataArray}
              animation={true}
              expanded={true}
              renderHeader={(item, expanded) =>
                this._renderHeader(item, expanded)
              }
              renderContent={item => this._renderContent(item)}
            />
          )}
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.LIGHT_GREEN_THEME,
    height: 90,
  },
  title: {
    color: colors.WHITE,
    fontSize: 40,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  accordion: { marginTop: 20 },
  accordion_header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  accordion_content: { marginLeft: -5 },
  button_group: {
    display: 'flex',
    flexDirection: 'row',
  },
  button_group_button: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  uploadButton: {
    marginRight: -10,
    marginTop: -10,
    height: 50,
    backgroundColor: 'transparent',
  },
  uploadIcon: {
    fontSize: 40,
    color: colors.WHITE,
  },
  normalItemTitle: { fontWeight: 'bold', fontSize: 25 },
  highlightedItemTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: colors.BLUE_FONT,
    fontStyle: 'italic',
  },
  backButton: {
    marginLeft: 10,
    fontSize: 30,
    color: colors.WHITE,
  },
});
