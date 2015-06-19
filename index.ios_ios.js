/**
 * Dribbble App
 * Github url: https://github.com/catalinmiron/react-native-dribbble-app
 */
'use strict';

var React = require('react-native');
var Modal = require('react-native-modal');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  TabBarIOS,
  View,
  Text,
  TouchableHighlight
} = React;


var ShotList = require('./app/ShotList'),
    Icon = require('FontAwesome'),
    screen = require('Dimensions').get('window');

var DribbbleApp = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'popular',
      isModalOpen: false
    };
  },
    
  openModal: function() {
    this.setState({
      isModalOpen: true
    });
  },

  closeModal: function() {
    this.setState({
      isModalOpen: false
    });
  },

  _renderContent: function(category: string) {

    
    return (
      <NavigatorIOS 
        ref="nav"
        style={styles.wrapper}
        initialRoute={{
          component: ShotList,
          title: category,
          passProps: {filter: category, isModalOpen: this.state.isModalOpen},
          rightButtonIcon: require('image!bars'),
          onRightButtonPress: () => {

            this.setState({
              isModalOpen: !this.state.isModalOpen,
            });
          }
        }}
      />
    );
  },


  render: function() {
    return (
      <View style={styles.container}>
        <TabBarIOS>
          <Icon.TabBarItem
            title="Popular"
            iconName="heart"
            selectedIconName="heart"
            selected={this.state.selectedTab === 'popular'}
            onPress={() => {
              this.setState({
                selectedTab: 'popular',
              });
            }}>
            {this._renderContent('popular')}
          </Icon.TabBarItem>
        {/*  <Icon.TabBarItem
            title="Debuts"
            iconName="trophy"
            selectedIconName="trophy"
            selected={this.state.selectedTab === 'debuts'}
            onPress={() => {
              this.setState({
                selectedTab: 'debuts',
              });
            }}>
            {this._renderContent('debuts')}
          </Icon.TabBarItem>
          */}
          <Icon.TabBarItem
            title="Animated"
            iconName="dribbble"
            selectedIconName="dribbble"
            selected={this.state.selectedTab === 'animated'}
            onPress={() => {
              this.setState({
                selectedTab: 'animated',
              });
            }}>
            {this._renderContent('animated')}
          </Icon.TabBarItem>
        </TabBarIOS>
        <Modal isVisible={this.state.isModalOpen}
                 onClose={this.closeModal}
                 backdropType="blur"
                 backdropBlur="dark"
                 forceToFront={true}
                 customShowHandler={this._showModalTransition}
                 customHideHandler={this._hideModalTransition}
                 onPressBackdrop={this.closeModal}>
            <View style={styles.shotDetailsRow}>
              <TouchableHighlight 
                  onPress={() => {
                    this._renderContent('debuts');
                    this.closeModal();
                  }}>
                <View style={styles.shotCounter}>
                  <Icon name="heart-o" size={24} color="#333"/>
                  <Text style={styles.shotCounterText}>111</Text>
                </View>
              </TouchableHighlight>
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
      </View>
    );
  },
  _showModalTransition: function(transition) {
    transition('opacity', {
      duration: 200,
      begin: 0,
      end: 1
    });
    transition('height', {
      duration: 200,
      begin: - screen.height * 2,
      end: screen.height
    });
  },

  _hideModalTransition: function(transition) {
    transition('height', {
      duration: 200,
      begin: screen.height,
      end: screen.height * 2,
      reset: true
    });
    transition('opacity', {
      duration: 200,
      begin: 1,
      end: 0
    });
  },
}); 
  
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  wrapper: {
    flex: 1
  },
    shotDetailsRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
    shotCounter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  shotCounterText: {
    color: '#333'
  },
});

AppRegistry.registerComponent('DribbbleApp', () => DribbbleApp);

module.exports = DribbbleApp;