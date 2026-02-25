import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const foodIcon = L.divIcon({
    html: '<div style="font-size:28px;text-align:center">🍽️</div>',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    className: ''
});

const ngoIcon = L.divIcon({
    html: '<div style="font-size:28px;text-align:center">🏢</div>',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    className: ''
});

// Auto-fit map bounds
const FitBounds = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length >= 2) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions, map]);
    return null;
};

// Live update user position
const LivePosition = ({ onUpdate }) => {
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                onUpdate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => { },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [onUpdate]);
    return null;
};

const FoodTrackingMap = ({ foodItem, onClose }) => {
    const [myLocation, setMyLocation] = useState(null);

    const foodLocation = foodItem?.latitude && foodItem?.longitude
        ? { lat: parseFloat(foodItem.latitude), lng: parseFloat(foodItem.longitude) }
        : null;

    // Calculate distance in km
    const getDistance = (p1, p2) => {
        if (!p1 || !p2) return null;
        const R = 6371;
        const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
        const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos((p1.lat * Math.PI) / 180) * Math.cos((p2.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
        return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
    };

    const distance = getDistance(myLocation, foodLocation);
    const defaultCenter = foodLocation || { lat: 28.6139, lng: 77.209 };
    const positions = [];
    if (myLocation) positions.push([myLocation.lat, myLocation.lng]);
    if (foodLocation) positions.push([foodLocation.lat, foodLocation.lng]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">📍 Live Tracking — {foodItem.title}</h2>
                        <p className="text-primary-100 text-sm">
                            {foodItem.address || 'Pickup location'}
                            {distance && <span className="ml-3 bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-bold">{distance} km away</span>}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white text-2xl hover:opacity-80">✕</button>
                </div>

                {/* Map */}
                <div style={{ height: '400px' }}>
                    <MapContainer center={[defaultCenter.lat, defaultCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Food location marker */}
                        {foodLocation && (
                            <Marker position={[foodLocation.lat, foodLocation.lng]} icon={foodIcon}>
                                <Popup>
                                    <strong>🍽️ {foodItem.title}</strong><br />
                                    {foodItem.address && <span>📍 {foodItem.address}<br /></span>}
                                    {foodItem.contact_phone && <span>📞 {foodItem.contact_phone}<br /></span>}
                                    {foodItem.pickup_time && <span>⏰ {foodItem.pickup_time}</span>}
                                </Popup>
                            </Marker>
                        )}

                        {/* My location marker */}
                        {myLocation && (
                            <Marker position={[myLocation.lat, myLocation.lng]} icon={ngoIcon}>
                                <Popup><strong>🏢 You are here</strong></Popup>
                            </Marker>
                        )}

                        {/* Line between locations */}
                        {positions.length === 2 && (
                            <Polyline positions={positions} pathOptions={{ color: '#16a34a', weight: 3, dashArray: '10, 10' }} />
                        )}

                        {positions.length >= 2 && <FitBounds positions={positions} />}
                        <LivePosition onUpdate={setMyLocation} />
                    </MapContainer>
                </div>

                {/* Info Panel */}
                <div className="p-4 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-2xl mb-1">📦</div>
                        <div className="text-gray-500">Quantity</div>
                        <div className="font-bold">{foodItem.quantity || 'N/A'}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-2xl mb-1">📞</div>
                        <div className="text-gray-500">Contact</div>
                        <div className="font-bold">{foodItem.contact_phone || 'N/A'}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-2xl mb-1">⏰</div>
                        <div className="text-gray-500">Pickup By</div>
                        <div className="font-bold">{foodItem.pickup_time || 'N/A'}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-2xl mb-1">📏</div>
                        <div className="text-gray-500">Distance</div>
                        <div className="font-bold">{distance ? `${distance} km` : 'Locating...'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodTrackingMap;
