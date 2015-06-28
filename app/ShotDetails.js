'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');

// var HTMLWebView = require('react-native-html-webview');
var ActivityView = require('react-native-activity-view');


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
  TouchableWithoutFeedback,
} = React;

var Icon = require('FontAwesome'),
    getImage = require('./helpers/getImage'),
    common = require('./helpers/common'),
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
      /*TODO*/
      shareImageUrl: 'https://facebook.github.io/react/img/logo_og.png',
      shareHtmlUrl: '',
      shareTitle: 'Test',
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
    if(navState.url.toLowerCase().indexOf('close') > -1) {
      this.closeModal();
    } else if(navState.url.toLowerCase().indexOf('popiosmenu') > -1) {
      // alert(2);
      // TODO: 也可以不关闭窗口使其自身跳转加参数来判断
      this.closeModal();
      this.onPressShare();
    }
  },
  webViewRenderError: function() { 
    // TODO：直接用dribbbcn:close这种跳转会报错，用此方法可以使其不报错，继续执行
    // 尝试了一下 虽然是本页刷新 看不出跳转，但由于modal窗口中的东西放到了 overlay里强制保持在最前面导致挡住了弹出窗口
    // 实在需要的话可以从修改原生出手，看是否可以让弹出窗口为最前，或者overlay不覆盖弹出窗口 !!!!
    return;
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
  onPressShare: function() {
    // this.setState({
    //   isHeaderVisible: false
    // });
    ActivityView.show({
      text: this.state.shareTitle,
      url: this.state.shareHtmlUrl,
      imageUrl: this.state.shareImageUrl
    });
  },
  componentDidMount: function() {
    var cur_pop_img_uri = getImage.shotPopImage(this.props.shot);
    this.setState({
      shareImageUrl: cur_pop_img_uri['uri'],
      shareHtmlUrl: this.props.shot.html_url,
      shareTitle: this.props.shot.title,
    });
  },
  render: function() {
    var shotAuthor = this.props.shot.user;
    var cur_img_url = getImage.shotNormalImage(this.props.shot);
    var cur_pop_img_uri = getImage.shotPopImage(this.props.shot);
    var hidip_url = cur_pop_img_uri['uri'];

   
   var image_uri = 'http://wa-ex.lolipop.jp/test/test.html?uri=' + hidip_url;
 // image_uri = 'http://wa-ex.lolipop.jp/test/index.html';
 
  console.log(image_uri);
    return (
      <View style={styles.pageContainer}>

{/*
       <Overlay 
          isVisible={this.state.isHeaderVisible}>
 </Overlay>

*/}
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
              <View style={styles.shareButtonContainer}>     
                <TouchableOpacity
                  onPress={this.onPressShare}>
                  <View style={styles.shareButton}>
                    <Icon name="share-square-o" size={24} color="#333"/>
                  </View>
                </TouchableOpacity>
              </View>
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
                        stylesheet={descriptionStyles}/>
                </Text>
              </View>
          </View>
         
        
        </ParallaxView>

          <NavigationBar 
            navigator={this.props.navigator} 
            title={common.getResizeTitle(this.props.shot.title, screen.width)}
            onPrev={this.handleBackButton}
            style={styles.headerContainer}
            isLongTitle={true}
           />
       
  <Modal isVisible={this.state.isModalOpen}
                 onClose={this.closeModal}
                 backdropType="none"
                 forceToFront={true}
                 hideCloseButton={true}
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
                  renderError={this.webViewRenderError}
                  javaScriptEnabledAndroid={true}
                  startInLoadingState={false}
                  bounces={false}
                  scrollEnabled={true}
                  automaticallyAdjustContentInsets={true}
                  onNavigationStateChange={this.onNavigationStateChange}
                />


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
  pageContainer: {
    flex: 1,
  },
  /* 由于被动态效果覆盖，所以使用绝对定位使其在最前，并且不像overlay那样强制，防止覆盖弹出菜单 */
  headerContainer: {
    position: 'absolute',
    width: screen.width,
    top: 0,
    left: 0
  },

  viewContainer: {
    marginTop: 40,
  },

  webView: {
    height: screen.height,
    backgroundColor: 'transparent',
    // backgroundColor: 'rgba(255,255,255,0.2)',
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
  shareButtonContainer: {
    position: 'absolute',
    width: 40,
    right: 20,
    // paddingBottom: 20,
    // paddingTop: 40,
    // alignItems: 'center',
    // width: screen.width,
    // backgroundColor: '#fff'
  },
  shareButton: {
    width: 40,
    alignItems: 'center'
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


var descriptionStyles  = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#ea4c89'
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
    opacity: 0.8,
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
    backgroundColor: '#000000',
    borderRadius: 3,
  }
});


module.exports = ShotDetails;
