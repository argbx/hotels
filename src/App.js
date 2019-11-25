import React, {useEffect} from 'react';
import './App.css';
import HotelsStore from "./stores/hotelsStore";
import HotelsList from './components/hotelsList'

const App = () => {


  // Initial load get all the hotels with 3 stars
  useEffect(() => {
    HotelsStore.instance().loadHotelsList("?min_stars=3");
  },[]);

  return (
      <div className="App">
        <HotelsList/>
      </div>
  );
};

export default App;
