import React, { useEffect, useState } from "react";
import { auth, storage } from "../firebase/firebase";
import { updateProfile, updatePassword, onAuthStateChanged } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // Import storage methods
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

// Helper function to generate avatar if user doesn't have one
const getAvatarUrl = (user) => {
  if (user?.photoURL) return user.photoURL;

  // Use DiceBear API with stylish font for initials
  const seed = user?.email || user?.displayName || "user";
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=6366f1&fontWeight=700&fontSize=48&radius=50`;
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cover, setCover] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // File state
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setName(u.displayName || "");
        // Use generated avatar if user doesn't have one
        setAvatar(getAvatarUrl(u));
      }
    });
    return () => unsub();
  }, []);

  // Update avatar when name changes
  useEffect(() => {
    if (user && name) {
      // Only update if user doesn't have a custom uploaded photo
      if (!user.photoURL || user.photoURL.includes('dicebear') || user.photoURL.includes('ui-avatars')) {
        setAvatar(getAvatarUrl({ displayName: name, email: user.email }));
      }
    }
  }, [name, user]);

  const handleImage = (file, type) => {
    if (!file) return;

    // Create preview URL
    const url = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatar(url);

      // Convert to base64 for upload (fixes CORS issues)
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarFile(reader.result); // Store base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setCover(url);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    setMsg("⏳ Saving...");
    try {
      // Generate avatar URL for the new name
      const newAvatarURL = getAvatarUrl({ displayName: name, email: user.email });

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: newAvatarURL,
      });

      // Force update avatar immediately
      setAvatar(newAvatarURL);
      setUser({ ...user, displayName: name, photoURL: newAvatarURL });

      setMsg("✅ Profile updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setMsg("❌ Error: " + (error.message || "Failed to save profile"));
    } finally {
      setLoading(false);
    }
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
      {/* COVER - Fixed Rectangular Size */}
      {/* <div className="w-full h-20 sm:h-48 md:h-64 bg-gray-300">        <img
        src={cover || defaultCover}
        className="w-full h-full object-cover" // Important: Fixed shape logic
      />
      </div> */}

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
            src={avatar || (user ? getAvatarUrl({ displayName: name || user.displayName, email: user.email, photoURL: user.photoURL }) : "https://api.dicebear.com/7.x/initials/svg?seed=U&backgroundColor=6366f1&fontWeight=700&fontSize=60&radius=50")}
            alt="Profile"
            onError={(e) => {
              e.target.src = "https://api.dicebear.com/7.x/initials/svg?seed=U&backgroundColor=6366f1&fontWeight=700&fontSize=60&radius=50";
            }}
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
              Managing expenses smarter with <b>Hisaab</b> 💸<br />
              Simple • Secure • Fast
            </p>

            {/* STATS */}
            <div className="flex gap-10 mt-4">
              <Stat title="Status" value="Active" />
              <Stat
                title="Verified"
                value={
                  <span className="flex items-center gap-1 text-green-800">
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
            className="absolute top-4 right-4 px-4 py-2 rounded-lg border-2 border-indigo-600 text-black font-medium hover:bg-indigo-600 hover:text-white transition-colors duration-300"
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

        {msg && <p className="mt-4 text-sm font-medium text-indigo-600">{msg}</p>}
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

              {/* Avatar Preview - Shows first letter of name */}
              <div className="w-28 h-28 mx-auto mb-6">
                <img
                  src={name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.charAt(0).toUpperCase())}&backgroundColor=6366f1&fontWeight=700&fontSize=60&radius=50` : avatar}
                  className="w-full h-full rounded-full object-cover border-4 border-indigo-100"
                  alt="Avatar Preview"
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
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
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