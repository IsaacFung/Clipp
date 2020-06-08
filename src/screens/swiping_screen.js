'use strict';

import React from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import Card from '../components/swipe_card';
import Swiper from 'react-native-deck-swiper';
import ImageService from '../../services/image_service';
import OverlayLabel from '../components/overlay_label';
import colors from '../../assets/color';
import firebase from '../../Firebase';
import Segment from '../../Segment';

const { height, width } = Dimensions.get('window');

export default class SwipeScreenDeck extends React.Component {
  constructor(props) {
    super(props);
  }

  updateSwipe(product_image_path, swiped_product_image_path, right, index){
    console.log("Starting updating and match service")
    ImageService.updateSwipeMongo(product_image_path, swiped_product_image_path, right)
    .then(()=>{
      if (right){
        console.log("Checking match with", swiped_product_image_path)
        ImageService.checkMatchMongo(product_image_path, swiped_product_image_path)
        .then(obj=>{
          if (obj == null){
            console.log("Not a match! Try Again.")
            if (index == this.props.cards.length-1){
              this.props.callbackFromParent("", this.props.image_path)
              this.props.checkChatsCallback()
            }
          }
          else{ 
            console.log("Congrats! Found match", obj)
            ImageService.updateMatchMongo(product_image_path)
            .then(()=>{
              ImageService.updateMatchMongo(swiped_product_image_path)
              .then(()=>{
                this.segment_track_swipe('Match', index);
                this.props.navigateToMatch(obj)
              })
            })
          }
        })      
      }
      else{
        console.log("ok im out")
        if (index == this.props.cards.length-1){
          console.log("getting new updates")
          this.props.callbackFromParent("", this.props.image_path)
          this.props.checkChatsCallback();
        }
      }
    })
    .catch(err =>{
      Alert.alert("Failed to update swipe.", err )
    })
  }

  renderExtendCard(card_idx) {
    const {
      productName,
      description,
      priceHigh,
      priceLow,
      displayName,
    } = this.props.cards_metadata[card_idx].data;
    const { uris } = this.props.cards_metadata[card_idx];

    Segment.screen('Expand');
    this.props.navigation.navigate('Expand', {
      productName,
      description,
      priceHigh,
      priceLow,
      displayName,
      uris,
    });
  }

  segment_track_swipe(event, cardIndex) {
    Segment.trackWithProperties(event, {
      user: {
        displayName: firebase.auth().currentUser.displayName,
        uid: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email
      },
      tradingItem: {
        item_image: this.props.image_path,
      },
      swipedItem: {
        item_description: this.props.cards[cardIndex].description,
        item_image: this.props.cards[cardIndex].image,
        item_name: this.props.cards[cardIndex].name,
        username: this.props.cards_metadata[0].data.username,
        displayName: this.props.cards_metadata[0].data.displayName,
      }
    })
  }

  render() {
    return (
      <View style={styles.swipe_deck_container}>
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          cards={this.props.cards}
          renderCard={Card}
          onSwipedAll={() => {
            this.props.setNoMoreCards();
          }}
          cardIndex={0}
          backgroundColor={'white'}
          stackSize={3}
          showSecondCard
          useViewOverflow
          disableTopSwipe
          disableBottomSwipe
          onSwipedRight={cardIndex => {
            console.log(`Right Swipe ID: ${cardIndex}`);
            this.updateSwipe(
              this.props.image_path,
              this.props.cards_metadata[cardIndex].data.imagePath,
              true,
              cardIndex,
            );
            this.segment_track_swipe('Swipe Right', cardIndex)
          }}
          onSwipedLeft={cardIndex => {
            console.log(`Left Swipe ID: ${cardIndex}`);
            this.updateSwipe(
              this.props.image_path,
              this.props.cards_metadata[cardIndex].data.imagePath,
              false,
              cardIndex,
            );
            this.segment_track_swipe('Swipe Left', cardIndex)
          }}
          marginTop={height / 18}
          shouldSwiperUpdate
          onTapCard={card_idx => {
            this.renderExtendCard(card_idx);
          }}
          inputOverlayLabelsOpacityRangeX={[-width / 3, -1, 0, 1, width / 3]}
          overlayOpacityHorizontalThreshold={1}
          animateOverlayLabelsOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              element: <OverlayLabel label="NOPE" color="#FF0000" />,
              style: {
                wrapper: styles.overlayWrapper,
              },
            },
            right: {
              title: 'LIKE',
              element: <OverlayLabel label="LIKE" color="#66ff00" />,
              style: {
                wrapper: {
                  ...styles.overlayWrapper,
                  alignItems: 'flex-start',
                },
              },
            },
          }}
        />
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
  overlayWrapper: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 2,
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
  },
});
