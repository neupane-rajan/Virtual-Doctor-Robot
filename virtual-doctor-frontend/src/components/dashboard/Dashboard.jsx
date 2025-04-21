import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, ListGroup, Badge, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getProfile, getSymptomHistory, getMedications, getAppointments } from '../../services/api';
import './Dashboard.css'; // We'll create a new CSS file for dashboard-specific styles

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, symptomsRes, medsRes, apptsRes] = await Promise.all([
          getProfile(),
          getSymptomHistory(),
          getMedications(),
          getAppointments()
        ]);

        setUserData(profileRes.data);
        setSymptoms(symptomsRes.data);
        setMedications(medsRes.data);
        setAppointments(apptsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p>Loading your health data...</p>
      </div>
    );
  }

  return (
    <Container className="dashboard-container py-4">
      <div className="welcome-banner mb-4">
        <div className="welcome-content">
          <h2>Welcome, {userData.first_name || 'Patient'}</h2>
          <p className="welcome-message">Your health dashboard is ready for you.</p>
          <div className="welcome-stats">
            <div className="stat-item">
              <div className="stat-icon"><i className="bi bi-clipboard-pulse"></i></div>
              <div className="stat-value">{symptoms.length}</div>
              <div className="stat-label">Symptom Reports</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><i className="bi bi-capsule"></i></div>
              <div className="stat-value">{medications.length}</div>
              <div className="stat-label">Medications</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><i className="bi bi-calendar-check"></i></div>
              <div className="stat-value">{appointments.length}</div>
              <div className="stat-label">Appointments</div>
            </div>
          </div>
        </div>
      </div>
      
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="dashboard-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="card-header-title">
                <i className="bi bi-clipboard-pulse me-2"></i>
                <h5 className="mb-0">Recent Symptoms</h5>
              </div>
              <Button as={Link} to="/symptoms/report" size="sm" className="btn-modern">
                <i className="bi bi-plus-circle me-1"></i> Report New
              </Button>
            </Card.Header>
            <Card.Body className="card-body-modern">
              {symptoms.length > 0 ? (
                <ListGroup variant="flush" className="modern-list">
                  {symptoms.slice(0, 3).map((symptom, index) => (
                    <ListGroup.Item key={index} className="modern-list-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="item-title mb-1">{symptom.description}</p>
                          <div className="item-details">
                            <i className="bi bi-calendar3 me-1"></i>
                            <small>
                              {new Date(symptom.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <Badge className="custom-badge">{symptom.symptoms.length} symptoms</Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-clipboard"></i></div>
                  <p>No symptoms reported yet</p>
                  <Button as={Link} to="/symptoms/report" variant="outline-primary" size="sm" className="btn-modern mt-2">
                    Report Your First Symptom
                  </Button>
                </div>
              )}
            </Card.Body>
            {symptoms.length > 3 && (
              <Card.Footer className="text-center card-footer-modern">
                <Link to="/symptoms/history" className="view-all-link">
                  View all symptom reports <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </Card.Footer>
            )}
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="dashboard-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="card-header-title">
                <i className="bi bi-capsule me-2"></i>
                <h5 className="mb-0">Your Medications</h5>
              </div>
              <Button as={Link} to="/medications/add" size="sm" className="btn-modern">
                <i className="bi bi-plus-circle me-1"></i> Add New
              </Button>
            </Card.Header>
            <Card.Body className="card-body-modern">
              {medications.length > 0 ? (
                <ListGroup variant="flush" className="modern-list">
                  {medications.slice(0, 3).map((medication, index) => (
                    <ListGroup.Item key={index} className="modern-list-item">
                      <div className="medication-item">
                        <div className="medication-icon">
                          <i className="bi bi-capsule-pill"></i>
                        </div>
                        <div className="medication-details">
                          <h6 className="item-title">{medication.name}</h6>
                          <p className="mb-1">{medication.dosage} - {medication.frequency.replace('_', ' ')}</p>
                          <small className="text-muted">{medication.instructions}</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-capsule"></i></div>
                  <p>No medications added yet</p>
                  <Button as={Link} to="/medications/add" variant="outline-primary" size="sm" className="btn-modern mt-2">
                    Add Your First Medication
                  </Button>
                </div>
              )}
            </Card.Body>
            {medications.length > 3 && (
              <Card.Footer className="text-center card-footer-modern">
                <Link to="/medications" className="view-all-link">
                  View all medications <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="card-header-title">
                <i className="bi bi-calendar-check me-2"></i>
                <h5 className="mb-0">Upcoming Appointments</h5>
              </div>
              <Button as={Link} to="/appointments/schedule" size="sm" className="btn-modern">
                <i className="bi bi-plus-circle me-1"></i> Schedule
              </Button>
            </Card.Header>
            <Card.Body className="card-body-modern">
              {appointments.length > 0 ? (
                <ListGroup variant="flush" className="modern-list appointments-list">
                  {appointments.slice(0, 3).map((appointment, index) => (
                    <ListGroup.Item key={index} className="modern-list-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="appointment-icon">
                          <i className="bi bi-person-badge"></i>
                        </div>
                        <div className="appointment-details">
                          <h6 className="item-title">Dr. {appointment.doctor.name}</h6>
                          <p className="mb-1">{appointment.reason}</p>
                          <div className="item-details">
                            <i className="bi bi-calendar3 me-1"></i>
                            <small>
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </small>
                          </div>
                        </div>
                        {appointment.is_emergency && <Badge bg="danger" className="emergency-badge">Emergency</Badge>}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-calendar"></i></div>
                  <p>No appointments scheduled</p>
                  <Button as={Link} to="/appointments/schedule" variant="outline-primary" size="sm" className="btn-modern mt-2">
                    Schedule Your First Appointment
                  </Button>
                </div>
              )}
            </Card.Body>
            {appointments.length > 3 && (
              <Card.Footer className="text-center card-footer-modern">
                <Link to="/appointments" className="view-all-link">
                  View all appointments <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
      
      <div className="text-center mt-4 doctor-chat-section">
        <div className="chat-preview">
          <div className="chat-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <div className="chat-info">
            <h5>Need medical advice?</h5>
            <p>Connect with our Virtual Doctor for instant medical guidance</p>
          </div>
          <Button as={Link} to="/chat" variant="success" size="lg" className="btn-modern chat-btn">
            <i className="bi bi-chat-dots me-2"></i>
            Chat with Virtual Doctor
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;