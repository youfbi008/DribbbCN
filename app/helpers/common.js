'use strict';

module.exports = {

  waitReload: function() {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, 500);
    });
  },

  //getResizeTitle: function(title: string, screen_width) {
  //  // alert(screen_width );
  //  var maxlimit = 36;
  //  if(screen_width > 320 && screen_width <= 375) {
  //    maxlimit = 36;
  //  }
  //  var newTitle = (title.length > maxlimit) ?
  //  (((title).substring(0, maxlimit)) + '...') :
  //  title;
  //
  //  return newTitle;
  //},
}
