'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Modal = require('react-native-modal');
var {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} = React;

var api = require('./helpers/api');

var ShotCell = require('./ShotCell');
var ShotTwoCellRow = require('./ShotTwoCellRow');
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

var LOADING = {};

var ShotList = React.createClass({

  getDefaultProps: function() {
    return {
      filter: ''
    };
  },

  getInitialState: function() {
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: this.props.filter,
      queryNumber: 0,
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
   _renderModalRow: function() {

    var modal_row = this.state.modalItemList.map((item) => {
      var category_name = item.name;
      var isValid = this.checkModalIconEvent(category_name);
      var icon = isValid ? item.icon : item.iv_icon ;
      // var navigator = this.refs.nav;
    
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
                    this.props.navigator.push({
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
  componentWillMount: function() {
    this.getShots(this.state.filter);
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

    fetch(api.getShotsByType(query, 1))
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
    fetch(api.getShotsByType(query, page))
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
    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
  },

  renderRow: function(shot: Object)  {
    return (
      // <ShotCell
      //   onSelect={() => this.selectShot(shot)}
      //   shot={shot}
      // />

      <ShotTwoCellRow
        onSelect={() => this.selectShot(shot)}
        shot={shot}
      />
    );
  },

  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <Loading/> :
      <ListView
        ref="listview"
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
           <View style={styles.closeButton}>
              <TouchableOpacity 
                onPress={this.openModal}>
                <Text style={styles.closeButtonText}>菜单</Text>
              </TouchableOpacity>
            </View>
        <View style={styles.separator} />
       
        {content}
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
          />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
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
  spinner: {
    width: 50,
  },
  scrollSpinner: {
    marginVertical: 20,
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
    top: 2,
    left: 240,
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

module.exports = ShotList;
