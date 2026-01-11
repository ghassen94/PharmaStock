import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function RoleRow({ role, permissions }) {
    const [editing, setEditing] = useState(false);
    const [data, setData] = useState({
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });

    function togglePermission(id) {
        setData({
            ...data,
            permissions: data.permissions.includes(id)
                ? data.permissions.filter((p) => p !== id)
                : [...data.permissions, id],
        });
    }

    function save() {
        Inertia.put(`/roles/${role.id}`, data);
        setEditing(false);
    }

    function remove() {
        if (confirm("Delete this role?")) {
            Inertia.delete(`/roles/${role.id}`);
        }
    }

    return (
        <tr className="border-t">
            <td className="p-2">
                {editing ? (
                    <input
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="border p-1 rounded w-full"
                    />
                ) : (
                    <strong>{role.name}</strong>
                )}
            </td>

            <td className="p-2">
                {editing
                    ? permissions.map((p) => (
                          <label key={p.id} className="mr-2">
                              <input
                                  type="checkbox"
                                  checked={data.permissions.includes(p.id)}
                                  onChange={() => togglePermission(p.id)}
                                  className="mr-1"
                              />{" "}
                              {p.name}
                          </label>
                      ))
                    : role.permissions.map((p) => p.name).join(", ")}
            </td>

            <td className="p-2">
                {editing ? (
                    <>
                        <button onClick={save} className="text-green-600 mr-2 hover:text-green-800">
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => Inertia.get(`/roles/${role.id}/edit`)}
                            className="text-blue-600 mr-2 hover:text-blue-800"
                        >
                            Edit
                        </button>

                        <button onClick={remove} className="text-red-600 hover:text-red-800">
                            Delete
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}

