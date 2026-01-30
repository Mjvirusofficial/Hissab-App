// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { updateProfile, updatePassword, onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import defaultCover from "../assets/coverMj.png";

/* 🔵 Blue Tick */
const BlueTick = () => (
  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.5 12l-2.25-2.6.3-3.4-3.4-.3L12 3 8.85 5.7l-3.4.3.3 3.4L3.5 12l2.25 2.6-.3 3.4 3.4.3L12 21l3.15-2.7 3.4-.3-.3-3.4L22.5 12zM10.8 15.6l-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5z" />
  </svg>
);

/* 📊 Stat Card */
const Stat = ({ title, value }) => (
  <div className="text-center">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cover, setCover] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setName(u.displayName || "");
        setAvatar(u.photoURL || "");
      }
    });
    return () => unsub();
  }, []);

  const handleImage = (file, type) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    type === "avatar" ? setAvatar(url) : setCover(url);
  };

  const saveProfile = async () => {
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: avatar,
    });
    setMsg("✅ Profile updated successfully");
    setOpen(false);
  };

  const changePassword = async () => {
    try {
      await updatePassword(auth.currentUser, password);
      setMsg("🔐 Password changed");
      setPassword("");
    } catch {
      setMsg("⚠️ Please re-login to change password");
    }
  };

  if (!user) return <p className="text-center mt-20">Please login</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* COVER */}
      <div className="">
        <img
          src={cover || defaultCover}
          className="w-full h-full object-cover"
        />
      </div>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-5xl mx-auto px-4 mt-6 relative"
      >
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 relative">
          {/* AVATAR */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={avatar || "https://i.pravatar.cc/200"}
            className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover"
          />

          {/* INFO */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              {name || "Your Name"}
              <BlueTick />
            </h2>

            <p className="text-gray-500">{user.email}</p>

            <p className="text-sm text-gray-400 mt-1">
              Joined {new Date(user.metadata.creationTime).toDateString()}
            </p>

            {/* BIO */}
            <p className="mt-3 text-gray-600 text-sm max-w-xl">
              Managing expenses smarter with <b>Hisaab</b> 💸  
              Simple • Secure • Fast
            </p>

            {/* STATS */}
            <div className="flex gap-10 mt-4">
              <Stat title="Status" value="Active" />
              <Stat
                title="Verified"
                value={
                  <span className="flex items-center gap-1 text-blue-600">
                    Yes <BlueTick />
                  </span>
                }
              />
              <Stat title="Account" value="Personal" />
            </div>
          </div>

          {/* EDIT PROFILE BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className=" absolute top-4 right-4 px-4 py-2 rounded-lg border-2 border-indigo-600 text-black font-medium 
                       hover:bg-indigo-600 hover:text-white transition-colors duration-300"
          >
            Edit Profile
          </button>
        </div>

        {/* SECURITY */}
        <div className="bg-white mt-6 rounded-xl shadow p-6 max-w-md">
          <h3 className="font-semibold mb-3">Security</h3>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <button
            onClick={changePassword}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Change Password
          </button>
        </div>

        {msg && <p className="mt-4 text-sm">{msg}</p>}
      </motion.div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-lg"
            >
              <h3 className="text-lg font-semibold mb-10">Edit Profile</h3>

              {/* COVER */}
              <div
                className="border-2 border-dashed rounded-lg h-28 flex items-center justify-center mb-4 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImage(e.dataTransfer.files[0], "cover");
                }}
                onClick={() => document.getElementById("coverInput").click()}
              >
                Drag & drop cover image
                <input
                  id="coverInput"
                  type="file"
                  hidden
                  onChange={(e) => handleImage(e.target.files[0], "cover")}
                />
              </div>

              {/* AVATAR */}
              <div
                className="border-2 border-dashed rounded-full w-28 h-28 mx-auto flex items-center justify-center mb-4 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImage(e.dataTransfer.files[0], "avatar");
                }}
                onClick={() => document.getElementById("avatarInput").click()}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  "Add photo"
                )}
                <input
                  id="avatarInput"
                  type="file"
                  hidden
                  onChange={(e) => handleImage(e.target.files[0], "avatar")}
                />
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border rounded-lg p-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setOpen(false)}>Cancel</button>
                <button
                  onClick={saveProfile}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
