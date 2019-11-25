import React, {useState,useEffect} from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash'
import ReactList from 'react-list';
import './main.css'
import Modal from 'react-modal';

import HotelsStore from "../../stores/hotelsStore";
import Img from 'react-image'
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import InputRange from 'react-input-range';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const HotelsList = observer((props) => {
    const [filteredHotels, setFilteredHotels] = useState([]);
    const options = [
        {label:'Ascending',value:'asc'}, {label:'Descending',value:'desc'}
    ]
    const StarOptions = [
        {label:"*",value:'1'}, {label:"**",value:'2'},{label:"***",value:'3'},{label:"****",value:'4'},{label:"*****",value:'5'},
    ]
    //<i className="fa fa-star">
    const [sortValue, setSortValue] = useState("");
    const [starValue, setStarValue] = useState("3");
    const [rangeValue, setRangeValue] = useState(null);
    const [modal, SetModal] = useState(false);
    const [selectedId, SetSelectedId] = useState(null);

     useEffect(() => {
          setFilteredHotels(HotelsStore.instance().hotels)
      },[HotelsStore.instance().hotels] );

    const onSelect = (order,param) => {
        if(order === 'order'){
            setSortValue(param.value)
            setFilteredHotels(_.orderBy(HotelsStore.instance().hotels,"price",param.value))
        } else {
            setStarValue(param.value)
            HotelsStore.instance().loadHotelsList(`?min_stars=${param.value}`);
        }
    };

    const onSelectRange = (param) => {
        setSortValue("")
        setStarValue("")
        setRangeValue(param.value)
        HotelsStore.instance().loadHotelsList(`?max_price=${param.value}`);
    };

    const renderImages = (index) => (
        <Img
            loader={ <img src='/loader.gif' />}
            src={filteredHotels[index].images}
            onError={(e) => e.target.src= _.last(filteredHotels[index].images)}
            className="img-responsive h_image" alt="hotel"
        />
    )
    const showReviews = (id) => {
        HotelsStore.instance().loadReviews(id);

        SetModal(true);
        SetSelectedId(id)
    }

    const renderReviews = (review) => {
        const type = review.positive ? <i class="fa fa-thumbs-up"/> : <i class="fa fa fa-thumbs-down"/>

        return (
            <div style={{background:'#cdd8d8'}}>
                <span className="c_type pull-right">
                    {type}
                </span>
                <p>Name: {review.name}</p>
                <p>Comment: {review.comment}</p>
            </div>
        )

    }

    const renderHotel = (index,key) => {
        return(
            <div className="row" key={key}>
                <div className="hotelBox" id= {`hotel_${key}`}>
                    <div className="col-md-4 no-pad">
                        <div className="hotel_image">
                            {renderImages(index)}
                        </div>
                    </div>
                    <div className="col-md-8 no-pad">
                        <div className="hotel_details">
                            <div className="row">
                                <div className="col-md-9 ">
                                    <div className="row">
                                        <div className="col-md-12 ">
                                            <h3 className="h_name pull-left">
                                                {filteredHotels[index].name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 ">
                      <span className="h_location pull-left">
                        {filteredHotels[index].city} - {filteredHotels[index].country}
                      </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 ">
                  <span className="h_rating pull-right">
                    {
                        _.times(filteredHotels[index].stars, () =><i className="fa fa-star"/> )
                     }
                  </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 ">
                                    <p className="h_description pull-left">
                                        {filteredHotels[index].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="hotel_details">
                            <div className="row">
                                <div className="col-md-5 ">
                                    <button
                                        type="button" className="btn btn-default load_reviews"
                                        data-toggle="collapse" id={`loader_${key}`} data-hotel-id={filteredHotels[index].id}
                                        onClick={() => showReviews(filteredHotels[index].id)}>
                                        Show Reviews
                                    </button>

                                </div>
                                <div className="col-md-7 ">
                                    <div className="row">
                                        <div className="col-md-12 ">
                                            <h3 className="h_price pull-right">
                                                ${filteredHotels[index].price}&nbsp;&euro;
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 ">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 hotel_reviews no-pad">
                        <div id={key} className="reviewBox collapse col-md-12"/>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div>
            {HotelsStore.instance().loadError ?
            <p>Error occurred, please reload</p>
                :
                <div>
                    <h1>Hotels List</h1>
                    <div>
                        <Modal
                            isOpen={modal}
                            onRequestClose={() =>SetModal(false)}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >

                            <h2 >Reviews for {_.get(_.find(filteredHotels,{id:selectedId}),'name')}</h2>
                            <button onClick={() =>SetModal(false)}>close</button>
                            {!_.isEmpty(HotelsStore.instance().reviews) && (
                                <div>{_.size(_.filter(HotelsStore.instance().reviews,{positive:true}))} Positive, {_.size(_.filter(HotelsStore.instance().reviews,{positive:false}))} Negative Reviews</div>
                            )}

                            {_.isEmpty(HotelsStore.instance().reviews) ? "No Reviews" : _.map(HotelsStore.instance().reviews,renderReviews)}
                        </Modal>
                    </div>
                    <div style={{maxWidth:"200px",margin:"auto"}} >
                        Max Price:

                        <InputRange
                            style={{maxWidth:"200px"}}
                            maxValue={1000}
                            minValue={0}
                            value={rangeValue}
                            onChange={value => onSelectRange({ value })} />
                        Order by Price:
                        <Dropdown style={{maxWidth:"200px"}} options={options} onChange={(value) => onSelect("order",value)} value={sortValue} placeholder="Select an option" />
                        Minimum Stars:
                        <Dropdown style={{maxWidth:"200px"}} options={StarOptions} onChange={ (value) => onSelect("min_stars",value)} value={starValue} placeholder="Select an option" />

                    </div>
                    <div>
                        <section  className="hotel_list">
                            <ReactList
                                itemRenderer={renderHotel}
                                length={_.size(filteredHotels)}
                                pageSize={5}
                                type='simple'
                            />
                        </section>
                    </div>
                </div>

            }


        </div>
    )
})

export default HotelsList
