import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Trophy, DollarSign, Globe, Linkedin, Twitter, MessageSquare, Github, Mail, Phone, Building, Award, FileText, CheckCircle, AlertCircle, Play, User, ArrowLeft } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/config/API_URL';

const HackathonDetailsPage = () => {
  const [hackathonData, setHackathonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [joining, setJoining] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Toast functions (you can replace these with your actual toast implementation)
  const showError = (message, title = "Error", duration = 3000) => {
    console.error(`${title}: ${message}`);
    // Replace with your actual toast implementation
  };

  const showWarning = (message, title = "Warning", duration = 3000) => {
    console.warn(`${title}: ${message}`);
    // Replace with your actual toast implementation
  };

  const showSuccess = (message, title = "Success", duration = 3000) => {
    console.log(`${title}: ${message}`);
    // Replace with your actual toast implementation
  };

  useEffect(() => {
    fetchHackathonData();
  }, [id]);

  const fetchHackathonData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate ID format
      if (!id || id.length !== 24) {
        setError('Invalid hackathon ID');
        return;
      }

      const response = await axios.get(`${API_URL}/api/hackathons/${id}`);
      
      if (response.data.success) {
        setHackathonData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch hackathon');
      }
    } catch (err) {
      console.error('Fetch hackathon error:', err);
      
      if (err.response?.status === 404) {
        setError('Hackathon not found');
      } else if (err.response?.status === 400) {
        setError('Invalid request');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load hackathon details');
      }
      
      showError(err.response?.data?.message || 'Failed to load hackathon details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHackathon = async () => {
    try {
      setJoining(true);
      
      // Add your join hackathon API call here
      // const response = await axios.post(`/api/hackathons/join/${id}`);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsJoined(!isJoined);
      showSuccess(isJoined ? 'Successfully left hackathon' : 'Successfully joined hackathon');
      
    } catch (err) {
      showError('Failed to join hackathon');
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registration_open': return 'text-green-500';
      case 'upcoming': return 'text-blue-500';
      case 'ongoing': return 'text-yellow-500';
      case 'completed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'registration_open': return <CheckCircle className="w-5 h-5" />;
      case 'upcoming': return <Clock className="w-5 h-5" />;
      case 'ongoing': return <Play className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading hackathon details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center py-12 px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Go Back
            </button>
            <button
              onClick={fetchHackathonData}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!hackathonData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Unable to load hackathon information
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
 
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={hackathonData.bannerImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'}
          alt="Hackathon Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{hackathonData.title}</h1>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(hackathonData.status)} bg-white bg-opacity-20`}>
              {getStatusIcon(hackathonData.status)}
              {hackathonData.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4">About This Hackathon</h2>
              <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {hackathonData.description || 'No description available.'}
              </p>
            </section>

            {/* Problem Statements */}
            {hackathonData.problemStatements && hackathonData.problemStatements.length > 0 && (
              <section className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  Problem Statements
                </h2>
                <div className="grid gap-3">
                  {hackathonData.problemStatements.map((problem, index) => (
                    <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <p className="flex-1">{problem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prizes */}
            {hackathonData.prizes && hackathonData.prizes.length > 0 && (
              <section className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Prizes & Rewards
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {hackathonData.prizes.map((prize, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-lg">{prize.position}</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-500 mb-2">
                        ${prize.amount?.toLocaleString() || '0'}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {prize.rewards || 'No rewards specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rules & Requirements */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Requirements */}
              {hackathonData.requirements && hackathonData.requirements.length > 0 && (
                <section className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-xl font-bold mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {hackathonData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Rules */}
              {hackathonData.rules && hackathonData.rules.length > 0 && (
                <section className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-xl font-bold mb-4">Rules</h3>
                  <ul className="space-y-2">
                    {hackathonData.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* FAQ */}
            {hackathonData.faqs && hackathonData.faqs.length > 0 && (
              <section className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {hackathonData.faqs.map((faq, index) => (
                    <details key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <summary className="font-semibold cursor-pointer hover:text-blue-500 transition-colors">
                        {faq.question}
                      </summary>
                      <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Members Joined
                  </span>
                  <span className="text-2xl font-bold text-blue-500">
                    {hackathonData.totalMembersJoined?.toLocaleString() || '0'}
                  </span>
                </div>
                {hackathonData.maxRegistrations && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((hackathonData.totalMembersJoined || 0) / hackathonData.maxRegistrations) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {Math.max(hackathonData.maxRegistrations - (hackathonData.totalMembersJoined || 0), 0)} spots remaining
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={handleJoinHackathon}
                disabled={joining}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isJoined 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {joining ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isJoined ? 'Leaving...' : 'Joining...'}
                  </div>
                ) : (
                  isJoined ? '✓ Joined Lobby' : 'Join Hackathon'
                )}
              </button>
            </div>

            {/* Event Details */}
            <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-bold mb-4">Event Details</h3>
              <div className="space-y-4">
                {hackathonData.registrationDeadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-semibold text-sm">Registration Deadline</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(hackathonData.registrationDeadline)}
                      </p>
                    </div>
                  </div>
                )}

                {(hackathonData.startDate || hackathonData.endDate) && (
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-sm">Event Duration</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(hackathonData.startDate)} - {formatDate(hackathonData.endDate)}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.venue && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-sm">Venue</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {hackathonData.venue}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.mode && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-semibold text-sm">Mode</p>
                      <p className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {hackathonData.mode}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.maxTeamSize && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-sm">Team Size</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        1-{hackathonData.maxTeamSize} members
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-sm">Registration Fee</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(hackathonData.registrationFee === 0 || !hackathonData.registrationFee) ? 'Free' : `$${hackathonData.registrationFee}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {hackathonData.tags && hackathonData.tags.length > 0 && (
              <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {hackathonData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            {hackathonData.organizer && (
              <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Organizer</h3>
                <div className="space-y-3">
                  {hackathonData.organizer.organization && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{hackathonData.organizer.organization}</span>
                    </div>
                  )}
                  {hackathonData.organizer.name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{hackathonData.organizer.name}</span>
                    </div>
                  )}
                  {hackathonData.organizer.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${hackathonData.organizer.contactEmail}`} className="text-blue-500 hover:underline">
                        {hackathonData.organizer.contactEmail}
                      </a>
                    </div>
                  )}
                  {hackathonData.organizer.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{hackathonData.organizer.contactNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {hackathonData.socialLinks && Object.values(hackathonData.socialLinks).some(link => link) && (
              <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hackathonData.socialLinks.website && (
                    <a
                      href={hackathonData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg text-center transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Globe className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Website</span>
                    </a>
                  )}
                  {hackathonData.socialLinks.linkedin && (
                    <a
                      href={hackathonData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg text-center transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Linkedin className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <span className="text-xs">LinkedIn</span>
                    </a>
                  )}
                  {hackathonData.socialLinks.twitter && (
                    <a
                      href={hackathonData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg text-center transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Twitter className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                      <span className="text-xs">Twitter</span>
                    </a>
                  )}
                  {hackathonData.socialLinks.discord && (
                    <a
                      href={hackathonData.socialLinks.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg text-center transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                      <span className="text-xs">Discord</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetailsPage;