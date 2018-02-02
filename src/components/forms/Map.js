
import React from 'react'

import {Menu, Transition, Checkbox, Button, Icon, Segment, Modal, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Style from 'react-style-tag';

import api from '../../api';

class MapForm extends React.Component {

    state = { 
        cars: {},
        leftMenuVisible: true,
        errors:{}
    }

    

    componentDidMount() {
        api.admin.cars().then((response)=> {
            this.setState({cars: response})
        }).catch(error=>{
            this.setState({errors: error.response})
        })

        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -33.8688,
                lng: 151.2195
            },
            zoom: 13,
            mapTypeId: 'roadmap',
        });


        const panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('map-street-view'), {
                position: {
                    lat: -33.8688,
                    lng: 151.2195
                },
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });
        map.setStreetView(panorama);

    }
    

    toggleLeftMenu= () => this.setState({ leftMenuVisible: !this.state.leftMenuVisible })


    render() {
        const {cars, leftMenuVisible, errors} = this.state
        return (
            <div>
                <Style>{`
                    #map{
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
                        height  : 23vh !important;
                        width   : 50vw;
                    }
                    
                `}</Style>
                <Menu className="home-menu">
                    <Menu.Item icon="bars" onClick={this.toggleLeftMenu} />
                    <Menu.Item name='home'/>
                </Menu>
                <div id='map'/>
                
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
                        <div id="map-street-view" style={{height:'100%'}}/>
                    </Segment>
                </Segment.Group>

                {
                    errors.statusText && 
                    <Modal open='true' basic size='fullscreen'>
                        <Header textAlign='center' size='huge' content='Something went wrong!' />
                        <Header textAlign='center' size='huge' content={errors.status} />
                        <Header textAlign='center' size='huge' content={errors.statusText} />
                    </Modal>
                }
            </div>
        )
    }
}

export default MapForm;