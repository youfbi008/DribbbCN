'use strict';

module.exports = {
  shotTeaserImage: function(shot: Object): {uri: ?string} {

    var uri = shot.images.teaser;
    // TODO 可考虑图片右上角加GIF标识小图标

    // var uri = shot && shot.image_400_url ? shot.image_400_url : shot.image_url;
    return {uri};
  },
  shotNormalImage: function(shot: Object): {uri: ?string} {

    var uri = shot.images.normal.toLowerCase();
    var ext = uri.substr(uri.lastIndexOf('.') + 1);
    if(ext == 'gif') {
      uri = shot.images.teaser;
    }
    // var uri = shot.images.normal;

    // console.log(uri);

    return {uri};
  },
  shotHidpiImage: function(shot: Object): {uri: ?string} {

    var uri = shot.images.hidpi;

    if(uri == null || uri == "") {
        uri = shot.images.normal;
    }

    if(uri == null || uri == "") {
        uri = shot.images.teaser;
    } else {
      var ext = uri.toLowerCase().substr(uri.lastIndexOf('.') + 1);
      if(ext == 'gif') {
        uri = shot.images.teaser;
        if(uri == null || uri == "") {
          uri = shot.images.normal;
        }
      }
    }
    
    
    return {uri};
  },
  shotPopImage: function(shot: Object): {uri: ?string} {

    // var uri = shot.images.normal.toLowerCase();
    // var ext = uri.substr(uri.lastIndexOf('.') + 1);
    // if(ext == 'gif') {
    var uri = shot.images.hidpi;

    if(uri == null || uri == "") {
        uri = shot.images.normal;
    }
    // }
    return {uri};
  },
  randomFileName: function(image_url: string): {image_url: ?string, timeInMs: ?integer} {

    var timeInMs = Date.now();
    if(image_url.indexOf('?t=') > 0) {
      image_url = image_url.substring(0, image_url.indexOf('?t='));
    }
    image_url = image_url + '?t=' + timeInMs;

    return {image_url, timeInMs};
  },
  checkGif: function(shot: Object) {

    var uri = shot.images.normal.toLowerCase();
    var ext = uri.substr(uri.lastIndexOf('.') + 1);
    if(ext == 'gif') {
      return true;
    }
    return false;
  },
  authorAvatar: function(player: Object): {uri: ?string} {
    var uri;
    if (player) {
      uri = player.avatar_url;
      return {uri};
    } else {
      uri = require('image!AuthorAvatar');
      return uri;
    }
  }
}
