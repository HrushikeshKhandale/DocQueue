import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";

const AppointmentBooking = ({ doctorId, onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const authToken = localStorage.getItem("token");
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

    fetchDoctorDetails();
  }, [doctorId]);

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      duration: 0,
      day: null,
    },
    validationSchema: Yup.object({
      date: Yup.date().required("Date is required"),
      duration: Yup.number()
        .required("Duration is required")
        .min(1, "Duration must be at least 1 minute"),
    }),

    onSubmit: async (values) => {
      console.log("Form Values:", values);
      setLoading(true);
      try {
        const authToken = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/appointment/book-appointment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            },
            body: JSON.stringify({
              doctor: doctorId,
              user: userId,
              date: values.date,
              day: values.date.toLocaleDateString("en-US", { weekday: "long" }),
              // Assuming the server expects the time in 24-hour format without AM/PM
              time: values.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
              duration: values.duration,
            }),
          }
        );

        console.log("Response:", response);

        if (!response.ok) {
          throw new Error(`Failed to book appointment: ${response.status}`);
        }

        const data = await response.json();
        console.log("Appointment booked successfully:", data);
      } catch (error) {
        console.error("Error booking appointment:", error.message);
        formik.setStatus(`Failed to book appointment. ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      {doctor && (
        <div>
          <h4>Doctor Information</h4>
          <p>Name: {doctor.name}</p>
          <p>Specialty: {doctor.specialty}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      <form onSubmit={formik.handleSubmit}>
        {/* Date and Time Picker */}
        <DatePicker
          showTimeSelect
          timeFormat="h:mm aa"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          selected={formik.values.date}
          onChange={(date) => {
            formik.setFieldValue("date", date);
            const selectedDay = date ? date.getDay() : null;
            formik.setFieldValue("day", selectedDay);
          }}
        />

        {/* Duration Input */}
        <input
          type="number"
          name="duration"
          value={formik.values.duration}
          onChange={formik.handleChange}
        />

        {/* Display form errors */}
        {formik.errors.date && <div>{formik.errors.date}</div>}
        {formik.errors.duration && <div>{formik.errors.duration}</div>}
        {formik.status && <div style={{ color: "red" }}>{formik.status}</div>}

        {/* Submit Button */}
        <Button variant="secondary" type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </form>

      <br />
      {/* Close Button */}
      <Button variant="secondary" type="button" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export default AppointmentBooking;







