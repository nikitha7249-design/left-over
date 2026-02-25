import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Don't Waste Food, Share It! 🍽️
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Connect event hosts with NGOs and volunteers to reduce food waste 
              and feed those in need.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/map" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600">
                View Map
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-xl font-bold mb-2">Event Hosts</h3>
            <p className="text-gray-600">Post leftover food from weddings, parties, and events</p>
          </div>
          
          <div className="card text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">NGOs & Orphanages</h3>
            <p className="text-gray-600">Find and claim food for people in need</p>
          </div>
          
          <div className="card text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Volunteers</h3>
            <p className="text-gray-600">Help deliver food to those who need it</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600">Meals Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600">NGOs Partnered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">200+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;