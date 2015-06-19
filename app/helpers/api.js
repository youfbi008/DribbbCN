var API_URL = 'https://api.dribbble.com/v1/shots';
var access_token = '276b3a7e2b79cc39b1601b5641b4a3baab91b00ee7439e46cd00a90b08f0a176';
var per_page = 10;
module.exports = {
 getShotsByType: function(query: string, pageNumber: ?number): string {
 	var option_type = "";
 	if(query != 'popular') {
 		option_type = 'list=' + query + '&';
 	}

 	var url_log = API_URL + '?' + option_type  + 'per_page=' + per_page + '&page=' + pageNumber;
 	url_log += '&access_token=' + access_token;
 	console.log(url_log);
    return (
      url_log
    );
  }
};
