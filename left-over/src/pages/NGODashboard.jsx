import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/env';
import FoodTrackingMap from '../components/FoodTrackingMap';
import LocationManager from '../components/common/LocationManager';

const NGODashboard = () => {
  const [availableFood, setAvailableFood] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(false);
  const [trackingItem, setTrackingItem] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableFood();
    } else {
      fetchMyBookings();
    }
  }, [activeTab]);

  const fetchAvailableFood = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/food`);
      setAvailableFood(res.data.filter(item => item.status === 'available'));
    } catch (err) {
      toast.error('Failed to load food listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/bookings/${user?.id || 1}`);
      setMyBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const claimFood = async (foodId) => {
    try {
      const res = await axios.post(`${config.API_URL}/food/${foodId}/claim`, {
        ngo_id: user?.id || 1,
        ngo_name: user?.name || 'NGO User'
      });
      if (res.data.success) {
        toast.success('🎉 Food claimed successfully! Contact the host for pickup.');
        fetchAvailableFood();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to claim food');
    }
  };

  const markCompleted = async (foodId) => {
    try {
      const res = await axios.patch(`${config.API_URL}/food/${foodId}/complete`);
      if (res.data.success) {
        toast.success('✅ Marked as picked up!');
        fetchMyBookings();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800'; // Added in_transit status color
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const foodTypeIcon = (type) => {
    switch (type) {
      case 'veg': return '🥗';
      case 'non-veg': return '🍗';
      case 'mixed': return '🍱';
      default: return '🍽️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🤝 NGO Dashboard</h1>

        <LocationManager />

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => switchTab('available')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'available'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            🔍 Available Food
          </button>
          <button
            onClick={() => switchTab('bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'bookings'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            📋 My Bookings
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* ===== AVAILABLE FOOD TAB ===== */}
        {!loading && activeTab === 'available' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Food Nearby</h2>
            {availableFood.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <p className="text-gray-500 text-lg">No available food listings right now.</p>
                <p className="text-gray-400 mt-2">Check back later or ask hosts to post their leftovers!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableFood.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 text-white">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{foodTypeIcon(item.food_type)} {item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      {item.event_name && (
                        <p className="text-primary-100 text-sm mt-1">🎉 {item.event_name}</p>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2">
                      {item.description && (
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      )}
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.quantity && <p>📦 <strong>Quantity:</strong> {item.quantity}</p>}
                        {item.contact_phone && <p>📞 <strong>Contact:</strong> {item.contact_phone}</p>}
                        {item.pickup_time && <p>⏰ <strong>Pickup:</strong> {item.pickup_time}</p>}
                        {item.address && <p>📍 <strong>Address:</strong> {item.address}</p>}
                      </div>
                      <p className="text-xs text-gray-400">
                        Posted: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => claimFood(item.id)}
                        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
                      >
                        🙋 Claim This Food
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MY BOOKINGS TAB ===== */}
        {!loading && activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Booked Food</h2>
            {myBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500 text-lg">You haven't claimed any food yet.</p>
                <p className="text-gray-400 mt-2">Go to "Available Food" to claim food listings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{foodTypeIcon(item.food_type)} {item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.quantity && <p>📦 {item.quantity}</p>}
                        {item.contact_phone && <p>📞 {item.contact_phone}</p>}
                        {item.address && <p>📍 {item.address}</p>}
                        {item.claimed_at && (
                          <p>🕐 Claimed: {new Date(item.claimed_at).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      {item.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => setTrackingItem(item)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            📍 Track Location
                          </button>
                          {item.status === 'claimed' && (
                            <button
                              onClick={() => markCompleted(item.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                              ✅ Mark Picked Up
                            </button>
                          )}
                        </>
                      )}
                      {item.status === 'completed' && (
                        <span className="text-green-600 font-semibold">✅ Picked Up</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tracking Map Modal */}
      {trackingItem && (
        <FoodTrackingMap foodItem={trackingItem} onClose={() => setTrackingItem(null)} />
      )}
    </div>
  );
};

export default NGODashboard;