/**
 * Dribbble App
 * Github url: https://github.com/catalinmiron/react-native-dribbble-app
 */
'use strict';

var React = require('react-native');

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
    RewardList = require('./app/RewardList'),
    Icon = require('FontAwesome'),
    screen = require('Dimensions').get('window');


var USER_STORE = "user_store";

var DribbbleApp = React.createClass({
  getInitialState: function() {
    return {
      nav_stack: ['popular'],
      selectedTab: 'popular',
    };
  },
    

  handleNavStack: function(newNav_stack: array) {
    this.setState({
      nav_stack: newNav_stack,
    });
  },
  
  _renderContent: function(category: string) {

   
    return (
      <NavigatorIOS 
        ref="nav"
        style={styles.wrapper}
        navigationBarHidden={true}
        initialRoute={{
          component: ShotList,
          title: category,
          passProps: {filter: category, title: 'Popular', nav_stack: this.state.nav_stack, handleNavStack: this.handleNavStack},
        }}
      />
    );
  },

  _renderRewardContent: function() {

    
    return (
      <NavigatorIOS 
        ref="nav_reward"
        style={styles.wrapper}
        initialRoute={{
          component: RewardList,
          title: '悬赏',
          passProps: {},
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
            title="Popular"
            iconName="dribbble"
            selectedIconName="dribbble"
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
            title="本土"
            iconName="home"
            selectedIconName="home"
            selected={this.state.selectedTab === '本土'}
            onPress={() => {
              this.setState({
                selectedTab: '本土',
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
