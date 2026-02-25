import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/env';
import FoodTrackingMap from '../components/FoodTrackingMap';
import LocationManager from '../components/common/LocationManager';

const VolunteerDashboard = () => {
  const [claimedFood, setClaimedFood] = useState([]);
  const [availableFood, setAvailableFood] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(false);
  const [trackingItem, setTrackingItem] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchClaimedFood();
  }, []);

  // Volunteers see food that has been claimed by NGOs and needs delivery
  const fetchClaimedFood = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/food`);
      setClaimedFood(res.data.filter(item => item.status === 'claimed'));
      setAvailableFood(res.data.filter(item => item.status === 'available'));
    } catch (err) {
      toast.error('Failed to load food listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDeliveries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/food`);
      setMyDeliveries(res.data.filter(item => item.volunteer_id === (user?.id || 1)));
    } catch (err) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const acceptDelivery = async (foodId) => {
    try {
      const res = await axios.patch(`${config.API_URL}/food/${foodId}/status`, {
        status: 'in_transit',
        volunteer_id: user?.id || 1,
        volunteer_name: user?.name || 'Volunteer'
      });
      toast.success('🚗 Delivery accepted! Head to the pickup location.');
      fetchClaimedFood();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept delivery');
    }
  };

  const claimFood = async (foodId) => {
    try {
      const res = await axios.post(`${config.API_URL}/food/${foodId}/claim`, {
        ngo_id: user?.id || 1,
        ngo_name: user?.name || 'Volunteer'
      });
      if (res.data.success) {
        toast.success('🎉 Food claimed successfully!');
        fetchClaimedFood();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to claim food');
    }
  };

  const markDelivered = async (foodId) => {
    try {
      const res = await axios.patch(`${config.API_URL}/food/${foodId}/complete`);
      if (res.data.success) {
        toast.success('✅ Delivery completed!');
        fetchClaimedFood();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'available') fetchClaimedFood();
    if (tab === 'deliveries') fetchMyDeliveries();
  };

  const statusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
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
        <h1 className="text-3xl font-bold mb-4">🙋 Volunteer Dashboard</h1>

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
            onClick={() => switchTab('deliveries')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'deliveries'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            🚗 My Deliveries
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* ===== AVAILABLE FOOD TAB ===== */}
        {!loading && activeTab === 'available' && (
          <div>
            {/* Available to Claim */}
            {availableFood.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">🍽️ Available to Claim</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {availableFood.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 text-white">
                        <h3 className="text-lg font-bold">{foodTypeIcon(item.food_type)} {item.title}</h3>
                        {item.event_name && <p className="text-green-100 text-sm mt-1">🎉 {item.event_name}</p>}
                      </div>
                      <div className="p-4 space-y-2">
                        {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                        <div className="text-sm text-gray-500 space-y-1">
                          {item.quantity && <p>📦 <strong>Quantity:</strong> {item.quantity}</p>}
                          {item.contact_phone && <p>📞 <strong>Contact:</strong> {item.contact_phone}</p>}
                          {item.pickup_time && <p>⏰ <strong>Pickup:</strong> {item.pickup_time}</p>}
                          {item.address && <p>📍 <strong>Address:</strong> {item.address}</p>}
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <button onClick={() => claimFood(item.id)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                          🙋 Claim This Food
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Claimed - Needs Delivery */}
            <h2 className="text-2xl font-bold mb-4">🚗 Needs Delivery (Claimed by NGOs)</h2>
            {claimedFood.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">No food items need delivery right now.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimedFood.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{foodTypeIcon(item.food_type)} {item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      {item.claimed_by_name && <p className="text-yellow-100 text-sm mt-1">Claimed by: {item.claimed_by_name}</p>}
                    </div>
                    <div className="p-4 space-y-2">
                      {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.quantity && <p>📦 <strong>Quantity:</strong> {item.quantity}</p>}
                        {item.contact_phone && <p>📞 <strong>Contact:</strong> {item.contact_phone}</p>}
                        {item.pickup_time && <p>⏰ <strong>Pickup:</strong> {item.pickup_time}</p>}
                        {item.address && <p>📍 <strong>Address:</strong> {item.address}</p>}
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex gap-2">
                      <button onClick={() => setTrackingItem(item)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                        📍 Track
                      </button>
                      <button onClick={() => markDelivered(item.id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                        ✅ Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MY DELIVERIES TAB ===== */}
        {!loading && activeTab === 'deliveries' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Delivery History</h2>
            {myDeliveries.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-5xl mb-4">🚗</div>
                <p className="text-gray-500 text-lg">No deliveries yet.</p>
                <p className="text-gray-400 mt-2">Accept deliveries from the "Available Food" tab.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myDeliveries.map(item => (
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
                        {item.address && <p>📍 {item.address}</p>}
                        {item.contact_phone && <p>📞 {item.contact_phone}</p>}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <button onClick={() => setTrackingItem(item)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                        📍 Track
                      </button>
                      {item.status !== 'completed' && (
                        <button onClick={() => markDelivered(item.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                          ✅ Delivered
                        </button>
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

export default VolunteerDashboard;