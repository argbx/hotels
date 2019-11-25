import _ from 'lodash';
import reqwest from 'reqwest';

/**
 * API class - handles all api related stuff
 */
class API {

    host() {
        return 'http://fake-hotel-api.herokuapp.com/api';
    }

    apiPath(resource, params) {
        switch(resource) {
            case 'getHotelsList':
                return `${this.host()}/hotels${params ? params : ""}`;
            case 'getReviews':
                return `${this.host()}/reviews?hotel_id=${params}`;
            default:
                throw new Error('no valid resource!');
        }
    }

    apiRequest(method, resource, params) {
        const path  =  this.apiPath(resource, params);
        const data  = _.get(params, 'data');

        const requestParams = {
            mode:       'no-cors',
            method:      method,
            url:         path,
            type:        'json',
            contentType: 'text/plain',
            crossOrigin: true,
        };

        if(!!data) {
            requestParams.data = JSON.stringify(data);
        }

        return reqwest(requestParams);
    }

    get(...params) {
        return this.apiRequest('get', ...params);
    }
}

const api = new API();
export default api;
