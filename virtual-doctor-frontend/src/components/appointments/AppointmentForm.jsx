import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDoctors, scheduleAppointment } from '../../services/api';

function AppointmentForm() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    reason: '',
    is_emergency: false
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        setDoctors(response.data);
        
        // Set the first doctor as default if available
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            doctor: response.data[0].id.toString()
          }));
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load available doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      // Format the data for API
      const appointmentData = {
        ...formData,
        doctor: parseInt(formData.doctor),
      };
      
      await scheduleAppointment(appointmentData);
      navigate('/appointments');
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      setError('Failed to schedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      slots.push(`${formattedHour}:00`);
      if (hour !== 17) { // Don't add :30 for 5 PM
        slots.push(`${formattedHour}:30`);
      }
    }
    return slots;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <h2>Schedule Appointment</h2>
      
      <Card className="mt-4">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {doctors.length === 0 ? (
            <Alert variant="warning">
              No doctors are currently available for appointments.
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Doctor</Form.Label>
                <Form.Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]} // No past dates
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Time</Form.Label>
                    <Form.Select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      {generateTimeSlots().map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Reason for Visit</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe why you need to see the doctor"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="emergency"
                  name="is_emergency"
                  checked={formData.is_emergency}
                  onChange={handleChange}
                  label="This is an emergency appointment"
                />
              </Form.Group>
              
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate('/appointments')}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={submitting}
                >
                  {submitting ? 'Scheduling...' : 'Schedule Appointment'}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AppointmentForm;