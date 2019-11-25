import React from 'react';
import { shallow } from 'enzyme';
import HotelsList from './../components/hotelsList';
describe('HotelsList', () => {
    it('should render correctly', () => {
        const component = shallow(<HotelsList debug />);

        expect(component).toMatchSnapshot();
    });
});
