import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import '../css/Profile.css'; // Assuming you are reusing the Profile CSS

function DProfile() {
    const [driver, setDriver] = useState({
        username: '',
        email: '',
        mobile: '',
        address: '',
        license_id: '',
        identity_number: '',
        vehicle_number: '',
        vehicle_type: 'car', // default to 'car'
        vehicle_image: null,
        profile_image: null
    });
    const [editMode, setEditMode] = useState({
        username: false,
        email: false,
        mobile: false,
        address: false
    });
    const [vehicleImagePreview, setVehicleImagePreview] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    // UseRef for the vehicle image input field
    const vehicleImageInputRef = useRef(null);

    // Fetch driver profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setErrorMessage('No token found. Please log in.');
                    return;
                }

                const response = await axios.get('http://localhost:3001/dprofile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fetchedDriver = response.data.driver;
                setDriver(fetchedDriver);

                // Set image previews
                if (fetchedDriver.vehicle_image) {
                    setVehicleImagePreview(`data:image/jpeg;base64,${fetchedDriver.vehicle_image}`);
                }
                if (fetchedDriver.profile_image) {
                    setProfileImagePreview(`data:image/jpeg;base64,${fetchedDriver.profile_image}`);
                }
            } catch (error) {
                setErrorMessage('Error fetching profile');
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDriver((prevDriver) => ({ ...prevDriver, [name]: value }));
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file && /^image\/(jpeg|png)$/.test(file.type)) {
            setDriver((prevDriver) => ({ ...prevDriver, [type]: file }));
            if (type === 'vehicle_image') {
                setVehicleImagePreview(URL.createObjectURL(file));
            } else {
                setProfileImagePreview(URL.createObjectURL(file));
            }
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
            Object.keys(driver).forEach((key) => {
                if (key !== 'vehicle_image' || driver[key] instanceof File) {
                    formData.append(key, driver[key]);
                }
            });

            await axios.post('http://localhost:3001/dprofile/update', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated successfully');

            // Reset file input field after update
            if (vehicleImageInputRef.current) {
                vehicleImageInputRef.current.value = null;
            }

            setEditMode({
                username: false,
                email: false,
                mobile: false,
                address: false
            });
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
                    {/* Profile Image Section */}
                    <div className="profile-pic">
                        {profileImagePreview ? (
                            <img src={profileImagePreview} alt="Profile" />
                        ) : (
                            <div className="placeholder">No Profile Image</div>
                        )}
                        <div className="image-upload">
                            <label>Upload Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="profile_image"
                                onChange={(e) => handleImageChange(e, 'profile_image')}
                            />
                        </div>
                    </div>

                    {/* Vehicle Image Section */}
                    <div className="profile-pic">
                        {vehicleImagePreview ? (
                            <img src={vehicleImagePreview} alt="Vehicle" />
                        ) : (
                            <div className="placeholder">No Vehicle Image</div>
                        )}
                        <div className="image-upload">
                            <label>Upload Vehicle Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="vehicle_image"
                                ref={vehicleImageInputRef}  // Add ref to vehicle image input field
                                onChange={(e) => handleImageChange(e, 'vehicle_image')}
                            />
                        </div>
                    </div>

                    {/* Other Form Fields */}
                    <div className="profile-details">
                        <label>Username</label>
                        <div className="input-edit-container">
                            <input type="text" name="username" value={driver.username} onChange={handleInputChange} disabled={!editMode.username} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('username')} />
                        </div>

                        <label>Email</label>
                        <div className="input-edit-container">
                            <input type="email" name="email" value={driver.email} onChange={handleInputChange} disabled={!editMode.email} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('email')} />
                        </div>

                        <label>Mobile</label>
                        <div className="input-edit-container">
                            <input type="text" name="mobile" value={driver.mobile} onChange={handleInputChange} disabled={!editMode.mobile} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('mobile')} />
                        </div>

                        <label>Address</label>
                        <div className="input-edit-container">
                            <textarea name="address" value={driver.address} onChange={handleInputChange} disabled={!editMode.address} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('address')} />
                        </div>

                        <label>Vehicle Number</label>
                        <div className="input-edit-container">
                            <input type="text" name="vehicle_number" value={driver.vehicle_number} onChange={handleInputChange} disabled={!editMode.vehicle_number} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('vehicle_number')} />
                        </div>
                        <label>license Id</label>
                        <div className="input-edit-container">
                            <input type="text" name="license_id" value={driver.license_id} onChange={handleInputChange} disabled={!editMode.license_id} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('license_id')} />
                        </div>
                        <label>Idetity Number</label>
                        <div className="input-edit-container">
                            <input type="text" name="identity_number" value={driver.identity_number} onChange={handleInputChange} disabled={!editMode.identity_number} />
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('identity_number')} />
                        </div>

                        <label>Vehicle Type</label>
                        <div className="input-edit-container">
                            <select name="vehicle_type" value={driver.vehicle_type} onChange={handleInputChange} disabled={!editMode.vehicle_type}>
                                <option value="car">Car</option>
                                <option value="wheel">Wheel</option>
                                <option value="bike">Bike</option>
                                <option value="van">Van</option>
                            </select>
                            <FaEdit className="edit-icon" onClick={() => handleEditClick('vehicle_type')} />
                        </div>
                    </div>

                    <button type="submit" className="update-btn">Update Profile</button>
                </form>
            </div>
        </div>
    );
}

export default DProfile;
