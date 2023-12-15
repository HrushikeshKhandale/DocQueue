// AdminDashboard.js
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import DoctorProfileEditable from "../DoctorProfileEditable";
import DoctorProfile from "../DoctorProfile";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [Appointments, setAppointments] = useState(null);

  useEffect(() => {
    fetchAppointments(); 
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost/api/appointments/get-all-appointments"
      );
      const appointments = await response.json();
      setAppointments(appointments);
    } catch (error) {
      console.log("Error fetching appoitments", error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/doctor/getdoctors"
      );
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.log("Error fetching doctors:", error.message);
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

  const handleDoctorEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/doctor/${doctorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete doctor: ${response.status}`);
      }

      // Refetch doctors after successful deletion
      await fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <br />

      <h2
        style={{
          position: "relative",
          marginLeft: "8cm ",
          marginBottom: "15cm",
        }}
      >
        Doctors
      </h2>
      <div
        className="card-container"
        id="cardCont"
        style={{ position: "relative", width: "30cm", top: "0" }}
      >
        {doctors.map((doctor) => (
          <Card key={doctor._id} style={{ width: "18rem", margin: "10px" }}>
            <Card.Body>
              <Card.Title>{doctor.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {doctor.specialty}
              </Card.Subtitle>
              <Card.Text>{doctor.hospital}</Card.Text>
              <Card.Text>{doctor.hospitalAddress}</Card.Text>
              <Button
                variant="primary"
                onClick={() => handleDoctorClick(doctor)}
              >
                View Profile
              </Button>
              <Button
                variant="warning"
                onClick={() => handleDoctorEdit(doctor)}
              >
                Edit Profile
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteDoctor(doctor._id)}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit {selectedDoctor.name}'s Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DoctorProfileEditable doctorId={selectedDoctor._id} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
