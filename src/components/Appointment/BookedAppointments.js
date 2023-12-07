import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";

const BookedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [cancelMessage, setCancelMessage] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Fetch booked appointments data when the component mounts
    fetchBookedAppointments();
  }, []);

  const fetchBookedAppointments = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/appointment/get-appointments", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch booked appointments: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching booked appointments:", error.message);
    }
  };

  const handleUpdate = (appointmentId) => {
    // Redirect to the update page with the appointmentId
    history.push(`/booked-appointments/${appointmentId}/update`);
  };

  const handleDelete = async (appointmentId) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/appointment/cancel-appointment/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel appointment: ${response.status}`);
      }

      // Refetch booked appointments after successful cancellation
      await fetchBookedAppointments();

      // Show a success message
      setCancelMessage("Appointment canceled successfully");

      // Clear the message after 3000 milliseconds (3 seconds)
      setTimeout(() => {
        setCancelMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error canceling appointment:", error.message);

      // Show an error message
      setCancelMessage(`Failed to cancel appointment: ${error.message}`);

      // Clear the message after 3000 milliseconds (3 seconds)
      setTimeout(() => {
        setCancelMessage(null);
      }, 3000);
    }
  };

  return (
    <div>
      <h2>Booked Appointments</h2>

      {/* Display success or error message */}
      {cancelMessage && <div style={{ color: "green" }}>{cancelMessage}</div>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor</th>
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
              <td>
                {/* Display doctor's name and link to their profile */}
                <Link to={`/doctor-profile/${appointment.doctor._id}`}>
                  {appointment.doctor.name}
                </Link>
              </td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.duration}</td>
              <td>{appointment.status}</td>
              <td>
                <Button variant="info" onClick={() => handleUpdate(appointment._id)}>
                  Update
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(appointment._id)}>
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BookedAppointments;
