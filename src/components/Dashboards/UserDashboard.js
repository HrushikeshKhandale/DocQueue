import React from "react";

const UserDashboard = () => {
  return (
    <div className="container mt-4">
      <h1>User Dashboard</h1>
      <div className="row">
        <div className="col-md-8">
          {/* Other content of the user dashboard */}
          <DoctorsList />
        </div>
        <div className="col-md-4">
          {/* Add any additional content or components here */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
