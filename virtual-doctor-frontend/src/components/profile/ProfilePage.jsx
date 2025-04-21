import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Container, Tabs, Tab } from 'react-bootstrap';
import { getProfile } from '../../services/api';

function ProfilePage() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    date_joined: '',
    // Additional profile fields
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    medical_conditions: '',
    allergies: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        
        // Format the date joined
        const dateJoined = new Date(response.data.date_joined).toLocaleDateString();
        
        setUserData({
          ...response.data,
          date_joined: dateJoined,
          // These would come from the backend if available
          phone: response.data.phone || '',
          address: response.data.address || '',
          date_of_birth: response.data.date_of_birth || '',
          gender: response.data.gender || '',
          medical_conditions: response.data.medical_conditions || '',
          allergies: response.data.allergies || ''
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update the profile
    // For now, we'll just simulate a successful update
    setSuccessMessage('Profile updated successfully!');
    setIsEditing(false);
    
    // Clear the success message after a few seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">My Profile</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div 
                className="avatar-circle bg-primary text-white mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{ width: '150px', height: '150px', borderRadius: '50%', fontSize: '4rem' }}
              >
                {userData.first_name ? userData.first_name.charAt(0) : '?'}
              </div>
              
              <h4>{userData.first_name} {userData.last_name}</h4>
              <p className="text-muted mb-1">{userData.username}</p>
              <p className="text-muted">Member since {userData.date_joined}</p>
              
              {!isEditing && (
                <Button 
                  variant="outline-primary" 
                  className="mt-3"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-2"></i>Edit Profile
                </Button>
              )}
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body>
              <h5 className="mb-3">Contact Information</h5>
              <p className="mb-2">
                <i className="bi bi-envelope me-2 text-primary"></i>
                {userData.email}
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone me-2 text-primary"></i>
                {userData.phone || 'No phone number added'}
              </p>
              <p>
                <i className="bi bi-geo-alt me-2 text-primary"></i>
                {userData.address || 'No address added'}
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="personal" id="profile-tabs" className="mb-4">
                <Tab eventKey="personal" title="Personal Information">
                  <Form onSubmit={handleSaveProfile}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="first_name"
                            value={userData.first_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="last_name"
                            value={userData.last_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={userData.username}
                            disabled // Username typically can't be changed
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="date_of_birth"
                            value={userData.date_of_birth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={userData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </Form.Select>
                    </Form.Group>
                    
                    {isEditing && (
                      <div className="d-flex justify-content-end mt-4">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setIsEditing(false)}
                          className="me-2"
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab>
                
                <Tab eventKey="medical" title="Medical Information">
                  <Form onSubmit={handleSaveProfile}>
                    <Form.Group className="mb-3">
                      <Form.Label>Medical Conditions</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="medical_conditions"
                        value={userData.medical_conditions}
                        onChange={handleInputChange}
                        placeholder="Enter any chronic conditions, past surgeries, etc."
                        disabled={!isEditing}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Allergies</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="allergies"
                        value={userData.allergies}
                        onChange={handleInputChange}
                        placeholder="Enter any allergies to medications, foods, etc."
                        disabled={!isEditing}
                      />
                    </Form.Group>
                    
                    {isEditing && (
                      <div className="d-flex justify-content-end mt-4">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setIsEditing(false)}
                          className="me-2"
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab>
                
                <Tab eventKey="password" title="Change Password">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control type="password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control type="password" />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <Button variant="primary" type="submit">
                        Update Password
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;