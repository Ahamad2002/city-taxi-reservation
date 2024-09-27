import React, { useState } from 'react';
import '../css/ManageUsers.css'; // Import CSS file for styling

function ManageUsers() {
  // Fake data for admins
  const [admins, setAdmins] = useState([
    { id: 1, email: 'admin1@gmail.com', username: 'admin1', password: '******', role: 'admin' },
    { id: 2, email: 'admin2@gmail.com', username: 'admin2', password: '******', role: 'admin' }
  ]);

  // State for new admin form
  const [newAdmin, setNewAdmin] = useState({ email: '', username: '', password: '' });

  // Add new admin
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (newAdmin.email && newAdmin.username && newAdmin.password) {
      setAdmins([...admins, { ...newAdmin, id: admins.length + 1, role: 'admin' }]);
      setNewAdmin({ email: '', username: '', password: '' }); // Reset form
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // Delete admin
  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  // Update admin (For simplicity, just showing an alert)
  const handleUpdateAdmin = (admin) => {
    alert(`Update Admin: ${admin.username}`);
  };

  return (
    <div className="manage-users">
      <h1>Manage Admins</h1>

      {/* Add Admin Form */}
      <div className="add-admin-form">
        <h2>Add New Admin</h2>
        <form onSubmit={handleAddAdmin}>
          <input
            type="email"
            name="email"
            value={newAdmin.email}
            onChange={handleChange}
            placeholder="Admin Email"
            required
          />
          <input
            type="text"
            name="username"
            value={newAdmin.username}
            onChange={handleChange}
            placeholder="Admin Username"
            required
          />
          <input
            type="password"
            name="password"
            value={newAdmin.password}
            onChange={handleChange}
            placeholder="Admin Password"
            required
          />
          <button type="submit" className="add-btn">Add Admin</button>
        </form>
      </div>

      {/* Admin Table */}
      <div className="admin-table">
        <h2>Admin List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.email}</td>
                <td>{admin.username}</td>
                <td>
                  <button onClick={() => handleUpdateAdmin(admin)} className="update-btn">Update</button>
                  <button onClick={() => handleDeleteAdmin(admin.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
