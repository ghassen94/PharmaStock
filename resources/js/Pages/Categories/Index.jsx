import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ categories }) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleDelete = (id) => {
    if (!confirm('Delete category?')) return;
    Inertia.delete(`/categories/${id}`);
  };

  function submit(e) {
    e.preventDefault();
    Inertia.post('/categories', { name });
    setName('');
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditingName(c.name);
  }

  function saveEdit(id) {
    Inertia.put(`/categories/${id}`, { name: editingName });
    setEditingId(null);
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">Categories</h2>
      }
    >
      <Head title="Categories" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <form onSubmit={submit} className="mb-6">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" className="border p-2 mr-2 rounded" />
                <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Create</button>
              </form>

              <ul className="mt-4 space-y-2">
                {categories.map(c => (
                  <li key={c.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                      {editingId === c.id ? (
                        <input value={editingName} onChange={e => setEditingName(e.target.value)} className="border p-2 rounded" />
                      ) : (
                        <strong>{c.name}</strong>
                      )}
                    </div>
                    <div className="space-x-2">
                      {editingId === c.id ? (
                        <>
                          <button onClick={() => saveEdit(c.id)} className="text-green-600 hover:text-green-800">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(c)} className="text-yellow-600 hover:text-yellow-800">Edit</button>
                          <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">Delete</button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
