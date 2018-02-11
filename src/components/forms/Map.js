
import React from 'react'
import { Menu, Transition, Checkbox, Grid, Segment, Modal, Header } from 'semantic-ui-react';
// import PropTypes from 'prop-types';

import Style from 'react-style-tag';

import api from '../../api';

class MapForm extends React.Component {

    state = { 
        cars: {},
        leftMenuVisible: true,
        errors:{},
        activeCar: [],
        currentLocation: [],
        activeItem: {},
        map: '',
        mapMarker: [],
    }
    
    

    componentDidMount() {
        const activeCar = [];
        const mapMarker = [];
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: new window.google.maps.LatLng(14.157895, 121.139377),
            zoom: 13,
            mapTypeId: 'roadmap',
            streetViewControl: false
        })

        const panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('map-street-view'), {
                pov: {
                    heading: 34,
                    pitch: 0
                },
                motionTracking: false,
                linksControl: false,
                panControl: false,
                enableCloseButton: false,
                streetViewControl: false,
                fullscreenControl: false,
                disableDefaultUI: true,
            }
        );

        api.admin.cars().then((response)=> {
            this.setState({cars: response})
            Object.keys(response).map(key=> {
                response[key].map(car=> {

                    activeCar.push(car[3]);

                    // create marker element each car
                    mapMarker.push({
                        car: car[3],
                        marker: new window.google.maps.Marker({
                            map,
                            animation       : window.google.maps.Animation.DROP,
                            preserveViewport: true,
                            title           : car[1],
                            visible         : true
                        })
                    });

                    return true;
                })
                return true;
            })
            this.setState({activeCar})
        }).catch(error=>{
            this.setState({errors: error.response})
        })

        

        api.gps.current().then(res =>{
            Object.keys(res).map((k) => 
                Object.keys(mapMarker).map((i) =>
                    {
                        if(mapMarker[i].car === k){
                            mapMarker[i].marker.setPosition(new window.google.maps.LatLng(res[k].lat, res[k].lon))
                        }

                        return true;
                    }
                )
            )

            this.setState({...this.state, currentLocation: res, mapMarker, map, panorama})
        });

        setInterval(() => {
            api.gps.current().then(res =>{
                Object.keys(res).map(k => 
                    Object.keys(mapMarker).map(i =>{
                        if(mapMarker[i].car === k){
                            mapMarker[i].marker.setPosition(new window.google.maps.LatLng(res[k].lat, res[k].lon))
                        }
                        return true;
                    })
                )
                this.setState({...this.state, currentLocation: res, mapMarker, map})
            });
        }, 60000); // milliseconds
    }

    componentDidUpdate(){
        
    }

    toggleLeftMenu= () => this.setState({ leftMenuVisible: !this.state.leftMenuVisible })

    deptGroup = (event, data) => {
        const activeCar = this.state.activeCar;
        document.querySelectorAll(`.group-${data.value} input`).forEach(elem => {
            const carSelect=data.checked;
            if(carSelect){
                if(activeCar.indexOf(elem.value) === -1){
                    activeCar.push(elem.value);

                    Object.keys(this.state.mapMarker).map(i =>{
                        if(this.state.mapMarker[i].car === elem.value) this.state.mapMarker[i].marker.setVisible(true); return true
                    })
                }
            }else if(activeCar.indexOf(elem.value) > -1){
                activeCar.splice(activeCar.indexOf(elem.value), 1);

                Object.keys(this.state.mapMarker).map(i =>{
                    if(this.state.mapMarker[i].car === elem.value) this.state.mapMarker[i].marker.setVisible(false); return true
                })
            }
        })

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
        this.setState({...this.state, activeCar});
    }

    handleItemClick = (e, { name, department, number }) => {
        const {panorama, map, currentLocation} = this.state;
        this.setState({ activeItem: {
            name,
            department,
            number
        }})
        
        if(currentLocation[number] !== undefined){
            panorama.setPosition(
                new window.google.maps.LatLng(currentLocation[number].lat, currentLocation[number].lon)
            )
            panorama.setVisible(true);
    
            map.setStreetView(panorama);
        }
    }

    render() {
        const {cars, leftMenuVisible, errors, activeCar, currentLocation, activeItem} = this.state
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
                        background-color: rgba(34,36,38,.1) !important;
                    }
                    .car-details{
                        position: fixed !important;
                        bottom  : 0px !important;
                        right    : 0px !important;
                        height  : 23vh !important;
                        width   : 50vw;
                    }
                    .divider-k-0{
                        margin: 0px !important;
                    }
                    .left-menu-k {
                        height    : 95vh !important;
                        top       : 42px !important;
                        left      : 1px !important;
                        overflow-y: auto;
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
                                        <Menu.Item department={dept} number={car[3]} name={car[1]} onClick={this.handleItemClick} active={activeItem.name === car[1]} style={{borderTop:'1px solid rgba(34,36,38,.15)'}}>
                                            <Checkbox checked={activeCar.indexOf(car[3]) !== -1 } className={`car-cb group-${index}`} value={car[3]} onChange={this.carCB}/>
                                            <span style={{fontSize: 'x-small', padding: '5px', position:'absolute'}}>
                                                {car[1]}
                                            </span>
                                            <Transition animation='pulse' duration={'500'} visible mountOnShow transitionOnMount>
                                                <span style={{float: 'right', fontSize: 'x-small', padding: '5px'}}>
                                                    {`${
                                                        currentLocation[car[3]] ? `${currentLocation[car[3]].Speed} KPH`: 'N/A'
                                                    }`}
                                                </span>
                                            </Transition>
                                        </Menu.Item>
                                    )
                                }
                            </Menu.Menu>
                        )
                    }
                    </Menu>
                </Transition>
                <Segment.Group compact horizontal className="car-details" style={{display: `${activeItem.name ? '' : 'none' }` }}>
                    <Segment style={{width:'80px'}}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    {`Car: ${activeItem ? activeItem.name : ''}`}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment>
                        <div id="map-street-view" style={{height:'100%', margin: '0px !important'}}/>
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