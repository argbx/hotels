import { action,observable } from 'mobx';

// Import API
import API from '../utils/api';

export default class HotelsStore {
    static _instance: HotelsStore;

    @observable hotels = [];
    @observable reviews = [];
    @observable loadError = false;

    constructor() {
        this.hotels = [];
        this.reviews = [];
        this.loadError = false;
    }

    static instance = () => (HotelsStore._instance = HotelsStore._instance || new HotelsStore());

    @action
    loadHotelsList(params) {
        API.get('getHotelsList',params)
            .then((result) => this.loadHotelsListSuccess(result))
            .fail((err) => {
                console.log("err", err);
                this.loadError = true
            });
    }

    @action
    loadHotelsListSuccess(result) {
        this.hotels = result;
    }

    @action
    loadReviews(params) {
        API.get('getReviews',params)
            .then((result) => this.loadReviewsSuccess(result))
            .fail((err) => {
                console.log("err", err);
            });
    }

    @action
    loadReviewsSuccess(result) {
        this.reviews = result;
    }
}

