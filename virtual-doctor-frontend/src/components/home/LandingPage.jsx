import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './LandingPage.css'; // We'll create a matching CSS file

function LandingPage() {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="hero-content">
                <h1 className="hero-title">Virtual Doctor Robot</h1>
                <p className="hero-subtitle">
                  Your personal healthcare assistant powered by AI. Report symptoms, get instant medical advice,
                  track medications, and schedule appointments with doctors - all in one place.
                </p>
                <div className="hero-buttons">
                  <Button as={Link} to="/register" variant="light" size="lg" className="btn-modern-primary">
                    Get Started
                  </Button>
                  <Button as={Link} to="/login" variant="outline-light" size="lg" className="btn-modern-secondary">
                    Sign In
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image-container">
                <Image 
                  src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" 
                  alt="Virtual Doctor" 
                  fluid 
                  className="hero-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
        <div className="hero-shape"></div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Row className="text-center">
                <Col md={4}>
                  <div className="stat-item">
                    <div className="stat-number">10k+</div>
                    <div className="stat-label">Users</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="stat-item">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Satisfaction</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Support</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">How Virtual Doctor Robot Helps You</h2>
            <p className="section-subtitle">Experience healthcare reimagined with our innovative AI platform</p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <i className="bi bi-chat-dots"></i>
                  </div>
                  <Card.Title className="feature-title">AI-Powered Chat</Card.Title>
                  <Card.Text className="feature-text">
                    Describe your symptoms and get instant medical advice from our advanced AI system.
                  </Card.Text>
                  <Link to="/features" className="feature-link">
                    Learn more <i className="bi bi-arrow-right"></i>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <Card.Title className="feature-title">Easy Appointments</Card.Title>
                  <Card.Text className="feature-text">
                    Schedule appointments with qualified doctors based on your symptoms and needs.
                  </Card.Text>
                  <Link to="/features" className="feature-link">
                    Learn more <i className="bi bi-arrow-right"></i>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <i className="bi bi-capsule"></i>
                  </div>
                  <Card.Title className="feature-title">Medication Tracking</Card.Title>
                  <Card.Text className="feature-text">
                    Never miss a dose with our medication tracking and reminder system.
                  </Card.Text>
                  <Link to="/features" className="feature-link">
                    Learn more <i className="bi bi-arrow-right"></i>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple steps to getting the care you need</p>
          </div>
          <div className="steps-container">
            <Row className="g-4 position-relative">
              <div className="steps-connector"></div>
              <Col md={3} className="step-column">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h5 className="step-title">Create Account</h5>
                  <p className="step-description">Sign up and complete your health profile</p>
                </div>
              </Col>
              <Col md={3} className="step-column">
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h5 className="step-title">Report Symptoms</h5>
                  <p className="step-description">Describe what you're experiencing</p>
                </div>
              </Col>
              <Col md={3} className="step-column">
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h5 className="step-title">Get Diagnosis</h5>
                  <p className="step-description">Receive AI-powered medical advice</p>
                </div>
              </Col>
              <Col md={3} className="step-column">
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h5 className="step-title">Connect with Doctors</h5>
                  <p className="step-description">Schedule appointments if needed</p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">Trusted by thousands of patients worldwide</p>
          </div>
          <Row>
            <Col lg={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-rating">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <Card.Text className="testimonial-text">
                    "The Virtual Doctor Robot helped me identify my condition quickly. I got immediate advice and could schedule a doctor's appointment through the app. Impressive!"
                  </Card.Text>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">JD</div>
                    <div>
                      <div className="testimonial-name">John Doe</div>
                      <div className="testimonial-position">Patient</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-rating">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <Card.Text className="testimonial-text">
                    "As someone with chronic conditions, this app has been life-changing. The medication tracking feature ensures I never miss a dose. Highly recommended!"
                  </Card.Text>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">JS</div>
                    <div>
                      <div className="testimonial-name">Jane Smith</div>
                      <div className="testimonial-position">Patient</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-rating">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <Card.Text className="testimonial-text">
                    "The AI chat is surprisingly accurate. It gave me useful advice for my symptoms and saved me an unnecessary trip to the ER. This platform is the future of healthcare."
                  </Card.Text>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">RJ</div>
                    <div>
                      <div className="testimonial-name">Robert Johnson</div>
                      <div className="testimonial-position">Patient</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <Container>
          <Card className="cta-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={8} className="text-center text-lg-start">
                  <h2 className="cta-title">Ready to take control of your health?</h2>
                  <p className="cta-text">Join Virtual Doctor Robot today and experience healthcare reimagined.</p>
                </Col>
                <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
                  <Button as={Link} to="/register" variant="light" size="lg" className="btn-cta">
                    Get Started Now
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Current Date Display */}
      <Container className="text-center py-4">
        <div className="current-date">
          Current Date: <span>{currentDate}</span>
        </div>
      </Container>
    </div>
  );
}

export default LandingPage;