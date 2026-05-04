import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await fetch("/profile/", {
        credentials: "include"
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setUser(data);
      setRemoveImage(false);
    } catch (err) {
      setMessage("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setFile(null);
    setUser({
      ...user,
      profile_picture: null
    });
    setMessage("Image will be removed after saving");
  };

  const handleCancel = () => {
    setEdit(false);
    setFile(null);
    setRemoveImage(false);
    setMessage("");
    loadProfile();
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("email", user.email || "");
    formData.append("phone_number", user.phone_number || "");
    formData.append("bio", user.bio || "");

    if (removeImage) {
      formData.append("remove_image", "true");
    }

    if (file && !removeImage) {
      formData.append("profile_picture", file);
    }

    try {
      const res = await fetch("/profile/", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      setMessage(data.message);
      setEdit(false);
      setFile(null);
      setRemoveImage(false);
      loadProfile();
    } catch (err) {
      setMessage("Profile update failed");
    }
  };

  const handleLogout = async () => {
    await fetch("/logout/", {
      credentials: "include"
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px]">
        <h2 className="text-3xl font-bold text-center mb-6">Profile</h2>

        <div className="flex flex-col items-center mb-6">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
          )}

          <p className="mt-3 font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>

        <input
          type="file"
          disabled={!edit}
          onChange={(e) => {
            setFile(e.target.files[0]);
            setRemoveImage(false);
          }}
          className="w-full mb-3"
        />

        {edit && user.profile_picture && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-full mb-3 border border-red-400 text-red-600 py-2 rounded-lg"
          >
            Remove Profile Image
          </button>
        )}

        <input
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          disabled={!edit}
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-3"
        />

        <input
          name="phone_number"
          value={user.phone_number || ""}
          onChange={handleChange}
          disabled={!edit}
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg mb-3"
        />

        <textarea
          name="bio"
          value={user.bio || ""}
          onChange={handleChange}
          disabled={!edit}
          placeholder="Bio"
          className="w-full p-3 border rounded-lg mb-3"
        />

        <p className="text-center text-sm text-green-600 mb-3">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={edit ? handleCancel : () => setEdit(true)}
            className="w-full border py-2 rounded-lg"
          >
            {edit ? "Cancel" : "Edit"}
          </button>

          {edit && (
            <button
              onClick={handleSave}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Save
            </button>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}