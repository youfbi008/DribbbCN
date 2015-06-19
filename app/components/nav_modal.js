'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

var getImage = require('./helpers/getImage'),
    screen = require('Dimensions').get('window');

var ShotCell = React.createClass({
  render: function() {
    return (
      <Modal isVisible={this.state.isModalOpen}
               onClose={this.closeModal}
               backdropType="blur"
               backdropBlur="dark"
               forceToFront={true}
               customShowHandler={this._showModalTransition}
               customHideHandler={this._hideModalTransition}
               onPressBackdrop={this.closeModal}>
          <View style={styles.shotDetailsRow}>
            <View style={styles.shotCounter}>
              <Icon name="heart-o" size={24} color="#333"/>
              <Text style={styles.shotCounterText}>111</Text>
            </View>
            <View style={styles.shotCounter}>
              <Icon name="comments-o" size={24} color="#333"/>
              <Text style={styles.shotCounterText}> 222 </Text>
            </View>
            <View style={styles.shotCounter}>
              <Icon name="eye" size={24} color="#333"/>
              <Text style={styles.shotCounterText}> 333 </Text>
            </View>
          </View>
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'column'
  },
  cellImage: {
    backgroundColor: 'transparent',
    height: 300,
    width: screen.width
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = ShotCell;
