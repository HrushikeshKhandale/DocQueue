import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AppointmentBooking = ({ doctorId, onClose }) => {
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.error('Token not found in localStorage');
          return;
        }

        const response = await fetch(`http://localhost:3001/api/doctor/${doctorId}`, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch doctor profile: ${errorData.error}`);
        }

        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error.message);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleSelectDate = (date) => {
    setSelectedTime(null);
    setIsAlreadyBooked(false);
    setSelectedDate(date);
  };

  const handleSelectTime = (time) => {
    if (doctor && doctor.availableTimes && selectedDate) {
      // Check if the selected time is within the available time slots
      const isValidTime = doctor.availableTimes[selectedDate].includes(time);
  
      // Check if the selected time is already booked
      const isBooked = doctor.appointments.some(
        (appointment) => appointment.date === selectedDate && appointment.time === time
      );
  
      // Set the selected time only if it's valid and not booked
      if (isValidTime && !isBooked) {
        setSelectedTime(time);
        setIsAlreadyBooked(false);
      } else {
        // Reset selected time if not valid or booked
        setSelectedTime(null);
        setIsAlreadyBooked(true);
      }
    }
  };
  

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Token not found in localStorage');
        return;
      }

      const response = await fetch('http://localhost:3001/api/appointment/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify({
          doctor: doctorId,
          date: selectedDate,
          day: '', // You might need to set the day based on your implementation
          time: selectedTime,
          duration: 30,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to book appointment: ${errorData.error}`);
      }

      // Redirect to a new route after successful booking
      history.push('/appointment-success');
    } catch (error) {
      console.error('Error booking appointment:', error.message);
      alert(`Failed to book appointment. ${error.message}`);
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Select Appointment Date and Time</h3>
      <Form onSubmit={handleBookAppointment}>
        <Form.Group controlId="formDate">
          <Form.Label>Select Date</Form.Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleSelectDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </Form.Group>

        {selectedDate && doctor.availableTimes && doctor.availableTimes[selectedDate] && (
          <Form.Group controlId="formTime">
            <Form.Label>Select Time</Form.Label>
            <TimePicker
              onChange={(time) => handleSelectTime(time)}
              value={selectedTime}
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" disabled={!selectedTime || isAlreadyBooked}>
          Book Appointment
        </Button>
      </Form>
    </div>
  );
};

export default AppointmentBooking;
