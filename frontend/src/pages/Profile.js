import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [profilePic, setProfilePic] = useState("");

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      loadProfile(storedUser.email);
    }

  }, []);

  const loadProfile = async (email) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/profile/${email}`
      );

      const data = res.data;

      setName(data.name || "");
      setEmail(data.email || "");
      setMobile(data.mobile || "");
      setAddress(data.address || "");
      setCity(data.city || "");
      setState(data.state || "");
      setCountry(data.country || "");
      setProfilePic(data.profilePic || "");

    } catch (error) {
      alert("Error loading profile");
    }

  };

  /* =========================
     IMAGE
  ========================= */

  const handleImageUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result); // base64
    };

    reader.readAsDataURL(file);

  };

  /* =========================
     SAVE
  ========================= */

  const saveProfile = async () => {

    if (mobile && mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/api/updateProfile",
        {
          name,
          email,
          mobile,
          address,
          city,
          state,
          country,
          profilePic // ✅ now saved
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Profile Updated Successfully ✅");
      setEdit(false);

    } catch (err) {
      alert("Profile update failed");
    }

    setLoading(false);
  };

  /* =========================
     UI
  ========================= */

  return (

    <div className="container mt-5">

      <div className="card col-md-6 mx-auto p-4 shadow-lg rounded">

        <h3 className="text-center mb-3 text-primary">
          👤 My Profile
        </h3>

        {/* PROFILE IMAGE */}
        <div className="text-center mb-3">

          <img
            src={profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="profile"
            width="120"
            height="120"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #0d6efd"
            }}
          />

          {edit && (
            <input
              type="file"
              className="form-control mt-3"
              onChange={handleImageUpload}
            />
          )}

        </div>

        {/* FORM */}

        <div className="row">

          <div className="col-md-6">
            <label>Name</label>
            <input
              className="form-control"
              value={name}
              disabled={!edit}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label>Email</label>
            <input
              className="form-control"
              value={email}
              disabled
            />
          </div>

          <div className="col-md-6 mt-3">
            <label>Mobile</label>
            <input
              className="form-control"
              value={mobile}
              disabled={!edit}
              onChange={(e)=>setMobile(e.target.value)}
            />
          </div>

          <div className="col-md-6 mt-3">
            <label>City</label>
            <input
              className="form-control"
              value={city}
              disabled={!edit}
              onChange={(e)=>setCity(e.target.value)}
            />
          </div>

          <div className="col-md-6 mt-3">
            <label>State</label>
            <input
              className="form-control"
              value={state}
              disabled={!edit}
              onChange={(e)=>setState(e.target.value)}
            />
          </div>

          <div className="col-md-6 mt-3">
            <label>Country</label>
            <input
              className="form-control"
              value={country}
              disabled={!edit}
              onChange={(e)=>setCountry(e.target.value)}
            />
          </div>

          <div className="col-12 mt-3">
            <label>Address</label>
            <textarea
              className="form-control"
              value={address}
              disabled={!edit}
              onChange={(e)=>setAddress(e.target.value)}
            />
          </div>

        </div>

        {/* BUTTON */}

        {!edit ? (
          <button
            className="btn btn-primary mt-4 w-100"
            onClick={()=>setEdit(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="btn btn-success mt-4 w-100"
            onClick={saveProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}

      </div>

    </div>

  );

}

export default Profile;