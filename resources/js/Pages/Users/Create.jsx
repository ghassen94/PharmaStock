import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Create({ roles }) {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        type: "user",
        roles: [],
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
        Inertia.post("/users", data);
    }

    return (
        <div className="p-6 max-w-xl">
            <h1 className="text-xl font-bold mb-4">Create User</h1>

            <form onSubmit={submit} className="space-y-3">
                <input
                    className="border p-2 w-full"
                    placeholder="Name"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                />

                <input
                    className="border p-2 w-full"
                    placeholder="Email"
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    className="border p-2 w-full"
                    placeholder="Password"
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                />

                <select
                    className="border p-2 w-full"
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
                                onChange={() => toggleRole(r.id)}
                            />{" "}
                            {r.name}
                        </label>
                    ))}
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save
                </button>
            </form>
        </div>
    );
}
