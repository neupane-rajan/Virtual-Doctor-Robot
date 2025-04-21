import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Image } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfile } from '../../services/api';
import './Header.css'; // We'll create custom CSS for modern effects

function Header({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    if (token) {
      // Fetch user profile
      getProfile()
        .then(response => {
          const { first_name, last_name } = response.data;
          if (first_name && last_name) {
            setUserName(`${first_name} ${last_name}`);
          } else {
            setUserName('User');
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    }
    
    // Update current time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    // Add scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [token]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0] + ' ' + 
      date.toTimeString().split(' ')[0].substring(0, 5);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="cursor-pointer"
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  ));

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
      <Navbar 
        expand="lg" 
        className={`py-3 ${scrolled ? 'shadow-sm' : ''} transition-header`}
        variant="light" 
        bg="white"
        fixed="top"
      >
        <Container fluid="lg">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <div className="logo-container me-2">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" 
                width="40" 
                height="40" 
                alt="Virtual Doctor Logo"
                className="logo-image"
              />
            </div>
            <span className="brand-text">Virtual Doctor</span>
          </Navbar.Brand>
          
          {/* Date-Time Display */}
          <div className="d-none d-md-flex align-items-center me-auto ms-4 datetime-display">
            <i className="bi bi-clock-fill me-2"></i>
            <span>{formatDate(currentTime)}</span>
          </div>
          
          <Navbar.Toggle aria-controls="nav-menu" className="border-0 nav-toggle">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          
          <Navbar.Collapse id="nav-menu" className="justify-content-end">
            {token ? (
              <>
                <Nav className="me-auto modern-nav">
                  {[
                    { path: '/dashboard', icon: 'grid', label: 'Dashboard' },
                    { path: '/chat', icon: 'chat-dots', label: 'Chat' },
                    { path: '/symptoms/report', icon: 'clipboard-pulse', label: 'Symptoms' },
                    { path: '/medications', icon: 'capsule', label: 'Medications' },
                    { path: '/appointments', icon: 'calendar-check', label: 'Appointments' }
                  ].map((item) => (
                    <Nav.Link 
                      key={item.path}
                      as={Link} 
                      to={item.path} 
                      className={`nav-item-modern ${location.pathname.includes(item.path) ? 'active' : ''}`}
                    >
                      <i className={`bi bi-${item.icon} me-2`}></i>
                      <span>{item.label}</span>
                    </Nav.Link>
                  ))}
                </Nav>
                
                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                    <div className="d-flex align-items-center">
                      <div className="me-3 text-end d-none d-sm-block">
                        <div className="fw-bold user-name">{userName}</div>
                        <div className="user-role">Patient Account</div>
                      </div>
                      <div className="user-avatar">
                        <span>{userName.charAt(0)}</span>
                      </div>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Item as={Link} to="/profile" className="dropdown-item-modern">
                      <i className="bi bi-person-fill me-2"></i> My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings" className="dropdown-item-modern">
                      <i className="bi bi-gear-fill me-2"></i> Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="dropdown-item-modern">
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Nav className="ms-auto">
                <div className="d-flex">
                  <Button as={Link} to="/login" variant="outline-primary" className="btn-modern me-2">
                    Sign In
                  </Button>
                  <Button as={Link} to="/register" variant="primary" className="btn-modern">
                    Register
                  </Button>
                </div>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Breadcrumb */}
      {token && location.pathname !== '/' && (
        <div className="breadcrumb-section">
          <Container>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb modern-breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {location.pathname.split('/')[1].charAt(0).toUpperCase() + 
                   location.pathname.split('/')[1].slice(1)}
                </li>
              </ol>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

export default Header;