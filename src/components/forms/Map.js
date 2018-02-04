
import React from 'react'
import $ from 'jquery'
import {Menu, Transition, Checkbox, Button, Icon, Segment, Modal, Header, Divider, Dropdown} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Style from 'react-style-tag';

import api from '../../api';

class MapForm extends React.Component {

    state = { 
        cars: {},
        leftMenuVisible: true,
        errors:{},
        activeCar: [],
        currentLocation: []
    }
    
    

    componentDidMount() {
        const activeCar =[];
        api.admin.cars().then((response)=> {
            this.setState({cars: response})
            Object.keys(response).map(key=> {
                response[key].map(car=> {
                    activeCar.push(car[3]);
                })
            })
            this.setState({activeCar})
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


        api.gps.current().then(res =>{
            this.setState({...this.state, currentLocation: res})
            console.log(this.state.currentLocation)
        });

    }

    componentDidUpdate(){
        console.log('didUpdate')
    }
    

    toggleLeftMenu= () => this.setState({ leftMenuVisible: !this.state.leftMenuVisible })

    deptGroup = (event, data) => {
        const activeCar = this.state.activeCar;
        document.querySelectorAll(`.group-${data.value} input`).forEach(elem => {
            elem.checked=data.checked;
            if(elem.checked){
                if(activeCar.indexOf(elem.value) === -1){
                    activeCar.push(elem.value);
                }
            }else if(activeCar.indexOf(elem.value) > -1){
                activeCar.splice(activeCar.indexOf(elem.value), 1);
            }
        })

        console.log(activeCar)
        this.setState({...this.state, activeCar});
        
    }

    carCB = (event,data) =>{
        const activeCar = this.state.activeCar;
        if(data.checked){
            if(activeCar.indexOf(data.value) === -1){
                activeCar.push(data.value);
            }
        }else{
            activeCar.splice(activeCar.indexOf(data.value), 1)
        }
        console.log(activeCar)
        this.setState({...this.state, activeCar});
    }

    render() {
        const {cars, leftMenuVisible, errors, activeCar, currentLocation} = this.state
        return (
            <div>
                <Style>{`
                    #map{
                        height:94.5vh;
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
                    .divider-k-0{
                        margin: 0px !important;
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
                        Object.keys(cars).map((dept, index) =>
                            <Menu.Menu>
                                <Menu.Item className="dept-header">
                                    <Checkbox defaultChecked as="h3" label={dept}  value={index} onChange={this.deptGroup}/>
                                </Menu.Item>
                                {
                                    cars[dept].map((car) =>
                                        <div>
                                            <Menu.Item>
                                                <Checkbox checked={activeCar.indexOf(car[3]) !== -1 } className={`car-cb group-${index}`} label={car[1]} value={car[3]} onChange={this.carCB}/>
                                                <span style={{float: 'right', fontSize: 'x-small', padding: '5px'}}>{`${
                                                        currentLocation[car[3]] ? `${currentLocation[car[3]].Speed} KPH`: 'N/A'
                                                    }`}
                                                </span>
                                                
                                            </Menu.Item>
                                            <Divider className='divider-m-0'/>
                                        </div>
                                    )

                                }
                            </Menu.Menu>
                        )
                    }
                    </Menu>
                </Transition>
                <Segment.Group horizontal className="car-details">
                    <Segment>First</Segment>
                    <Segment>
                        <div id="map-street-view" style={{height:'100%'}}/>
                    </Segment>
                </Segment.Group>

                {
                    errors.statusText && 
                    <Modal open='true' basic size='fullscreen'>
                        <Header textAlign='center' size='huge' content='Something went wrong!' />
                        <Header textAlign='center' size='huge' content={errors.status} className='header-p-0' />
                        <Header textAlign='center' size='huge' content={errors.statusText} />
                    </Modal>
                }
            </div>
        )
    }
}

export default MapForm;