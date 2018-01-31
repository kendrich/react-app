
import React from 'react'

import {Menu, Transition, Checkbox, Button, Icon, Segment} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";
import Style from 'react-style-tag';

import api from '../../api';

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoia2VuZHJpY2gzMSIsImEiOiJjamQycXR5eXEzaTNrMnlvNWhqYjhzd296In0.Hy7UXGBXXqgYV4-mn-xfAg"
});

class MapForm extends React.Component {

    state = { 
        key:'AIzaSyC9CYpKCszxzjravo3t5LN2PdfJcj9ErWA',
        mapStyle : "mapbox://styles/mapbox/streets-v9",
        center: {
            lat: 40.7446790,
            lng: -73.9485420
        },
        zoom: 11,
        cars: {},

        leftMenuVisible: true,
    }

    

    componentDidMount() {
        api.admin.cars().then((response)=> {
            this.setState({cars: response})
        })

        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 13,
            mapTypeId: 'roadmap',
        });
    }
    

    toggleLeftMenu= () => this.setState({ leftMenuVisible: !this.state.leftMenuVisible })


    render() {
        const { cars, leftMenuVisible, center,zoom, key, mapStyle } = this.state
        return (
            <div>
                <Style>{`
                    .google-map {
                        height:95vh;
                        width:100%;
                    }
                    .left-menu-k{
                        width:330px !important;
                    }
                    .car-cb{
                        font-size:1em !important;
                    }
                    .dept-header{
                        background-color: rgba(34,36,38,.1) !important;;
                    }
                    .car-details{
                        position: fixed !important;
                        bottom  : 0px !important;
                        left    : 0px !important;
                        height  : 18vh !important;
                        width   : 50vw;
                    }
                    
                `}</Style>
                <Menu className="home-menu">
                    <Menu.Item icon="bars" onClick={this.toggleLeftMenu} />
                    <Menu.Item name='home'/>
                </Menu>

                

                <Map style={mapStyle}
                    containerStyle={{
                        height: "95vh",
                        width: "100vw"
                    }}
                />
                
                <Transition visible={leftMenuVisible} animation='horizontal flip' duration={500}>
                    <Menu vertical fixed="left" className="left-menu-k">
                    {
                        Object.keys(cars).map((dept) =>
                            <Menu.Menu>
                                <Menu.Item className="dept-header">
                                    <Checkbox as="h3" label={dept}/>
                                </Menu.Item>

                                {
                                    cars[dept].map(car=> 
                                        <Menu.Item>
                                            <Checkbox className="car-cb" label={car[1]} />
                                        </Menu.Item>
                                    )
                                }
                            </Menu.Menu>
                        )
                    }
                        
                    </Menu>
                </Transition>
                <Segment.Group horizontal className="car-details">
                    <Segment>Left</Segment>
                    <Segment>Middle</Segment>
                    <Segment>
                        Right
                    </Segment>
                </Segment.Group>
            </div>
        )
    }
}

export default MapForm;