import React, { useState, useEffect } from "react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments when the component mounts
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http:localhost:3001/api/appointment/get-appointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http:localhost:3001/api/appointment/cancel-appointment/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // Refresh the appointments list after cancellation
        fetchAppointments();
      } else {
        console.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  return (
    <div>
      <h3>Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Doctor</th>
              <th scope="col">Specialty</th>
              <th scope="col">Hospital</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.doctor.name}</td>
                <td>{appointment.doctor.specialty}</td>
                <td>{appointment.doctor.hospital}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
