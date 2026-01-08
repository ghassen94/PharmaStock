import React, { useState } from "react";
// import { Inertia } from "@inertiajs/inertia";
import { router } from "@inertiajs/react";

export default function Edit({ user, roles }) {
    const [data, setData] = useState({
        name: user.name,
        email: user.email,
        password: "",
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

    function submit(e) {
        e.preventDefault();

        router.put(route("users.update", user.id), data, {
            preserveScroll: true,
        });
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
            <h1 className="text-xl font-bold mb-4">Edit User</h1>

            <form onSubmit={submit} className="space-y-3">
                <input
                    className="w-full border rounded-lg p-2"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                />

                <input
                    className="w-full border rounded-lg p-2"
                    value={data.email}
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    className="w-full border rounded-lg p-2"
                    placeholder="New password (optional)"
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                />

                <select
                    className="w-full border rounded-lg p-2"
                    value={data.type}
                    onChange={(e) => setData({ ...data, type: e.target.value })}
                >
                    <option value="user">User</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                </select>

                <div>
                    {roles.map((r) => (
                        <label key={r.id} className="mr-3">
                            <input
                                type="checkbox"
                                checked={data.roles.includes(r.id)}
                                onChange={() => toggleRole(r.id)}
                            />{" "}
                            {r.name}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => Inertia.get("/users")}
                        className="px-4 py-2 rounded-lg border"
                    >
                        Cancel
                    </button>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
