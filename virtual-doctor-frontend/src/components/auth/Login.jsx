import { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import './Login.css';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.access);
      setToken(response.data.access);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Row className="justify-content-center login-container">
        <Col md={6} lg={5}>
          <div className="text-center mb-4 login-header">
            <div className="logo-container-login mb-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                alt="Virtual Doctor Logo"
                width="60"
                className="logo-image"
              />
            </div>
            <h2 className="welcome-text">Welcome Back</h2>
            <p className="text-muted subtitle">Sign in to access your Virtual Doctor account</p>
          </div>
          
          <Card className="login-card">
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="alert-modern">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-modern">Email Address</Form.Label>
                  <div className="input-group-modern">
                    <i className="bi bi-envelope input-icon"></i>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="form-control-modern"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="form-label-modern">Password</Form.Label>
                    <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                  </div>
                  <div className="input-group-modern">
                    <i className="bi bi-lock input-icon"></i>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="form-control-modern"
                    />
                  </div>
                </Form.Group>
                
                <div className="mt-5">
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn-modern btn-login w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4 register-prompt">
            <p className="mb-0">
              Don't have an account? <Link to="/register" className="register-link">Create an account</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;