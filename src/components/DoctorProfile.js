
import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import AppointmentBooking from "../components/Appointment/AppointmentBooking";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const DoctorProfile = ({ doctorId }) => {
  const [doctor, setDoctor] = useState(null);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  // const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
          console.error("Token not found in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:3001/api/doctor/${doctorId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch doctor profile: ${response.status}`);
        }

        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error.message);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  const handleToggleAppointmentBooking = () => {
    // Set the state to open the AppointmentBooking component
    setShowAppointmentBooking(true);
  };

  // Function to close the AppointmentBooking component
  const handleCloseAppointmentBooking = () => {
    setShowAppointmentBooking(false);
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{doctor.name}'s Profile</Card.Title>
          <Card.Text>
          <strong>Email:</strong> {doctor.email}<br />
             <strong>Specialty:</strong> {doctor.specialty}<br />
             <strong>Hospital:</strong> {doctor.hospital}<br />
             <strong>Hospital Address:</strong> {doctor.hospitalAddress}<br />
             <strong>Contact Phone:</strong> {doctor.contactDetails && doctor.contactDetails.phone}<br />
             <strong>Achievements:</strong> {doctor.achievements && doctor.achievements.join(", ")}
           </Card.Text>
           <ListGroup variant="flush">
             <ListGroup.Item>
               <h5>Information for Patients</h5>
               <p>
                 <strong>Languages:</strong>{" "}
                 {doctor.infoForPatients
                   ? doctor.infoForPatients.languages.join(", ")
                   : "Not available"}
               </p>
               <p>
                 <strong>Patient Instructions:</strong>{" "}
                 {doctor.infoForPatients
                   ? doctor.infoForPatients.patientInstructions
                   : "Not available"}
               </p>
               <p>
                 <strong>Additional Info:</strong>{" "}
                 {doctor.infoForPatients
                   ? doctor.infoForPatients.additionalInfo
                   : "Not available"}
               </p>
             </ListGroup.Item>
           </ListGroup>

          {/* Button to open/close AppointmentBooking component */}
          <Button variant="primary" onClick={handleToggleAppointmentBooking}>
            {showAppointmentBooking ? "Close Booking" : "Book Appointment"}
          </Button>
        </Card.Body>
      </Card>

      {/* Render the AppointmentBooking component if showAppointmentBooking is true */}
      {showAppointmentBooking && (
        <AppointmentBooking
          doctorId={doctorId}
          onClose={handleCloseAppointmentBooking}
        />
      )}
    </div>
  );
};

export default DoctorProfile;
