import { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAppointments } from '../../services/api';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Group appointments by status (upcoming, past)
  const currentDate = new Date();
  const upcomingAppointments = appointments.filter(
    appt => new Date(`${appt.date}T${appt.time}`) >= currentDate
  ).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  
  const pastAppointments = appointments.filter(
    appt => new Date(`${appt.date}T${appt.time}`) < currentDate
  ).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  if (loading) {
    return <div className="text-center mt-5">Loading appointments...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Appointments</h2>
        <Button as={Link} to="/appointments/schedule" variant="primary">Schedule New Appointment</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {appointments.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>You have no appointments scheduled.</p>
            <Button as={Link} to="/appointments/schedule" variant="primary">Schedule Your First Appointment</Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <h3 className="mb-3">Upcoming Appointments</h3>
          {upcomingAppointments.length === 0 ? (
            <p>No upcoming appointments</p>
          ) : (
            upcomingAppointments.map(appointment => (
              <Card key={appointment.id} className="mb-3">
                <Card.Header className="d-flex justify-content-between">
                  <h5 className="mb-0">Dr. {appointment.doctor.name}</h5>
                  {appointment.is_emergency && (
                    <Badge bg="danger">Emergency</Badge>
                  )}
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Date & Time:</strong> {new Date(`${appointment.date}T${appointment.time}`).toLocaleString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Specialty:</strong> {appointment.doctor.specialty}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Reason:</strong> {appointment.reason}
                    </ListGroup.Item>
                  </ListGroup>
                  
                </Card.Body>
              </Card>
            ))
          )}

          <h3 className="mb-3 mt-5">Past Appointments</h3>
          {pastAppointments.length === 0 ? (
            <p>No past appointments</p>
          ) : (
            pastAppointments.map(appointment => (
              <Card key={appointment.id} className="mb-3">
                <Card.Header className="text-muted">Dr. {appointment.doctor.name}</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="text-muted">
                      <strong>Date & Time:</strong> {new Date(`${appointment.date}T${appointment.time}`).toLocaleString()}
                    </ListGroup.Item>
                    <ListGroup.Item className="text-muted">
                      <strong>Reason:</strong> {appointment.reason}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default AppointmentList;