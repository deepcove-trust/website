import React, { Component } from 'react';
import mapboxgl, { Map, Marker, Popup } from 'mapbox-gl';
import $ from 'jquery';

const typeLabels = ['Informational', 'Count Activity', 'Photograph Activity', 'Picture Select Activity', 'Picture Tap Activity', 'Text Answer Activity'];

export default class MapBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapLoaded: false,
            markersLoaded: false,
            currentMarker: null,
            isDragging: false,
            geojson: null,
            onDragCallback: null,
            onDropCallback: null
        }
    }

    componentDidUpdate(prevProps) {

        // Add markers to the map when they are ready and the map has loaded
        if (this.props.activities && this.state.mapLoaded && !this.state.markersLoaded) {
            this.initMarkers();
        }

        // Fly to bounds of the track, with some padding
        if (this.props.bbox && !prevProps.bbox) {
            this.map.fitBounds(this.props.bbox, {
                padding: 80
            })
        }

        // If activities have updated, or a new one has been selected, update the map layer
        if ((this.props.activities != prevProps.activities && this.state.mapLoaded) || (this.props.selectedActivityId != prevProps.selectedActivityId)) {
            let geojson = this.generateGeojson();
            this.setState({ geojson });
            this.map.getSource('activities').setData(geojson);
        }
    }

    componentDidMount() {

        // Retrieve map box token from DOM
        mapboxgl.accessToken = $('#react_app_tracks').data('mapboxToken');

        // Initiate the map
        this.map = new Map({
            container: this.mapContainer,
            style: 'mapbox://styles/jacksos101/ck3ljp7dy4uq11cl3gjiszzin',
            center: [167.155695, -45.463983],
            zoom: 12,
            minZoom: 8,
            maxZoom: 20,
            maxPitch: 0,
            maxBounds: [[167.012, -45.553], [167.293, -45.368]],
            dragRotate: false,
            keyboard: false
        });

        // Update state when the map has loaded, so that we know it is safe to add markers
        this.map.on('load', () => {
            this.setState({ mapLoaded: true });
        });

        // Put callback refs into state for use by the onMarkerDrop function
        // (otherwise you can never drop a marker)
        this.setState({
            onDragCallback: this.onMarkerDrag.bind(this),
            onDropCallback: this.onMarkerDrop.bind(this)
        })

        // Set on-click handler, will report its lngLat back to TrackDetails
        this.map.on('click', (ev) => {

            if (this.state.currentMarker == null) {
                this.props.onMarkerClick(null);
            };

            this.props.onMapClick(ev.lngLat); 
        });
    }

    componentWillUnmount() {
        this.map.remove();
    }

    onMarkerDrag(e) {
        let coords = e.lngLat;
        this.map.getCanvas().style.cursor = 'grabbing';

        this.setState({
            isDragging: true
        });

        let geojson = this.state.geojson;
        geojson.features[this.state.currentMarker].geometry.coordinates = [coords.lng, coords.lat];

        // Update state, essentially for both the react component, and the map
        this.setState({ geojson });
        this.map.getSource('activities').setData(geojson);
    }

    onMarkerDrop(e) {

        this.map.getCanvas().style.cursor = '';

        if (this.state.isDragging) {
            this.props.onMarkerDrop(this.state.currentMarker, e.lngLat);
        }        

        this.setState({
            isDragging: false
        });       

        this.map.off('mousemove', this.state.onDragCallback);
        this.map.off('touchmove', this.state.onDragCallback);
    }

    generateGeojson() {        
        return {
            type: 'FeatureCollection',
            features: this.props.activities.map((activity, index) => {
                return {
                    type: 'Feature',
                    active: activity.active,
                    geometry: {
                        type: 'Point',
                        coordinates: [activity.coordX, activity.coordY]
                    },
                    properties: {
                        index: index,
                        id: activity.id,
                        title: activity.title,
                        description: typeLabels[activity.activityType],
                        color: activity.id == this.props.selectedActivityId && activity.active ? '#F5A54B' : activity.active ? '#F44336' : '#999999',
                        icon: activity.active ? '\uf3c5' : '\uf609',
                        halo: activity.id == this.props.selectedActivityId ? 2 : 0
                    }
                }
            })
        }
    }

    initMarkers() {
        let geojson = this.generateGeojson();

        // Add this geojson to state for manipulation by other functions
        this.setState({
            geojson
        });

        // Add geojson to the map
        this.map.addSource('activities', {
            type: 'geojson',
            data: geojson
        });

        // Draw a map marker layer onto the map using the added source
        this.map.addLayer({
            id: 'activities',
            type: 'symbol',
            source: 'activities',
            layout: {
                'text-allow-overlap': true,
                'text-field': '{icon}',
                'text-anchor': 'bottom',
                'text-font': ['Font Awesome 5 Pro Solid'],
                'text-size': 24,
                'text-line-height': 1,
                'text-offset': [0, 0.3]
            },
            paint: {
                'text-color': ['get', 'color'],
                'text-halo-color': 'rgba(255,255,255,255)',
                'text-halo-width': ['get', 'halo']
            }
        })

        // Create the tooltip to appear on hover - don't display yet
        let popup = new Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: 'top'
        });


        // Show popup when mousing over a marker
        this.map.on('mouseenter', 'activities', (e) => {
            this.map.getCanvas().style.cursor = 'pointer';
            let text = e.features[0].properties.title;
            let lngLat = e.features[0].geometry.coordinates.slice();

            if (!this.state.isDragging) {
                popup.setLngLat(lngLat).setHTML(text).addTo(this.map);
                this.setState({
                    currentMarker: e.features[0].properties.index
                });
            }
        })

        // Remove popup when mouse leaves marker
        this.map.on('mouseleave', 'activities', (e) => {
            this.map.getCanvas().style.cursor = '';
            popup.remove();
            if (!this.state.isDragging) {
                this.setState({
                    currentMarker: null
                });
            }
        })

        // When a marker is clicked...
        this.map.on('click', 'activities', (e) => {
            if (!this.state.isDragging) {
                this.props.onMarkerClick(e.features[0].properties.id);
            }
        });

        // When a marker is dragged...
        this.map.on('mousedown', 'activities', (e) => {
            // Stop map from moving
            e.preventDefault();

            // Prevent dragging unless the marker has been previously selected
            if (this.props.selectedActivityId == e.features[0].properties.id) {
                this.map.getCanvas().style.cursor = 'grabbing';

                this.map.on('mousemove', this.state.onDragCallback);
                this.map.once('mouseup', this.state.onDropCallback);
            }
        });

        // Same as above, but for touchscreens
        this.map.on('touchstart', 'activities', (e) => {
            // Abort if more than one finger is touching the screen
            if (e.points.length !== 1) return;

            // Stop map from moving
            e.preventDefault();

            this.setState({
                isDragging: true
            });

            this.map.on('touchmove', this.state.onDragCallback);
            this.map.once('touchend', this.state.onDropCallback);
        });


        this.setState({
            markersLoaded: true
        });
    }

    render() {
        return <div ref={ref => this.mapContainer = ref} className="map-container-inner"></div>
    }
}