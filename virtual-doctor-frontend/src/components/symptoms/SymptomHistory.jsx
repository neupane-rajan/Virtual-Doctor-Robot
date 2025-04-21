import { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getSymptomHistory, getDiagnosis } from '../../services/api';

function SymptomHistory() {
  const [symptoms, setSymptoms] = useState([]);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [diagnoses, setDiagnoses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSymptomHistory = async () => {
      try {
        const response = await getSymptomHistory();
        setSymptoms(response.data);
      } catch (err) {
        setError('Failed to load symptom history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptomHistory();
  }, []);

  const toggleExpand = async (logId) => {
    // Toggle expanded state
    const newExpandedState = {
      ...expandedLogs,
      [logId]: !expandedLogs[logId]
    };
    setExpandedLogs(newExpandedState);

    // Fetch diagnosis if expanded and not already loaded
    if (newExpandedState[logId] && !diagnoses[logId]) {
      try {
        const response = await getDiagnosis(logId);
        setDiagnoses({
          ...diagnoses,
          [logId]: response.data
        });
      } catch (err) {
        console.error(`Error fetching diagnosis for log ${logId}:`, err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading symptom history...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Symptom History</h2>
        <Button as={Link} to="/symptoms/report" variant="primary">Report New Symptoms</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {symptoms.length === 0 ? (
        <Card>
          <Card.Body>
            <p className="text-center">No symptom reports found. Start by reporting your symptoms.</p>
          </Card.Body>
        </Card>
      ) : (
        symptoms.map(log => (
          <Card key={log.id} className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between">
                <h5 className="mb-0">
                  {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                </h5>
                <Button 
                  variant="link" 
                  onClick={() => toggleExpand(log.id)}
                >
                  {expandedLogs[log.id] ? 'Hide Details' : 'Show Details'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>{log.description}</Card.Text>
              
              <div className="mb-3">
                <h6>Reported Symptoms:</h6>
                <div>
                  {log.symptoms.map(symptom => (
                    <Badge bg="info" className="me-2 mb-2" key={symptom.id}>
                      {symptom.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {expandedLogs[log.id] && (
                <div className="mt-4">
                  <h5>Diagnosis</h5>
                  {diagnoses[log.id] ? (
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h6>Assessment</h6>
                        <p>{diagnoses[log.id].diagnosis_text}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <h6>Recommendation</h6>
                        <p>{diagnoses[log.id].recommendation}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  ) : (
                    <p>Loading diagnosis...</p>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default SymptomHistory;