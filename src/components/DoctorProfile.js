import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DoctorProfile = ({ doctorId }) => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        // Get the token from localStorage
        const authToken = localStorage.getItem('token');

        // Check if authToken is present
        if (!authToken) {
          console.error('Token not found in localStorage');
          // Handle the absence of a token, such as redirecting to the login page
          return;
        }

        // Make the fetch request with the token
        const response = await fetch(`http://localhost:3001/api/doctor/${doctorId}`, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch doctor profile: ${response.status}`);
        }

        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error.message);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{doctor.name}'s Profile</h2>
      <p>Email: {doctor.email}</p>
      <p>Specialty: {doctor.specialty}</p>
      <p>Hospital: {doctor.hospital}</p>
      <p>Hospital Address: {doctor.hospitalAddress}</p>
      <p>Contact Phone: {doctor.contactDetails && doctor.contactDetails.phone}</p>
      <p>Achievements: {doctor.achievements && doctor.achievements.join(', ')}</p>
      <div>
        <h3>Information for Patients</h3>
        <p>Languages: {doctor.infoForPatients && doctor.infoForPatients.languages.join(', ')}</p>
        <p>Patient Instructions: {doctor.infoForPatients && doctor.infoForPatients.patientInstructions}</p>
        <p>Additional Info: {doctor.infoForPatients && doctor.infoForPatients.additionalInfo}</p>
      </div>
      {/* Add other details as needed */}
    </div>
  );
};

export default DoctorProfile;
