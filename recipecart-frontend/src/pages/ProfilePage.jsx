import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      alert('Please log in to view your profile');
      navigate('/login');
      return;
    }
    
    fetchUserData(storedUser.id);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      
      // Fetch user basic info
      const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
      setUser(userResponse.data);
      
      setFormData({
        username: userResponse.data.username,
        email: userResponse.data.email,
      });

      // Fetch user profile/preferences (this might fail if no profile exists yet)
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/users/${userId}/profile`);
        setUserProfile(profileResponse.data);
      } catch (err) {
        console.log('No user profile found yet');
        setUserProfile(null);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      username: user.username,
      email: user.email,
    });
  };

  const handleSave = async () => {
    try {
      // Update basic user info (if endpoint exists)
      // For now, we'll just show a message since we don't have an update user endpoint
      alert('User info update not yet implemented in backend');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleEditPreferences = () => {
    navigate('/preferences');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <MainNavbar />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-wrapper">
        <MainNavbar />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <MainNavbar />
      
      <div className="profile-page">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user.username)}
          </div>
          <div className="profile-header-info">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-navigation">
          <button
            className={`nav-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account Details
          </button>
          <button
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => navigate('/orders')}
          >
            Order History
          </button>
          <button
            className="nav-tab"
            onClick={handleLogout}
            style={{ marginLeft: 'auto', color: '#ef4444' }}
          >
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="profile-content">
          {activeTab === 'account' && (
            <>
              <h2 className="section-title">Account Information</h2>
              
              <div className="detail-group">
                <label className="detail-label">Name</label>
                <div className="detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  ) : (
                    user.username
                  )}
                </div>
              </div>

              <div className="detail-group">
                <label className="detail-label">Email</label>
                <div className="detail-value">
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </div>
              </div>

              {/* Preferences Section */}
              <h2 className="section-title" style={{ marginTop: '2rem' }}>My Preferences</h2>
              
              <div className="preferences-grid">
                <div className="preference-card">
                  <h4>Dietary Plan</h4>
                  <div className="preference-tags">
                    {userProfile?.dietaryPlan ? (
                      <span className="preference-tag">{userProfile.dietaryPlan}</span>
                    ) : (
                      <span className="preference-tag empty">Not set</span>
                    )}
                  </div>
                </div>

                <div className="preference-card">
                  <h4>Allergies</h4>
                  <div className="preference-tags">
                    {userProfile?.allergies && userProfile.allergies.length > 0 ? (
                      userProfile.allergies.map(allergy => (
                        <span key={allergy} className="preference-tag">{allergy}</span>
                      ))
                    ) : (
                      <span className="preference-tag empty">None specified</span>
                    )}
                  </div>
                </div>

                <div className="preference-card">
                  <h4>Favorite Cuisines</h4>
                  <div className="preference-tags">
                    {userProfile?.favoriteCuisines && userProfile.favoriteCuisines.length > 0 ? (
                      userProfile.favoriteCuisines.map(cuisine => (
                        <span key={cuisine} className="preference-tag">{cuisine}</span>
                      ))
                    ) : (
                      <span className="preference-tag empty">None selected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="save-button">
                      Save Changes
                    </button>
                    <button onClick={handleCancel} className="cancel-button">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEdit} className="edit-button">
                      Edit Profile
                    </button>
                    <button onClick={handleEditPreferences} className="edit-button">
                      Edit Preferences
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;