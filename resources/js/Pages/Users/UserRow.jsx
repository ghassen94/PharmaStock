import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function UserRow({ user, roles }) {
    const [editing, setEditing] = useState(false);
    const [data, setData] = useState({
        type: user.type,
        roles: user.roles.map((r) => r.id),
    });

    function toggleRole(id) {
        setData({
            ...data,
            roles: data.roles.includes(id)
                ? data.roles.filter((r) => r !== id)
                : [...data.roles, id],
        });
    }

    function save() {
        Inertia.put(`/users/${user.id}`, data);
        setEditing(false);
    }

    function remove() {
        if (confirm("Delete this user?")) {
            Inertia.delete(`/users/${user.id}`);
        }
    }

    return (
        <tr className="border-t">
            <td className="p-2">{user.name}</td>
            <td className="p-2">{user.email}</td>

            <td className="p-2">
                {editing ? (
                    <select
                        value={data.type}
                        onChange={(e) =>
                            setData({ ...data, type: e.target.value })
                        }
                        className="border p-1"
                    >
                        <option value="user">User</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                ) : (
                    user.type
                )}
            </td>

            <td className="p-2">
                {editing
                    ? roles.map((r) => (
                          <label key={r.id} className="mr-2">
                              <input
                                  type="checkbox"
                                  checked={data.roles.includes(r.id)}
                                  onChange={() => toggleRole(r.id)}
                              />{" "}
                              {r.name}
                          </label>
                      ))
                    : user.roles.map((r) => r.name).join(", ")}
            </td>

            <td className="p-2">
                {editing ? (
                    <>
                        <button onClick={save} className="text-green-600 mr-2">
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="text-gray-600"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() =>
                                Inertia.get(`/users/${user.id}/edit`)
                            }
                            className="text-blue-600 mr-2"
                        >
                            Edit
                        </button>

                        <button onClick={remove} className="text-red-600">
                            Delete
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}
