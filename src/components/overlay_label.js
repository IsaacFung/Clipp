import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { string } from 'prop-types'

const OverlayLabel = ({ label, color }) => (
  <View style={[styles.overlayLabel, { borderColor: color }]}>
    <Text style={[styles.overlayLabelText, { color }]}>{label}</Text>
  </View>
)

OverlayLabel.propTypes = {
  label: string.isRequired,
  color: string.isRequired
}

export default OverlayLabel

const styles = StyleSheet.create({
  overlayLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 5,
    borderRadius: 10
  },
  overlayLabelText: {
    fontWeight: 'bold',
    fontSize: 50,
    fontFamily: 'Avenir',
    textAlign: 'center'
  }
})
