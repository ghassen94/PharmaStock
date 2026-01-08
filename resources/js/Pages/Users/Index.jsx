import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ users, roles }) {
  const [creating, setCreating] = useState({ name: '', email: '', password: '', type: 'user', roles: [] });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ type: '', roles: [] });

  const handleDelete = (id) => {
    if (!confirm('Delete user?')) return;
    Inertia.delete(`/users/${id}`);
  };

  function toggleCreateRole(id) {
    const r = creating.roles.includes(id) ? creating.roles.filter(x => x !== id) : [...creating.roles, id];
    setCreating({ ...creating, roles: r });
  }

  function submitCreate(e) {
    e.preventDefault();
    Inertia.post('/users', creating).then(() => setCreating({ name: '', email: '', password: '', type: 'user', roles: [] }));
  }

  function startEdit(u) {
    setEditingId(u.id);
    setEditingData({ type: u.type, roles: u.roles.map(r => r.id) });
  }

  function toggleEditRole(id) {
    const r = editingData.roles.includes(id) ? editingData.roles.filter(x => x !== id) : [...editingData.roles, id];
    setEditingData({ ...editingData, roles: r });
  }

  function saveEdit(id) {
    Inertia.put(`/users/${id}`, editingData);
    setEditingId(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Users</h1>

      <form onSubmit={submitCreate} className="mt-4 mb-6 border p-4">
        <h2 className="font-medium mb-2">Create User</h2>
        <div className="flex gap-2 mb-2">
          <input value={creating.name} onChange={e => setCreating({ ...creating, name: e.target.value })} placeholder="Name" className="border p-2" />
          <input value={creating.email} onChange={e => setCreating({ ...creating, email: e.target.value })} placeholder="Email" className="border p-2" />
          <input value={creating.password} onChange={e => setCreating({ ...creating, password: e.target.value })} placeholder="Password" className="border p-2" />
          <select value={creating.type} onChange={e => setCreating({ ...creating, type: e.target.value })} className="border p-2">
            <option value="user">User</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          <button className="bg-blue-600 text-white px-3 py-1">Create</button>
        </div>
        <div>
          {roles.map(r => (
            <label key={r.id} className="mr-4">
              <input type="checkbox" checked={creating.roles.includes(r.id)} onChange={() => toggleCreateRole(r.id)} /> {r.name}
            </label>
          ))}
        </div>
      </form>

      <table className="w-full mt-4 table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {editingId === u.id ? (
                  <select value={editingData.type} onChange={e => setEditingData({ ...editingData, type: e.target.value })} className="border p-1">
                    <option value="user">User</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : u.type}
              </td>
              <td>
                {editingId === u.id ? (
                  <div>
                    {roles.map(r => (
                      <label key={r.id} className="mr-4">
                        <input type="checkbox" checked={editingData.roles.includes(r.id)} onChange={() => toggleEditRole(r.id)} /> {r.name}
                      </label>
                    ))}
                  </div>
                ) : (
                  u.roles.map(r => r.name).join(', ')
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)} className="text-red-500 mr-2">Delete</button>
                {editingId === u.id ? (
                  <>
                    <button onClick={() => saveEdit(u.id)} className="text-green-600 mr-2">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-600">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(u)} className="text-blue-600">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
