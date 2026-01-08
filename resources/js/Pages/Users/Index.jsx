import React from "react";
import { Inertia } from "@inertiajs/inertia";
import UserTable from "./UserTable";

export default function Index({ users, roles }) {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Users</h1>
                <button onClick={() => Inertia.get("/users/create")} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add User</button>
            </div>

            <UserTable users={users} roles={roles} />
        </div>
    );
}
