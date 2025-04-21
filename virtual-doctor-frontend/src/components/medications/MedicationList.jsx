import { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Badge, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMedications, deleteMedication } from '../../services/api';

function MedicationList() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMedicationId, setDeletingMedicationId] = useState(null);

  const fetchMedications = async () => {
    try {
      const response = await getMedications();
      setMedications(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load medications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleDeleteClick = (medicationId) => {
    setDeletingMedicationId(medicationId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMedication(deletingMedicationId);
      setMedications(medications.filter(med => med.id !== deletingMedicationId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError('Failed to delete medication');
    }
  };

  const getFrequencyText = (frequency) => {
    const frequencyMap = {
      'once_daily': 'Once Daily',
      'twice_daily': 'Twice Daily',
      'three_times_daily': 'Three Times Daily',
      'four_times_daily': 'Four Times Daily',
      'as_needed': 'As Needed'
    };
    
    return frequencyMap[frequency] || frequency.replace('_', ' ');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading medications...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Medications</h2>
        <Button as={Link} to="/medications/add" variant="primary">Add Medication</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {medications.length === 0 ? (
        <Card>
          <Card.Body>
            <p className="text-center">No medications found. Start by adding your medications.</p>
          </Card.Body>
        </Card>
      ) : (
        medications.map(medication => (
          <Card key={medication.id} className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{medication.name}</h5>
                <div>
                  <Button 
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    as={Link}
                    to={`/medications/edit/${medication.id}`}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(medication.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Dosage:</strong> {medication.dosage}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Frequency:</strong> {getFrequencyText(medication.frequency)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Start Date:</strong> {new Date(medication.start_date).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>End Date:</strong> {new Date(medication.end_date).toLocaleDateString()}
                </ListGroup.Item>
                {medication.instructions && (
                  <ListGroup.Item>
                    <strong>Instructions:</strong> {medication.instructions}
                  </ListGroup.Item>
                )}
              </ListGroup>
              <div className="mt-3">
                <Badge bg="success">
                  {new Date(medication.start_date) <= new Date() && new Date(medication.end_date) >= new Date() 
                    ? 'Active' 
                    : new Date(medication.start_date) > new Date() 
                      ? 'Upcoming' 
                      : 'Completed'}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this medication? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MedicationList;