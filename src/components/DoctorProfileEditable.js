import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const DoctorProfileEditable = ({ doctorId }) => {
  const [doctor, setDoctor] = useState(null);
  const [editedDoctor, setEditedDoctor] = useState({});
  const history = useHistory();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
          console.error("Token not found in localStorage");
          return;
        }

        const response = await fetch(`http://localhost:3001/api/doctor/${doctorId}`, {
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch doctor profile: ${response.status}`);
        }

        const data = await response.json();
        setDoctor(data);
        setEditedDoctor(data); // Set the initial state for editing
      } catch (error) {
        console.error("Error fetching doctor profile:", error.message);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleEditProfile = async () => {
    try {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/doctor/${doctorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify(editedDoctor),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit doctor profile: ${response.status}`);
      }

      // Optional: You can update the local state with the edited data if needed
      // setDoctor(editedDoctor);

      history.push("/"); // Redirect to the home page or any other page after editing
    } catch (error) {
      console.error("Error editing doctor profile:", error.message);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/doctor/${doctorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete doctor profile: ${response.status}`);
      }

      history.push("/"); // Redirect to the home page or any other page after deletion
    } catch (error) {
      console.error("Error deleting doctor profile:", error.message);
    }
  };

  const handleInputChange = (e) => {
    // Update the editedDoctor state as the user makes changes
    setEditedDoctor({
      ...editedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={editedDoctor.name || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formSpecialty">
          <Form.Label>Specialty</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter specialty"
            name="specialty"
            value={editedDoctor.specialty || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formHospital">
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter hospital"
            name="hospital"
            value={editedDoctor.hospital || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formHospitalAddress">
          <Form.Label>Hospital Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter hospital address"
            name="hospitalAddress"
            value={editedDoctor.hospitalAddress || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleEditProfile}>
          Save Changes
        </Button>
        <Button variant="danger" onClick={handleDeleteProfile}>
          Delete Profile
        </Button>
      </Form>
    </div>
  );
};

export default DoctorProfileEditable;
