import { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';

function Register({ setToken }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await register(registrationData);
      localStorage.setItem('token', response.data.access);
      setToken(response.data.access);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data) {
        // Process validation errors from API
        const errorsObj = error.response.data;
        const errorMessages = Object.keys(errorsObj).map(key => 
          `${key}: ${errorsObj[key].join(', ')}`
        );
        setError(errorMessages.join('. '));
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={8}>
          <div className="text-center mb-4">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" 
              alt="Virtual Doctor Logo" 
              width="80" 
            />
            <h2 className="mt-3">Create Your Account</h2>
            <p className="text-muted">Get started with your personal Virtual Doctor</p>
          </div>
          
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="py-2"
                      />
                      <Form.Text className="text-muted">
                        Must be at least 6 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Check 
                    type="checkbox" 
                    id="termsCheckbox" 
                    label="I agree to the Terms of Service and Privacy Policy" 
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="py-2" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p className="mb-0">
              Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;