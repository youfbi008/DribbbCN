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

var ShotTwoCellRow = React.createClass({
  getInitialState: function() {
    return {
      image_uri: getImage.shotNormalImage(this.props.shot),
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
              defaultSource={{uri:'http://jimpunk.net/Loading/wp-content/uploads/loading2.gif'}}
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
    if(nextProps.shot['isGif'] != undefined && nextProps.shot['isGif']) {
        // console.log('will update this url of gif');  
      //     var image = getImage.shotHidpiImage(this.props.shot);
      // if(isGif) {
        var timeInMs = Date.now();
        var new_uri = this.state.image_uri;
        new_uri['uri'] = new_uri['uri'] + '?t=' + timeInMs;
        // new_uri['uri'] = 'https://avatars0.githubusercontent.com/u/1822459';
        this.setState({
          image_uri: new_uri,
          key: this.state.key + '%' + timeInMs
        });
        console.log(new_uri['uri']);
      // }
    } else if(nextProps.shot != this.props.shot) {
      this.setState({
          image_uri: getImage.shotNormalImage(nextProps.shot),
          key: nextProps.shot.id
      });
    }
  },
});

var styles = StyleSheet.create({
  cellContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    height: screen.width / 2,
    width: screen.width / 2,
    padding: 8,
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
    width: 23, 
    height: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 10, 
    top: 8,
    opacity: 0.9,
    resizeMode: "contain",
  }
});

module.exports = ShotTwoCellRow;
