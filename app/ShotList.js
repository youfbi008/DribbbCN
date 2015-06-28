'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Modal = require('react-native-modal');
var STORAGE_KEY = '@UserStorage:rowCellsCnt';
var {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage
} = React;

var api = require('./helpers/api');

var ShotOneCellRow = require('./ShotOneCellRow');
var ShotTwoCellRow = require('./ShotTwoCellRow');
var ShotThreeCellRow = require('./ShotThreeCellRow');
var ShotDetails = require('./ShotDetails');
var Icon = require('FontAwesome'),
    screen = require('Dimensions').get('window');

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var USER_STORE = "user_store";

var LOADING = {};

class CustomNext extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.handleModalOpen}>
        <View style={styles.navBarRightButtonContainer}>
          <Image
            source={require('image!bars')}
            style={styles.navBarRightButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
var modalResizeItemList = [
        {id: 1, name: 'one', title: 'One', size: 6, type: 'one_cell', icon: 'square', iv_icon: 'heart-o'},
        {id: 2, name: 'two', title: 'Two', size: 10, type: 'two_cell', icon: 'th-large', iv_icon: 'heart-o'},
        {id: 3, name: 'three', title: 'Three', size: 12, type: 'three_cell', icon: 'th', iv_icon: 'heart-o'},
      ];

var modalSortItemList = [
        {id: 1, name: 'popular', title: 'Popular', type: 'one_cell', icon: 'heart-o', iv_icon: 'heart'},
        {id: 2, name: 'recent', title: 'Recent', type: 'two_cell', icon: 'heart-o', iv_icon: 'heart'},
        {id: 3, name: 'views', title: 'Most Viewed', type: 'three_cell', icon: 'heart-o', iv_icon: 'heart'},
        // {id: 4, name: 'comments', title: 'Most Commented', type: 'three_cell', icon: 'th', iv_icon: 'th'},
      ];

var modalItemList = [
        {id: 1, name: 'popular', title: 'Popular', icon: 'heart-o', iv_icon: 'heart'},
        {id: 2, name: 'debuts', title: 'Debuts', icon: 'heart-o', iv_icon: 'heart'},
        {id: 3, name: 'teams', title: 'Teams', icon: 'heart-o', iv_icon: 'heart'},
        {id: 4, name: 'animated', title: 'Animated', icon: 'heart-o', iv_icon: 'heart'},
        {id: 5, name: 'playoffs', title: 'Playoffs', icon: 'heart-o', iv_icon: 'heart'},
        {id: 6, name: 'rebounds', title: 'Rebounds', icon: 'heart-o', iv_icon: 'heart'},
      ];
var ShotList = React.createClass({

  getDefaultProps: function() {


    return {
      filter: '',
      jumpCnt: 1,
      rowCellsCnt: 2,
      page_size: 10,
      sort_type: 'popular',
    };
  },

  getInitialState: function() {
    


    return {
      jumpCnt: this.props.jumpCnt,
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) : bool {
                return (
                  row1 !== row2 
                  // ||
                  // this.state.reloading
                // (r1["firstName"] !== r2["firstName"]) ||
                // (r1["lastName"] !== r2["lastName"]) ||
                // (r1["age"] !== r2["age"])
                );
            }
        // rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: this.props.filter,
      title: this.props.title,
      rowCellsCnt: this.props.rowCellsCnt,
      page_size: this.props.page_size,
      sort_type: this.props.sort_type,
      queryNumber: 0,
      isModalOpen: false,
      isReLoading: false,
      user_data: {}

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

  checkModalResizeIconEvent: function(rowCellsCnt: string) {
    if(this.state.rowCellsCnt == rowCellsCnt) {
      return false;
    } else {
      return true;
    }
  },

  checkModalSortIconEvent: function(sort_type: string) {
    if(this.state.sort_type == sort_type) {
      return false;
    } else {
      return true;
    }
  },

  checkModalIconEvent: function(category: string) {
    if(this.props.nav_stack[this.props.nav_stack.length - 1] == category) {
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
  _renderModalResizeRow: function() {

    var modal_row = modalResizeItemList.map((item) => {
      var icon_name = item.name;
      var title = item.title;
      var rowCellsCnt = item.id;
      var isValid = this.checkModalResizeIconEvent(rowCellsCnt);
      var icon = isValid ? item.icon : item.iv_icon ;

      return <TouchableOpacity 
                  onPress={() => {
                  
                    if(!isValid) {
                      return;
                    }
       
                    this.setState({
                      rowCellsCnt: rowCellsCnt,
                      page_size: item.size,
                      isReLoading: true,
                    });
                    this.closeModal();

                    var query = this.state.filter;

                    {/* 考虑可以不清空再显示这种效果 或者在左上角显示*/}
                    // this.setState({
                    //   isLoading: true,
                    //   dataSource: this.getDataSource([]),
                    // });

                    fetch(api.getShotsByType(query, 1, item.size, this.state.sort_type))
                      .then((response) => response.json())
                      .catch((error) => {
                        LOADING[query] = false;
                        resultsCache.dataForQuery[query] = undefined;

                        this.setState({
                          dataSource: this.getDataSource([]),
                          // isLoading: false,
                        });
                      })
                      .then((responseData) => {
                        LOADING[query] = false;
                        resultsCache.dataForQuery[query] = responseData;
                        resultsCache.nextPageNumberForQuery[query] = 2;

                        this.setState({
                          // isLoading: false,
                          isReLoading: false,
                          dataSource: this.getDataSource(responseData),
                        });
                      })
                      .done();

                      var user_data = this.state.user_data;

                      user_data['rowCellsCnt'] = rowCellsCnt;

                      AsyncStorage.setItem(USER_STORE, JSON.stringify(user_data))
                        .then(() => console.log('rowCellsCnt:' + item.id))
                        .catch((error) => console.log(error.message))
                        .done();

                    // LocalStore.table("setting").then(function(setting){
   
                    //     var res_data = setting.where({
                    //         title: "rowCellsCnt"
                    //     }).find();

                    //     if(res_data.length > 0) {
                    //       if(res_data[0]['content'] != item.id) {
                    //         var upt_data = {
                    //             content: item.id
                    //         };
                    //           // Update Data
                    //         var newData = setting.where({
                    //             title: "rowCellsCnt"
                    //         }).update(upt_data);

                    //         console.log(newData[0]);
                    //       }
                    //     } else {
                    //           // Add Data
                    //       var id = setting.add({
                    //           title: "rowCellsCnt",
                    //           content: 2
                    //       });
                    //     }
                    // });
                    
                    
                  }}>
                <View style={styles.modalIcon}>
                  <Icon name={icon} size={24} color="#333"/>
                  <Text style={styles.modalIconText}>{title}</Text>
                </View>
            </TouchableOpacity>
    });
    return (
      {modal_row}
    );
  },

  _renderModalSortRow: function() {

    var modal_row = modalSortItemList.map((item) => {
      var sort_type = item.name;
      var isValid = this.checkModalSortIconEvent(sort_type);
      var icon = isValid ? item.icon : item.iv_icon ;
    
      return <TouchableOpacity 
                  onPress={() => {
                  
                    if(!isValid) {
                      return;
                    }
       
                    this.setState({
                      sort_type: sort_type,
                      isReLoading: true
                    });
                    this.closeModal();

                    var query = this.state.filter;

  // this.refs.navBar.loading();
                    // this.refs.navBar.title = "aaa";
                    {/* 考虑可以不清空再显示这种效果 或者在左上角显示*/}
                    // this.setState({
                    //   isLoading: true,
                    //   dataSource: this.getDataSource([]),
                    // });


                    fetch(api.getShotsByType(query, 1, this.state.page_size, sort_type))
                      .then((response) => response.json())
                      .catch((error) => {
                        LOADING[query] = false;
                        resultsCache.dataForQuery[query] = undefined;

                        this.setState({
                          dataSource: this.getDataSource([]),
                          isReLoading: false,
                        });
                      })
                      .then((responseData) => {
                        LOADING[query] = false;
                        resultsCache.dataForQuery[query] = responseData;
                        resultsCache.nextPageNumberForQuery[query] = 2;

                        this.setState({
                          isReLoading: false,
                          dataSource: this.getDataSource(responseData),
                        });
                      })
                      .done();

                  }}>
                <View style={styles.modalIcon}>
                  <Icon name={icon} size={24} color="#333"/>
                  <Text style={styles.modalIconText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
    });
    return (
      {modal_row}
    );
  },

  _renderModalRow: function() {

    var modal_row = modalItemList.map((item) => {
      var category_name = item.name;
      var title = item.title;
      var isValid = this.checkModalIconEvent(category_name);
      var icon = isValid ? item.icon : item.iv_icon ;
      // var navigator = this.refs.nav;
    
      return <TouchableOpacity 
                  onPress={() => {
                  
                    if(!isValid) {
                      return;
                    }
                    
                    var newJumpCnt = parseInt(this.props.jumpCnt) + 1;
                    // console.log(this.props.jumpCnt);
                    // console.log(newJumpCnt);


                    this.closeModal();

                    var newNav_stack = this.props.nav_stack;
                    var index = newNav_stack.indexOf(category_name);
                    if(index > -1) {
                      var pop_num = newNav_stack.length - 1 - index;
                      this.props.navigator.popN(pop_num);
                      for (var i = pop_num; i > 0; i--) {
                        newNav_stack.pop();
                      };
                      this.props.handleNavStack(newNav_stack);
                    } else {
                      newNav_stack.push(category_name);
                      console.log(newNav_stack);
                      // if(this.props.jumpCnt % 2 == 0) {
                      //   this.props.navigator.replacePreviousAndPop({
                      //     component: ShotList,
                      //     passProps: {filter: category_name, title: item.title, jumpCnt: newJumpCnt},
                      
                      //   });
                      // } else {

                      {/*TODOnavigatorIOS的 replace功能不起作用，但navigator又会导致子页面不正常*/} 
                      this.props.navigator.push({
                        component: ShotList,
                        passProps: {filter: category_name, title: title, jumpCnt: newJumpCnt, nav_stack: newNav_stack,handleNavStack: this.props.handleNavStack},
                    
                      });
                    // }
                    }
                     
                  }}>
                <View style={styles.modalIcon}>
                  <Icon name={icon} size={24} color="#333"/>
                  <Text style={styles.modalIconText}>{title}</Text>
                </View>
            </TouchableOpacity>
    });
    return (
      {modal_row}
    );
  },
  componentWillMount: function() {

    {/* 由于在分类跳转时每次都读 可以考虑放到父组件里，子组件调用父组件属性 
    或者在componentWillReceiveProps中更新值，然后通过属性依次传递下去  */}
    AsyncStorage.getItem(USER_STORE)
      .then((value) => {
        if( typeof value != undefined && value != null){
          var localUserStore = JSON.parse(value);
          var rowCellsCnt = localUserStore['rowCellsCnt'];
          this.setState({rowCellsCnt: rowCellsCnt});
          this.setState({page_size: modalResizeItemList[rowCellsCnt - 1].size});
          this.setState({user_data: localUserStore});
        } 
        this.getShots(this.state.filter);
      })
      .catch((error) => {
        console.log(error.message);
        this.getShots(this.state.filter);
      })
      .done();

    // AsyncStorage.getItem(STORAGE_KEY)
    //   .then((value) => {
    //     if (value !== null){
    //       this.setState({rowCellsCnt: value});
    //       this.setState({page_size: modalResizeItemList[value - 1].size});
    //     } else {
    //        AsyncStorage.setItem(STORAGE_KEY, "2")
    //         .then(() => console.log(2))
    //         .catch((error) => console.log(error.message))
    //         .done();
    //     }
    //     this.getShots(this.state.filter);
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //     this.getShots(this.state.filter);
    //   })
    //   .done();
   
  },

  getShots: function(query: string) {
    this.setState({filter: query});

    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      } else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: false,
    });

    fetch(api.getShotsByType(query, 1, this.state.page_size, this.state.sort_type))
      .then((response) => response.json())
      .catch((error) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((responseData) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = responseData;
        resultsCache.nextPageNumberForQuery[query] = 2;

        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(responseData),
        });
      })
      .done();
  },

  hasMore: function(): boolean {
    var query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
      resultsCache.dataForQuery[query].length
    );
  },

  onEndReached: function() {
    var query = this.state.filter;
    if (!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }

    if (LOADING[query]) {
      return;
    }

    LOADING[query] = true;
    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });

    var page = resultsCache.nextPageNumberForQuery[query];
    fetch(api.getShotsByType(query, page, this.state.page_size, this.state.sort_type))
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var shotsForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData) {
          resultsCache.totalForQuery[query] = shotsForQuery.length;
        } else {
          for (var i in responseData) {
            shotsForQuery.push(responseData[i]);
          }
          resultsCache.dataForQuery[query] = shotsForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },

  getDataSource: function(shots: Array<any>): ListView.DataSource {
    
    return this.state.dataSource.cloneWithRows(shots);
  },

  selectShot: function(shot: Object) {

    this.props.navigator.push({
      component: ShotDetails,
      passProps: {shot},
      navigationBar: <NavigationBar 
        title={shot.title}
        onPrev={() => {
          console.log(111);
          this.props.navigator.pop();
        }}
        />
    });
  },

  renderFooter: function() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    return <ActivityIndicatorIOS 
      style={styles.scrollSpinner}
      size="small"
       />;
  },

  renderRow: function(shot: Object)  {
  
    if(this.state.rowCellsCnt == 1) {
      return (
        <ShotOneCellRow
          onSelect={() => this.selectShot(shot)}
          shot={shot}
        />
      );
    } else if(this.state.rowCellsCnt == 3) {
      return (
        <ShotThreeCellRow
          onSelect={() => this.selectShot(shot)}
          shot={shot}
        />
      );
    } else if(this.state.rowCellsCnt == 2) {
      return (

        <ShotTwoCellRow
          onSelect={() => this.selectShot(shot)}
          shot={shot}
        />
      );
    }  
  },

  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <Loading/> :
      <ListView
        ref="listview"
        initialListSize={20}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}

      />;

    return (
      <View style={styles.container}>
        <NavigationBar 
          ref="navBar"
          navigator={this.props.navigator} 
          title={this.props.title} 
          hidePrev={true}
          customNext={<CustomNext handleModalOpen={this.handleModalOpen}/>}
          isReloading={this.state.isReLoading || this.state.isLoadingTail}/>

        <View style={styles.separator} />

        {content}
        <Modal isVisible={this.state.isModalOpen}
                 onClose={this.closeModal}
                 backdropType="plain"
                 forceToFront={true}
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

            <View style={styles.modalResizeRow}>
              {this._renderModalResizeRow()}
            </View>

            <View style={styles.modalSortRow}>
              {this._renderModalSortRow()}
            </View>

            <View style={styles.modalRow}>
              {this._renderModalRow()}
         
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

var Loading = React.createClass({
  render: function() {
    return (
      <View style={[styles.container, styles.centerText]}>
        <ActivityIndicatorIOS
            animating={this.props.isLoading}
            style={styles.spinner}
            size="large"
          />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  centerText: {
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  reload_spinner: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: -30,
    left: 30,
  },
  spinner: {
    marginTop:100,
    width: 100,
  },
  scrollSpinner: {
    marginVertical: 20,
    marginBottom: 50,
    width: 100,
  },

  modalContainer: {
 
    height: screen.height - 200,
    flex: 1,
  },
  modalResizeRow: {

    marginTop: 40,
    alignItems: 'flex-start',
    justifyContent: 'space-around',

    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  modalSortRow: {

    marginTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-around',

    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalRow: {

    marginTop: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-around',

    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 40,
  },
  modalIcon: {
    alignItems: 'center',
    width: 80,
    marginBottom: 10,
  },
  modalIconText: {
    color: '#333'
  },
  navBarRightButtonContainer: {
    position: 'absolute',
    right: 0, 
    bottom: 13,
    width: 50,
    paddingLeft: 10,
    alignItems: 'center'
  },
  navBarRightButton: {
    width: 24, 
    height: 24, 
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 60,
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

module.exports = ShotList;
