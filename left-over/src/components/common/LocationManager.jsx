import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../../context/LocationContext';
import toast from 'react-hot-toast';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Internal Map Component to handle clicks and center updates
const MapEvents = ({ onMapClick, center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);

    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const LocationManager = () => {
    const { userLocation, locationSource, refreshLocation, updateUserLocation } = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempCoords, setTempCoords] = useState({ lat: '', lng: '' });
    const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);

    useEffect(() => {
        if (userLocation) {
            setTempCoords({
                lat: userLocation.lat.toFixed(6),
                lng: userLocation.lng.toFixed(6)
            });
            setMapCenter([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation, isModalOpen]);

    const handleSave = () => {
        const lat = parseFloat(tempCoords.lat);
        const lng = parseFloat(tempCoords.lng);

        if (isNaN(lat) || isNaN(lng)) {
            toast.error('Please enter valid coordinates');
            return;
        }

        updateUserLocation(lat, lng, 'Manual');
        setIsModalOpen(false);
    };

    const handleMapClick = (latlng) => {
        setTempCoords({
            lat: latlng.lat.toFixed(6),
            lng: latlng.lng.toFixed(6)
        });
    };

    const handleUseGPS = () => {
        refreshLocation();
        // The context update will trigger the useEffect to update tempCoords
    };

    return (
        <div className="mb-6">
            {/* Minimalist Status Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                        📍
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your Current Location</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Locating...'}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${locationSource === 'GPS' ? 'bg-green-100 text-green-700' :
                                    locationSource === 'Manual' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {locationSource}
                            </span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Change Location
                </button>
            </div>

            {/* Manager Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px]">

                        {/* Left Side: Map Picker */}
                        <div className="flex-1 relative h-64 md:h-auto">
                            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapEvents onMapClick={handleMapClick} center={mapCenter} />
                                <Marker position={[parseFloat(tempCoords.lat) || mapCenter[0], parseFloat(tempCoords.lng) || mapCenter[1]]} />
                            </MapContainer>
                            <div className="absolute top-4 left-4 z-[1001] bg-white p-2 rounded-lg shadow-md text-xs font-bold text-gray-600">
                                Tip: Click on the map to pick a location
                            </div>
                        </div>

                        {/* Right Side: Manual Controls */}
                        <div className="w-full md:w-80 p-6 flex flex-col bg-gray-50 border-l border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Set Location</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                            </div>

                            <button
                                onClick={handleUseGPS}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition mb-6 shadow-lg shadow-primary-200"
                            >
                                🛰️ Use My GPS
                            </button>

                            <div className="space-y-4 flex-1">
                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Latitude</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={tempCoords.lat}
                                        onChange={(e) => setTempCoords({ ...tempCoords, lat: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition"
                                        placeholder="28.6139"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Longitude</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={tempCoords.lng}
                                        onChange={(e) => setTempCoords({ ...tempCoords, lng: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition"
                                        placeholder="77.2090"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 italic">
                                    Enter manually or pick a spot on the map.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-green-100"
                                >
                                    Confirm This Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationManager;
