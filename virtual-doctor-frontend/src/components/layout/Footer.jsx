import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <Container>
        <Row className="py-3">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="text-white mb-3">Virtual Doctor Robot</h5>
            <p className="text-white-50">
              Your AI-powered healthcare companion for symptom assessment, 
              medication tracking, and appointment scheduling.
            </p>
            <div className="d-flex mt-3">
              <a href="#" className="text-white me-3" title="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white me-3" title="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-white" title="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
            </div>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/login" className="text-white-50 text-decoration-none">Sign In</Link></li>
              <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none">Register</Link></li>
              <li className="mb-2"><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h6 className="text-white mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Terms of Service</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Contact Support</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="text-white mb-3">Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2 text-white-50">
                <i className="bi bi-envelope me-2"></i>support@virtualdoctor.com
              </li>
              <li className="mb-2 text-white-50">
                <i className="bi bi-phone me-2"></i>(123) 456-7890
              </li>
              <li className="text-white-50">
                <i className="bi bi-geo-alt me-2"></i>123 Medical Ave, Health City
              </li>
            </ul>
          </Col>
        </Row>
        
        <div className="border-top border-secondary pt-3 text-center">
          <p className="text-white-50 mb-0">
            &copy; {currentYear} Virtual Doctor Robot | College Project by Neupane-Rajan
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;