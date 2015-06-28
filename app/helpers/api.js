var API_URL = 'https://api.dribbble.com/v1/shots';
var access_token = '276b3a7e2b79cc39b1601b5641b4a3baab91b00ee7439e46cd00a90b08f0a176';
var per_page = 12;
module.exports = {
 getShotsByType: function(query: string, pageNumber: ?number, page_size: string, sort_type: string ): string {
 	var option_type = "";
 	if(query != 'popular') {
 		option_type = 'list=' + query + '&';
 	}
 	if(sort_type != "popular" && sort_type != undefined) {
 		option_type += 'sort=' + sort_type + '&';
 	}
 	if(page_size != "" && page_size != undefined) {
 		per_page = page_size;
 	}
 	

 	var url_log = API_URL + '?' + option_type  + 'per_page=' + per_page + '&page=' + pageNumber;
 	url_log += '&access_token=' + access_token;
 	// console.log('get new page shots.');
 	// console.log(url_log);
    return (
      url_log
    );
  }
};
