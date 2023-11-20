import React from "react";
import DoctorList from "../DoctorList";

const UserDashboard = () => {
  return (
    <div
      className="container mt-4"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100vh",
        backgroundColor: "#f2f2f2",
        padding: "0 20px",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      <DoctorList />
    </div>
  );
};

export default UserDashboard;
