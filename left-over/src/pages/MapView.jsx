import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../context/LocationContext';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const { userLocation, loading, error } = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const center = userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.2090];

  return (
    <div className="h-[calc(100-64px)] w-full">
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error} (Showing default location)
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={center}>
            <Popup>
              You are here! <br /> Looking for leftovers nearby.
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-2">Nearby Food Listings</h2>
        <p className="text-gray-600">Explore the map to find available food donations in your area.</p>
      </div>
    </div>
  );
};

export default MapView;