import React from "react";
import DoctorList from "../DoctorList";

const UserDashboard = () => {
  return (
    <div
      className="container mt-4"
      style={{
        justifyContent: "flex-start",
        height: "100vh",
        backgroundColor: "#f2f2f2",
        flexWrap: "wrap",
        display: "flex",
      }}
    >
      <DoctorList />
    </div>
  );
};

export default UserDashboard;
