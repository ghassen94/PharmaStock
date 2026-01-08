import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ roles, permissions }) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPerms, setEditedPerms] = useState([]);

  function togglePermission(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  function submit(e) {
    e.preventDefault();
    Inertia.post('/roles', { name, permissions: selected });
    setName('');
    setSelected([]);
  }

  function startEdit(role) {
    setEditingId(role.id);
    setEditedName(role.name);
    setEditedPerms(role.permissions.map(p => p.id));
  }

  function toggleEditedPerm(id) {
    setEditedPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  function saveEdit(id) {
    Inertia.put(`/roles/${id}`, { name: editedName, permissions: editedPerms });
    setEditingId(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Roles</h1>

      <form onSubmit={submit} className="mt-4 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Role name" className="border p-2 mr-2" />
        <button className="bg-blue-600 text-white px-3 py-1">Create</button>

        <div className="mt-3">
          {permissions.map(p => (
            <label key={p.id} className="mr-4">
              <input type="checkbox" checked={selected.includes(p.id)} value={p.id} onChange={() => togglePermission(p.id)} /> {p.name}
            </label>
          ))}
        </div>
      </form>

      <ul className="mt-4">
        {roles.map(r => (
          <li key={r.id} className="border p-2 mb-2">
            {editingId === r.id ? (
              <div className="flex flex-col gap-2">
                <input value={editedName} onChange={e => setEditedName(e.target.value)} className="border p-2" />
                <div>
                  {permissions.map(p => (
                    <label key={p.id} className="mr-4">
                      <input type="checkbox" checked={editedPerms.includes(p.id)} onChange={() => toggleEditedPerm(p.id)} /> {p.name}
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <button onClick={() => saveEdit(r.id)} className="bg-green-600 text-white px-3 py-1 mr-2">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{r.name}</strong> — {r.permissions.map(p => p.name).join(', ')}
                </div>
                <div className="space-x-2">
                  <button onClick={() => startEdit(r)} className="text-yellow-600">Edit</button>
                  <button onClick={() => {
                    if (!confirm('Delete role?')) return;
                    Inertia.delete(`/roles/${r.id}`);
                  }} className="text-red-600">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
