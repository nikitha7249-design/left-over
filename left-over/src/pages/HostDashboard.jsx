import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from '../context/LocationContext';
import { config } from '../config/env';
import LocationManager from '../components/common/LocationManager';

const HostDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userLocation } = useLocation();
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantity: '',
    food_type: 'veg',
    event_name: '',
    contact_phone: '',
    pickup_time: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const useMyLocation = () => {
    if (userLocation) {
      setForm(prev => ({
        ...prev,
        latitude: userLocation.lat.toString(),
        longitude: userLocation.lng.toString()
      }));
      toast.success(`Coordinates pulled from Location Manager!`);
    } else {
      toast.error('Location not available in manager. Please set it first.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${config.API_URL}/food`, {
        ...form,
        host_id: 1,
        latitude: parseFloat(form.latitude) || null,
        longitude: parseFloat(form.longitude) || null
      });
      if (res.data.success) {
        toast.success('🎉 Food listing created successfully!');
        setForm({
          title: '', description: '', quantity: '', food_type: 'veg',
          event_name: '', contact_phone: '', pickup_time: '', address: '',
          latitude: '', longitude: ''
        });
        setShowForm(false);
      }
    } catch (err) {
      toast.error('Failed to create listing: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/food`);
      setMyListings(res.data);
      setShowListings(true);
    } catch (err) {
      toast.error('Failed to load listings');
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🏢 Host Dashboard</h1>

        <LocationManager />

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Post New Food</h2>
            <p className="text-gray-600 mb-4">Share your leftover food with those in need</p>
            <button className="btn-primary" onClick={() => { setShowForm(!showForm); setShowListings(false); }}>
              {showForm ? '✕ Close Form' : '＋ Post Food'}
            </button>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">My Listings</h2>
            <p className="text-gray-600 mb-4">View and manage your food posts</p>
            <button className="btn-secondary" onClick={() => { fetchMyListings(); setShowForm(false); }}>
              View Posts
            </button>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Booking History</h2>
            <p className="text-gray-600 mb-4">See who claimed your food</p>
            <button className="btn-secondary">View History</button>
          </div>
        </div>

        {/* ===== POST FOOD FORM ===== */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-primary-700">📝 Post Leftover Food</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                  required placeholder="e.g. Biryani, Rice, Dal..."
                  className="input-field" />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows="3" placeholder="Describe the food, how it was stored, etc."
                  className="input-field" />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input type="text" name="quantity" value={form.quantity} onChange={handleChange}
                  required placeholder="e.g. Serves 50 people"
                  className="input-field" />
              </div>

              {/* Food Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                <select name="food_type" value={form.food_type} onChange={handleChange} className="input-field">
                  <option value="veg">🥗 Vegetarian</option>
                  <option value="non-veg">🍗 Non-Vegetarian</option>
                  <option value="mixed">🍱 Mixed</option>
                </select>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input type="text" name="event_name" value={form.event_name} onChange={handleChange}
                  placeholder="e.g. Wedding, Birthday Party..."
                  className="input-field" />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                <input type="tel" name="contact_phone" value={form.contact_phone} onChange={handleChange}
                  required placeholder="+91 98765 43210"
                  className="input-field" />
              </div>

              {/* Pickup Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Available Until</label>
                <input type="text" name="pickup_time" value={form.pickup_time} onChange={handleChange}
                  placeholder="e.g. Today 10 PM, Tomorrow morning"
                  className="input-field" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
                <input type="text" name="address" value={form.address} onChange={handleChange}
                  required placeholder="Full address for pickup"
                  className="input-field" />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">📍 Location (Lat, Lng)</label>
                <div className="flex gap-2">
                  <input type="text" name="latitude" value={form.latitude} onChange={handleChange}
                    placeholder="Latitude" className="input-field flex-1" />
                  <input type="text" name="longitude" value={form.longitude} onChange={handleChange}
                    placeholder="Longitude" className="input-field flex-1" />
                  <button type="button" onClick={useMyLocation}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                    📍 Use My Location
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button type="submit" disabled={loading}
                  className="btn-primary w-full text-lg py-3">
                  {loading ? 'Posting...' : '🚀 Post Food Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===== MY LISTINGS ===== */}
        {showListings && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">📋 All Food Listings</h2>
            {myListings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No food listings yet. Post your first one!</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListings.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>}
                    <div className="text-sm text-gray-500 space-y-1">
                      {item.quantity && <p>📦 Quantity: {item.quantity}</p>}
                      {item.food_type && <p>🍽️ Type: {item.food_type}</p>}
                      {item.event_name && <p>🎉 Event: {item.event_name}</p>}
                      {item.contact_phone && <p>📞 {item.contact_phone}</p>}
                      {item.pickup_time && <p>⏰ Pickup: {item.pickup_time}</p>}
                      {item.address && <p>📍 {item.address}</p>}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Posted: {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;