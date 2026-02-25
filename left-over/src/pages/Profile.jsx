import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-primary-100 rounded-full p-4">
              <span className="text-4xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600 capitalize">Role: {user?.role}</p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-gray-600">Email</dt>
                <dd className="font-semibold">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Member Since</dt>
                <dd className="font-semibold">2024</dd>
              </div>
            </dl>
          </div>
          
          <div className="mt-6">
            <button className="btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;