'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var HTMLWebView = require('react-native-html-webview');

var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Component,
  WebView,
  TouchableWithoutFeedback
} = React;

var Icon = require('FontAwesome'),
    getImage = require('./helpers/getImage'),
    HTML = require('react-native-htmlview'),
    screen = require('Dimensions').get('window'),
    ParallaxView = require('react-native-parallax-view'),
    Modal = require('react-native-modal'),
    Overlay = require('react-native-overlay');

var ShotDetails = React.createClass({
  getInitialState: function() {
    return {
      isModalOpen: false,
      isHeaderVisible: true,
    }
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
  onNavigationStateChange: function(navState) {
    if(navState.url.indexOf('close.html') > -1) {
      this.closeModal();
      // this.setState({
      //   isModalOpen: false
      // });
    }
  },

  handleBackButton: function() {

    this.props.navigator.pop();
    this.setState({
      isHeaderVisible: false
    });
  },
  onPressWebview: function(e) {

    e.preventDefault();
  },

  render: function() {
    var shotAuthor = this.props.shot.user;
    var cur_img_url = getImage.shotNormalImage(this.props.shot);
    var cur_pop_img_uri = getImage.shotPopImage(this.props.shot);
    var hidip_url = cur_pop_img_uri['uri'];
    if ( hidip_url == null ){
      hidip_url = cur_img_url['uri'];
    }
  
    var image_uri = "http://wa-ex.lolipop.jp/test/index.html?uri=" + hidip_url + '&width=' + (screen.width-20) + '&height=' + (screen.height - 200);
    image_uri = 'http://wa-ex.lolipop.jp/test/test.html?uri=' + hidip_url;

    
    return (
      <View style={styles.pageContainer}>
        <Overlay 
          isVisible={this.state.isHeaderVisible}>
          <NavigationBar 
            navigator={this.props.navigator} 
            title={this.props.shot.title}
            onPrev={this.handleBackButton}
           />
        </Overlay>

        <ParallaxView
          backgroundSource={cur_img_url}
          windowHeight={200}
          style={styles.viewContainer}
          header={(
            <TouchableOpacity onPress={this.openModal}>
              <View style={styles.invisibleView}></View>
            </TouchableOpacity>
          )}
          >
          <View>
            <View style={styles.headerContent}>
              <Image source={getImage.authorAvatar(shotAuthor)}
                     style={styles.shotAuthorAvatar} />
              <Text style={styles.shotTitle}>{this.props.shot.title}</Text>
              <Text style={styles.shotAuthorContent}>by <Text style={styles.shotAuthor}>{shotAuthor.name}</Text></Text>
            </View>
            <View style={styles.mainSection}>

              <View style={styles.shotDetailsRow}>

              

                <View style={styles.shotCounter}>
                  <Icon name="heart-o" size={24} color="#333"/>
                  <Text style={styles.shotCounterText}> {this.props.shot.likes_count} </Text>
                </View>
                <View style={styles.shotCounter}>
                  <Icon name="comments-o" size={24} color="#333"/>
                  <Text style={styles.shotCounterText}> {this.props.shot.comments_count} </Text>
                </View>
                <View style={styles.shotCounter}>
                  <Icon name="eye" size={24} color="#333"/>
                  <Text style={styles.shotCounterText}> {this.props.shot.views_count} </Text>
                </View>
              </View>
              <View style={styles.separator} />
              <Text>
                <HTML value={this.props.shot.description}
                      stylesheet={styles}/>
              </Text>
            </View>
          </View>
         
          <Modal isVisible={this.state.isModalOpen}
                 onClose={this.closeModal}
                 backdropType="plain"
                 forceToFront={true}
                 style={modalStyles}
                 containerPointerEvents="box-none"
                 customShowHandler={this._showModalTransition}
                 customHideHandler={this._hideModalTransition}
                 onPressBackdrop={this.closeModal}>

               {/*  photoswipe 有很多好的关闭方法，但由于无法回调来关闭modal ，
               可考虑设置modal为无背景  */}
            <WebView
                  ref="webView"
                  style={styles.webView}
                  url={image_uri}
                  
                  javaScriptEnabledAndroid={false}
                  startInLoadingState={false}
                  bounces={false}
                  scrollEnabled={true}
                  automaticallyAdjustContentInsets={true}
                  onNavigationStateChange={this.onNavigationStateChange}
                />

      

         

      {/*  

          <Modal isVisible={this.state.isModalOpen}
                 onClose={this.closeModal}
                 style={modalStyles}
                 backdropType="blur"
                 backdropBlur="dark"
                 hideCloseButton={true}
                 forceToFront={true}
                 containerPointerEvents="box-none"
                 customShowHandler={this._showModalTransition}
                 customHideHandler={this._hideModalTransition}
                 onPressBackdrop={this.closeModal}
                 >
        <View style={styles.modalInContainer}>
            <WebView
                  ref="webView"
                  style={styles.webView}
                  url={image_uri}
                  
                  javaScriptEnabledAndroid={false}
                  startInLoadingState={false}
                  bounces={false}
                  scrollEnabled={true}
                  automaticallyAdjustContentInsets={true}
                />

                </View>





        <View style={styles.modalInContainer}>
            <View style={styles.closeButton}>
              <TouchableOpacity 
                onPress={this.closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <View >
              
              <TouchableWithoutFeedback onPress={this.onPressWebview}>
            <WebView
                  ref="webView"
                  style={styles.webView}
                  url={image_uri}
                  
                  javaScriptEnabledAndroid={false}
                  startInLoadingState={false}
                  bounces={false}
                  scrollEnabled={true}
                  automaticallyAdjustContentInsets={true}
                />
              
                 {/*  
                  html={htmlcontent}
 url={cur_pop_img_url['uri']}
                  <HTMLWebView
                  style={{width: 300}}
                  html={htmlcontent}
                  makeSafe={true}
                  autoHeight={true}
                  />

              </TouchableWithoutFeedback>
         
            </View>
          </View>
*/}

                 {/* <Image source={getImage.shotPopImage(this.props.shot)}
                   style={styles.customModalImage}
                   /> */}
          </Modal>
        </ParallaxView>
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
  pageContainer: {
    flex: 1,
  },
  webView: {
    height: screen.height - 50,
  },
  viewContainer: {
    marginTop: 40,
  },
  a: {
    fontWeight: '300',
    color: '#ea4c89'
  },

  invisibleView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right:0
  },
  customModalImage: {
    height: screen.height / 2
  },
  headerContent: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 40,
    alignItems: 'center',
    width: screen.width,
    backgroundColor: '#fff'
  },
  shotTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#ea4c89',
    lineHeight: 18
  },
  shotAuthorContent: {
    fontSize: 12
  },
  shotAuthor: {
    fontWeight: '900',
    lineHeight: 18
  },
  shotAuthorAvatar: {
    borderRadius: 40,
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: 60,
    left: screen.width / 2 - 40,
    borderWidth: 2,
    borderColor: '#fff'
  },
  rightPane: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
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
  mainSection: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'stretch',
    padding: 10
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },

  modalContainer: {
    position: 'relative',
    height: screen.height - 200,
    flex: 1,
  },

  closeButton: {
    position: 'relative',
    top: 0,
    left: 160,
    width:60,
    borderColor: '#000000',
    borderRadius: 2,
    borderWidth: 1,

    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 0,
  },
  closeButtonText: {
    color: '#000000',
  },
});


var modalStyles  = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    opacity: 0.5,
  },
  closeButton: {
    position: 'absolute',
    borderColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 1,
    right: 20,
    top: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  closeButtonText: {
    color: '#ffffff',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 3,
  }
});


module.exports = ShotDetails;
