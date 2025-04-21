import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getSymptoms, reportSymptoms } from '../../services/api';

function SymptomForm() {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await getSymptoms();
        setAvailableSymptoms(response.data);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        setError('Failed to load symptoms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const handleSymptomChange = (e) => {
    const symptomId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setSubmitting(true);
    
    try {
      await reportSymptoms({
        symptoms: selectedSymptoms,
        description
      });
      navigate('/symptoms/history');
    } catch (error) {
      console.error('Error reporting symptoms:', error);
      setError('Failed to submit symptoms. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading symptoms...</div>;
  }

  return (
    <Container>
      <h2 className="mb-4">Report Your Symptoms</h2>
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label as="h5">Select all symptoms you're experiencing:</Form.Label>
              <Row className="mt-3">
                {availableSymptoms.map(symptom => (
                  <Col md={6} key={symptom.id} className="mb-2">
                    <Form.Check 
                      type="checkbox"
                      id={`symptom-${symptom.id}`}
                      label={symptom.name}
                      value={symptom.id}
                      onChange={handleSymptomChange}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label as="h5">Describe your symptoms</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about your symptoms, when they started, how severe they are, etc."
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                size="lg"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Symptoms'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SymptomForm;