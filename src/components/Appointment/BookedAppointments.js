import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const BookedAppointments = ({doctorId}) => {
  const [appointments, setAppointments] = useState([]);
  const [cancelMessage, setCancelMessage] = useState(null);
  const [updateAppointmentId, setUpdateAppointmentId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    date: "",
    time: "",
    duration: "",
    status: "",
  });

  useEffect(() => {
    // Fetch booked appointments data when the component mounts

    fetchBookedAppointments();
  }, [doctorId]);





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
    // Set the updateAppointmentId to the clicked appointment ID
    setUpdateAppointmentId(appointmentId);

    // Set the update form data based on the clicked appointment
    const clickedAppointment = appointments.find(appointment => appointment._id === appointmentId);
    setUpdateFormData({
      date: clickedAppointment.date,
      time: clickedAppointment.time,
      duration: clickedAppointment.duration,
      status: clickedAppointment.status,
    });
  };

  const handleUpdateFormSubmit = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/appointment/update-appointment/${updateAppointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify(updateFormData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update appointment: ${response.status}`);
      }

      // Update successful, show success message
      setCancelMessage("Appointment updated successfully");

      // Clear the update form and appointment ID
      setUpdateFormData({
        date: "",
        time: "",
        duration: "",
        status: "",
      });
      setUpdateAppointmentId(null);

      // Refetch booked appointments after successful update
      await fetchBookedAppointments();

      // Clear the success message after 3000 milliseconds (3 seconds)
      setTimeout(() => {
        setCancelMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating appointment:", error.message);
      // Show an error message
      setCancelMessage(`Failed to update appointment: ${error.message}`);

      // Clear the error message after 3000 milliseconds (3 seconds)
      setTimeout(() => {
        setCancelMessage(null);
      }, 3000);
    }
  };


  const handleUpdateFormChange = (e) => {
    // Update the form data as the user interacts with the update form
    setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
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

      {/* Render update form only if updateAppointmentId is not null */}
      {updateAppointmentId !== null && (
        <div>
          <h3>Update Appointment</h3>
          <Form>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={updateFormData.date}
              onChange={handleUpdateFormChange}
            />
          </Form.Group>

          <Form.Group controlId="formTime">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={updateFormData.time}
              onChange={handleUpdateFormChange}
            />
          </Form.Group>

          <Form.Group controlId="formDuration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              value={updateFormData.duration}
              onChange={handleUpdateFormChange}
            />
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            {/* Adding a dropdown for status */}
            <Form.Control
              as="select"
              name="status"
              value={updateFormData.status}
              onChange={handleUpdateFormChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={handleUpdateFormSubmit}>
            Update
          </Button>
        </Form>
        </div>
      )}
    </div>
  );
};

export default BookedAppointments;
