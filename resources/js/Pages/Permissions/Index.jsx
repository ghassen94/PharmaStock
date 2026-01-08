import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ permissions }) {
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    Inertia.post('/permissions', { name });
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Permissions</h1>

      <form onSubmit={submit} className="mt-4 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Permission name" className="border p-2 mr-2" />
        <button className="bg-blue-600 text-white px-3 py-1">Create</button>
      </form>

      <ul className="mt-4">
        {permissions.map(p => (
          <li key={p.id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <strong>{p.name}</strong>
            </div>
            <div className="space-x-2">
              <button onClick={() => {
                const newName = prompt('New name', p.name);
                if (!newName) return;
                Inertia.put(`/permissions/${p.id}`, { name: newName });
              }} className="text-yellow-600">Edit</button>
              <button onClick={() => {
                if (!confirm('Delete permission?')) return;
                Inertia.delete(`/permissions/${p.id}`);
              }} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
