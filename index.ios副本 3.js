/**
 * Dribbble App
 * Github url: https://github.com/catalinmiron/react-native-dribbble-app
 */
'use strict';

var React = require('react-native');
var Modal = require('react-native-modal');
var NavigationBar = require('react-native-navbar');

var {
  AppRegistry,
  Navigator,
  NavigatorIOS,
  StyleSheet,
  TabBarIOS,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight
} = React;


var ShotList = require('./app/ShotList'),
    RewardList = require('./app/RewardList'),
    Icon = require('FontAwesome'),
    screen = require('Dimensions').get('window');

class CustomNext extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.handleModalOpen}>
        <React.Image
          source={require('image!bars')}
          style={{width: 24, height: 24, right: 10, bottom: 5}}
        />
      </TouchableOpacity>
    );
  }
}

var DribbbleApp = React.createClass({
  getInitialState: function() {
    return {
      selectedCategory: 'popular',
      selectedTab: 'popular',
      isModalOpen: false,
      modalItemList: [
        {id: 1, name: 'popular', title: 'Popular', icon: 'heart-o', iv_icon: 'heart'},
        {id: 2, name: 'debuts', title: 'Debuts', icon: 'heart-o', iv_icon: 'heart'},
        {id: 3, name: 'teams', title: 'Teams', icon: 'heart-o', iv_icon: 'heart'},
      ]
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

  checkModalIconEvent: function(category: string) {
    if(this.state.selectedCategory == category) {
      return false;
    } else {
      return true;
    }
  },

  handleModalOpen: function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  },

  _renderScene: function(route, navigator) {
    var Component = route.component;
    var navBar = route.navigationBar;

    if (navBar) {
      navBar = React.addons.cloneWithProps(navBar, {
        navigator: navigator,
        route: route
      });
    }

    return (
      <View style={styles.pageContainer}>
        {navBar}
        <Component navigator={navigator} route={route} {...route.passProps} />
      </View>
    );
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
  _renderModalRow: function() {

    var modal_row = this.state.modalItemList.map((item) => {
      var category_name = item.name;
      var isValid = this.checkModalIconEvent(category_name);
      var icon = isValid ? item.icon : item.iv_icon ;
      var navigator = this.refs.nav;
    
      return <TouchableOpacity 
                  style={styles.modalIcon}
                  onPress={() => {
                  
                    if(!isValid) {
                      return;
                    }
                    var old_category = this.state.selectedCategory;
                    this.setState({
                        selectedCategory: category_name,
                      });
                    {/*TODOnavigatorIOS的 replace功能不起作用，但navigator又会导致子页面不正常*/} 
                    navigator.push({
                      component: ShotList,
                      passProps: {filter: category_name},
                      title: category_name,
                      backButtonTitle: 'aa',
                      rightButtonIcon: require('image!bars'),
                      onRightButtonPress: () => {

                        this.setState({
                          isModalOpen: !this.state.isModalOpen,
                        });
                      }
                    });
                    this.closeModal();
                  }}>
                <View style={styles.modalIcon}>
                  <Icon name={icon} size={24} color="#333"/>
                  <Text style={styles.modalIconText}>{category_name}</Text>
                </View>
            </TouchableOpacity>
    });
    return (
      {modal_row}
    );
  },
  render: function() {
    return (
      <View style={styles.tabContainer}>
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
            title="悬赏"
            iconName="dribbble"
            selectedIconName="dribbble"
            selected={this.state.selectedTab === '悬赏'}
            onPress={() => {
              this.setState({
                selectedTab: '悬赏',
              });
            }}>
            {this._renderRewardContent()}
          </Icon.TabBarItem>
        </TabBarIOS>
        <NavigationBar navigator={this.refs.nav} title="aaaa"/>
        <Modal isVisible={this.state.isModalOpen}
                 onClose={this.closeModal}
                 backdropType="plain"
                 forceToFront={false}
                 containerPointerEvents="box-none"
                 customShowHandler={this._showModalTransition}
                 customHideHandler={this._hideModalTransition}
                 onPressBackdrop={this.closeModal}>

          <View style={styles.modalContainer}>
            <View style={styles.closeButton}>
              <TouchableOpacity 
                onPress={this.closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalRow}>
              {this._renderModalRow()}
         
            </View>
          </View>
        </Modal>
      </View>
    );
  },
  // _getCustomCloseButton: function() {
    
  //   return (
  //     <View style={styles.closeButton}>
  //         <TouchableOpacity onPress={this.closeModal}>
  //           <Text style={styles.closeButtonText}>Close</Text>
  //         </TouchableOpacity>
  //     </View>
  //   );
  // },
  
        
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
  pageContainer: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  modalContainer: {

    height: screen.height - 400,
    flex: 1,
  },
  modalRow: {

    height: screen.height - 400,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  modalIcon: {
    flex: 1,
    alignItems: 'center',
  },
  modalIconText: {
    color: '#333'
  },

  closeButton: {
    position: 'relative',
    top: 0,
    left: 180,
    width:60,
    borderColor: '#000000',
    borderRadius: 2,
    borderWidth: 1,

    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  closeButtonText: {
    color: '#000000',
  },
});

AppRegistry.registerComponent('DribbbleApp', () => DribbbleApp);

module.exports = DribbbleApp;
