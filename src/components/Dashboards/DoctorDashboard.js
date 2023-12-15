import React, { useState, useEffect } from "react";
import { Button, Table, Spinner, Alert } from "react-bootstrap";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch doctor's booked appointments data when the component mounts
    fetchDoctorAppointments();
  }, []);

  const fetchDoctorAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const authToken = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/appointment/doctor-appointments",
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(
            `Failed to fetch doctor's appointments: ${response.status}`
          );
        }
  
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching doctor's appointments:", error.message);
        setError("Failed to fetch doctor's appointments. Please try again.");
      } finally {
        setLoading(false);
      }
  };
  

  const handleCancelAppointment = async (appointmentId) => {
    console.log("Canceling appointment with ID:", appointmentId);

    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/appointment/cancel-doc-appointment/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`Failed to cancel appointment: ${response.status}`);
      }

      // Refetch doctor's appointments after successful cancellation
      await fetchDoctorAppointments();
    } catch (error) {
      console.error("Error canceling appointment:", error.message);
    }
  };

  return (
    <div className="container mt-4" id="docCont">
      <h2>Doctor's Dashboard</h2>
      <br />
      <h3>Appointments</h3>
      {loading && <Spinner animation="border" role="status" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.user.name}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.duration}</td>
                <td>{appointment.status}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <br />
      <br />
    </div>
  );
};

export default DoctorDashboard;
