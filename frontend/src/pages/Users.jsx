import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("You're not authenticated");
        }
        if (err.response.status === 403) {
          alert("You're not authorized");
        }
        console.error(err);
      });
  }, []);

  return (
    <div>
      <p>Users List</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} - email: {user.email} - role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
