import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import '../css/Profile.css';

function Profile() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        mobile: '',
        address: '',
        role: '',
        image: null
    });
    const [editMode, setEditMode] = useState({
        username: false,
        email: false,
        mobile: false,
        address: false
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setErrorMessage('No token found. Please log in.');
                    return;
                }

                const response = await axios.get('http://localhost:3001/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fetchedUser = response.data.user;
                setUser(fetchedUser);

                if (fetchedUser.image) {
                    setImagePreview(`data:image/jpeg;base64,${fetchedUser.image}`);
                }
            } catch (error) {
                setErrorMessage('Error fetching profile');
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && /^image\/(jpeg|png)$/.test(file.type)) {
            setUser((prevUser) => ({ ...prevUser, image: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setErrorMessage('Unsupported image format. Please upload JPEG or PNG.');
        }
    };

    const handleEditClick = (field) => {
        setEditMode((prevEditMode) => ({ ...prevEditMode, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('username', user.username);
            formData.append('email', user.email);
            formData.append('mobile', user.mobile);
            formData.append('address', user.address);
            if (user.image) {
                formData.append('image', user.image); // Append the image file
            }

            await axios.post('http://localhost:3001/profile/update', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated successfully');
            setEditMode({ username: false, email: false, mobile: false, address: false });
        } catch (error) {
            setErrorMessage('Error updating profile');
        }
    };

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
      <div className="profile-page">
        <div className="profile-container">
            <h2>Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="profile-pic">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile"  />
                    ) : (
                        <div className="placeholder">No Image</div>
                    )}
                    <div className="image-upload">
                        <input type="file" accept="image/jpeg, image/png" name="image" onChange={handleImageChange} />
                    </div>
                </div>

                <div className="profile-details">
                    <label>Username</label>
                    <div className="input-edit-container">
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleInputChange}
                            disabled={!editMode.username}
                        />
                        <FaEdit className="edit-icon" onClick={() => handleEditClick('username')} />
                    </div>

                    <label>Email</label>
                    <div className="input-edit-container">
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            disabled={!editMode.email}
                        />
                        <FaEdit className="edit-icon" onClick={() => handleEditClick('email')} />
                    </div>

                    <label>Mobile</label>
                    <div className="input-edit-container">
                        <input
                            type="text"
                            name="mobile"
                            value={user.mobile}
                            onChange={handleInputChange}
                            disabled={!editMode.mobile}
                        />
                        <FaEdit className="edit-icon" onClick={() => handleEditClick('mobile')} />
                    </div>

                    <label>Address</label>
                    <div className="input-edit-container">
                        <textarea
                            name="address"
                            value={user.address}
                            onChange={handleInputChange}
                            disabled={!editMode.address}
                        />
                        <FaEdit className="edit-icon" onClick={() => handleEditClick('address')} />
                    </div>
                    <label>Role</label>
                    <div className="input-edit-container">
                    
                    <input type="text" value={user.role} disabled />
                    </div>
                </div>

                <button type="submit" className="update-btn">Update Profile</button>
            </form>
        </div>
        </div>
    );
}

export default Profile;
