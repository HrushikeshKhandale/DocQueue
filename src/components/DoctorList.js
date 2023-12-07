import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DoctorProfile from './DoctorProfile'; 

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch the list of doctors when the component mounts
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/doctor/getdoctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
    }
  };


  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };


  return (
    <div>
      <h2 >Doctors</h2>
      <div className="card-container" style={{        display: "flex",
}}>
        {doctors.map((doctor) => (
          <Card key={doctor._id} style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
              <Card.Title>{doctor.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{doctor.specialty}</Card.Subtitle>
              <Card.Text>{doctor.hospital}</Card.Text>
              <Card.Text>{doctor.hospitalAddress}</Card.Text>
              <Button variant="primary" onClick={() => handleDoctorClick(doctor)}>
                View Profile
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Doctor Profile Modal */}
 {selectedDoctor && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedDoctor.name}'s Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DoctorProfile doctorId={selectedDoctor._id} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DoctorList;
