import React from "react";
import UserRow from "./UserRow";

export default function UserTable({ users, roles }) {
    return (
        <table className="w-full table-auto border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Roles</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                {users.map((user) => (
                    <UserRow key={user.id} user={user} roles={roles} />
                ))}
            </tbody>
        </table>
    );
}
