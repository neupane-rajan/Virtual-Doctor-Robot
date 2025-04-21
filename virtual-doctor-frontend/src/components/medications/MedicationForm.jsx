import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { addMedication, getMedication, updateMedication } from '../../services/api';

function MedicationForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once_daily',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    instructions: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchMedication = async () => {
        try {
          const response = await getMedication(id);
          const med = response.data;
          
          // Format dates for input fields
          setFormData({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            start_date: new Date(med.start_date).toISOString().split('T')[0],
            end_date: new Date(med.end_date).toISOString().split('T')[0],
            instructions: med.instructions || ''
          });
        } catch (err) {
          console.error('Error fetching medication:', err);
          setError('Failed to load medication details');
        } finally {
          setLoading(false);
        }
      };

      fetchMedication();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      if (isEditing) {
        await updateMedication(id, formData);
      } else {
        await addMedication(formData);
      }
      navigate('/medications');
    } catch (err) {
      console.error('Error saving medication:', err);
      setError('Failed to save medication. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading medication details...</div>;
  }

  return (
    <div>
      <h2>{isEditing ? 'Edit Medication' : 'Add New Medication'}</h2>
      
      <Card className="mt-4">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Medication Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Ibuprofen, Amoxicillin"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Dosage</Form.Label>
              <Form.Control
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 400mg, 5ml"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Frequency</Form.Label>
              <Form.Select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="once_daily">Once Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="three_times_daily">Three Times Daily</option>
                <option value="four_times_daily">Four Times Daily</option>
                <option value="as_needed">As Needed</option>
              </Form.Select>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="e.g., Take with food, avoid alcohol"
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/medications')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={submitting}
              >
                {submitting ? 'Saving...' : isEditing ? 'Update Medication' : 'Add Medication'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default MedicationForm;