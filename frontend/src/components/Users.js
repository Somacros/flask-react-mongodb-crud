import React, { useState, useEffect, useRef } from "react"

const API = process.env.REACT_APP_API

export const Users = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [editing, setEditing] = useState(false)
  const [id, setId] = useState("")

  const nameInput = useRef(null)

  let [users, setUsers] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editing) {
      const res = await fetch(`${API}/medicos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      await res.json()
    } else {
      const res = await fetch(`${API}/medicos/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await res.json();
      setEditing(false);
      setId('')
    }
    await getUsers();

    setName('')
    setEmail('')
    setPassword('')
    nameInput.current.focus()
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/medicos`);
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    const userResponse = window.confirm('¿Está seguro de eliminar el registro?');
    if (userResponse) {
      const res = await fetch(`${API}/medicos/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      await getUsers();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/medicos/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    // Reset
    setName(data.name);
    setEmail(data.email);
    setPassword(data.password);
    nameInput.current.focus();
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="row">
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control"
              placeholder="Nombre"
              ref={nameInput}
              autoFocus
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-control"
              placeholder="Contraseña"
            />
          </div>
          <button className="btn btn-success btn-block">
            {editing ? "Actualizar" : "Crear"}
          </button>
        </form>
      </div>
      <div className="col-md-6">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    className="btn btn-light btn-sm btn-block"
                    onClick={(e) => editUser(user._id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={(e) => deleteUser(user._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
