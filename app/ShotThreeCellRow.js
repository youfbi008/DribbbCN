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

var ShotThreeCellRow = React.createClass({

  render: function() {

    var isGif = getImage.checkGif(this.props.shot); 

    return (
      <View>
        <TouchableHighlight onPress={this.props.onSelect}>
          <View style={styles.cellContainer}>
            <Image
              source={getImage.shotTeaserImage(this.props.shot)}
              style={styles.cellImage}
              accessible={true}
            />
            {isGif && <Image
              source={require('image!isgif')}
              style={styles.isGif}
              resizeMode={true}
            />}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({

  cellContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    height: screen.width / 3,
    width: screen.width / 3 ,
    padding: 5,
  },
  cellImage: {
    backgroundColor: 'transparent',
    flex: 1
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  isGif: {
    width: 20, 
    height: 15,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 6, 
    top: 6,
    opacity: 0.9
  }
});

module.exports = ShotThreeCellRow;
