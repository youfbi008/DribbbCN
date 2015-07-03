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

var getImage = require('../helpers/getImage'),
    screen = require('Dimensions').get('window');

var ShotThreeCellRow = React.createClass({
  getInitialState: function() {
    return {
      image_uri: getImage.shotTeaserImage(this.props.shot),
      key: this.props.shot.id
    };
  },
  render: function() {

    var isGif = getImage.checkGif(this.props.shot); 

    return (
      <View>
        <TouchableHighlight onPress={this.props.onSelect}>
          <View style={styles.cellContainer}>
            <Image
              key={this.state.key}
              source={this.state.image_uri}
              style={styles.cellImage}
              accessible={true}
            />
            {isGif && <Image
              source={require('image!isgif')}
              style={styles.isGif}
            />}
          </View>
        </TouchableHighlight>
      </View>
    );
  },
  componentWillReceiveProps: function(nextProps) {
    // var isGif = getImage.checkGif(nextProps.shot); 
    if( (nextProps.shot['isGif'] != undefined && nextProps.shot['isGif'])) {
      var ret = getImage.randomFileName(this.state.image_uri['uri']);

      this.setState({
        image_uri: {uri: ret['image_url']},
        key: this.state.key + '%' + ret['timeInMs']
      });
      console.log(ret['image_url']);
    } else if(nextProps.shot != this.props.shot && nextProps.shot['isGif'] != false) {
      this.setState({
          image_uri: getImage.shotTeaserImage(nextProps.shot),
          key: nextProps.shot.id
      });
    }
  },
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
    opacity: 0.9,
    resizeMode: "contain",
  }
});

module.exports = ShotThreeCellRow;
