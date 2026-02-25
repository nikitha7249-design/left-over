const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Leftovers Locator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Mission</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Leftovers Locator is on a mission to <span className="font-semibold">reduce food waste</span> by connecting event hosts 
            with leftover food to NGOs and volunteers who can deliver it to those in need.
          </p>
          <p className="text-gray-700 leading-relaxed">
            In India, thousands of tons of food go to waste at weddings, corporate events, 
            and functions, while nearby orphanages and shelters struggle with food shortages. 
            We're bridging this gap with technology.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="font-semibold text-xl mb-2">Event Hosts</h3>
            <p className="text-gray-600">Post leftover food from weddings, parties, and events</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="font-semibold text-xl mb-2">NGOs</h3>
            <p className="text-gray-600">Find and claim food for people in need</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="font-semibold text-xl mb-2">Volunteers</h3>
            <p className="text-gray-600">Help deliver food to those who need it</p>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600">Meals Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600">NGOs Partnered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">200+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Us Today!</h2>
          <p className="text-gray-600 mb-6">
            Whether you're a host with leftover food, an NGO in need, or a volunteer wanting to help, 
            there's a place for you at Leftovers Locator.
          </p>
          <button 
            onClick={() => window.location.href = '/register'}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;