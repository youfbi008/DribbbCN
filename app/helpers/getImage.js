'use strict';

module.exports = {
  shotImage: function(shot: Object): {uri: ?string} {

    var uri = shot.images.teaser;
    // TODO 可考虑图片右上角加GIF标识小图标

    // var uri = shot && shot.image_400_url ? shot.image_400_url : shot.image_url;
    return {uri};
  },
  shotDetailImage: function(shot: Object): {uri: ?string} {

    var uri = shot.images.normal;

    console.log(uri);

    return {uri};
  },
  shotPopImage: function(shot: Object): {uri: ?string} {

    var uri = shot.images.normal.toLowerCase();
    var ext = uri.substr(uri.lastIndexOf('.') + 1);
    if(ext == 'gif') {
      uri = shot.images.hidpi;
    }
    return {uri};
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
