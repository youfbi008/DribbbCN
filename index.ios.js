/**
 * Dribbble App
 * Github url: https://github.com/catalinmiron/react-native-dribbble-app
 */
'use strict';

var React = require('react-native');
var EventEmitter = require('EventEmitter');
var {
  AppRegistry,
  Navigator,
  NavigatorIOS,
  StyleSheet,
  TabBarIOS,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage
} = React;


var ShotList = require('./app/ShotList'),
    Home_ShotList = require('./app/Home_ShotList'),
    Icon = require('FontAwesome'),
    screen = require('Dimensions').get('window');


var USER_STORE = "user_store";
var reloadGif_emitter = new EventEmitter();
var reloadGif_emitter_local = new EventEmitter();


var DribbbleApp = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'dribbble',
    };
  },
  
  _renderContent: function(category: string) {

   
    return (
      <NavigatorIOS 
        ref="dribbble_nav"
        style={styles.wrapper}
        navigationBarHidden={true}
        initialRoute={{
          component: ShotList,
          title: category,
          passProps: {filter: category, title: 'Popular', reloadGif_emitter: reloadGif_emitter},
        }}
      />
    );
  },

  _renderHomeContent: function() {

    
    return (
      <NavigatorIOS 
        ref="local_nav"
        style={styles.wrapper}
        navigationBarHidden={true}
        initialRoute={{
          component: Home_ShotList,
          title: '本土',
          passProps: {filter: 'popular', title: 'Popular', reloadGif_emitter: reloadGif_emitter_local},
        }}
      />
    );
  },

  _renderRewardContent: function() {
    
    return (
      <NavigatorIOS 
        ref="local_nav"
        style={styles.wrapper}
        navigationBarHidden={true}
        initialRoute={{
          component: Home_ShotList,
          title: '本土',
          passProps: {filter: 'popular', title: 'Popular', reloadGif_emitter: reloadGif_emitter_local},
        }}
      />
    );
  },
 
  componentWillMount: function() {

    // AsyncStorage.getItem(USER_STORE)
    //   .then((value) => {
    //     if (value !== null){
    //       var localStore = JSON.parse(res);
    //       this.setState({rowCellsCnt: localStore['rowCellsCnt']});
    //     } 
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   })
    //   .done();
    // AsyncStorage.clear();
    AsyncStorage.getItem(USER_STORE)
      .then((value) => {
        if( typeof value == undefined || value == null){
          // 默认数据
            var data = { rowCellsCnt: 2};
            AsyncStorage.setItem(USER_STORE, JSON.stringify(data), function(err) {
                if (err) {
                    console.error("error");
                }
            });
        }
        
      })
      .catch((error) => {
        console.log(error.message);
      })
      .done();
  },
  componentDidMount: function() {


     
  },

  render: function() {

    return (
      <View style={styles.tabContainer}>
        <TabBarIOS>
          <Icon.TabBarItem
            title="dribbble"
            iconName="dribbble"
            selectedIconName="dribbble"
            selected={this.state.selectedTab === 'dribbble'}
            onPress={() => {
              if(this.state.selectedTab != 'dribbble') {

                this.setState({
                  selectedTab: 'dribbble',
                });  
                reloadGif_emitter.emit('reloadGif_onChangeTab'); 
              }
            }}>
            {this._renderContent('popular')}

          </Icon.TabBarItem>

          <Icon.TabBarItem
            title="本土"
            iconName="home"
            selectedIconName="home"
            selected={this.state.selectedTab === 'home'}
            onPress={() => {
              if(this.state.selectedTab != 'home') {

                  this.setState({
                      selectedTab: 'home',
                  });
                  reloadGif_emitter_local.emit('reloadGif_onChangeTab');
              }
            }}>
            {this._renderHomeContent()}
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="悬赏"
            iconName="trophy"
            selectedIconName="trophy"
            selected={this.state.selectedTab === 'reward'}
            onPress={() => {
              this.setState({
                selectedTab: 'reward',
              });
            }}>
            {this._renderRewardContent()}
          </Icon.TabBarItem>
        </TabBarIOS>
   
      </View>
    );
  },
}); 
  
var styles = StyleSheet.create({
  tabContainer: {
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
    flex: 1,
    backgroundColor: 'transparent'
  },
});

AppRegistry.registerComponent('DribbbleApp', () => DribbbleApp);

module.exports = DribbbleApp;
