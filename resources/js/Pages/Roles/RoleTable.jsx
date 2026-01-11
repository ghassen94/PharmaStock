import React from "react";
import RoleRow from "./RoleRow";

export default function RoleTable({ roles, permissions }) {
    return (
        <table className="w-full table-auto border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Permissions</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                {roles.map((role) => (
                    <RoleRow key={role.id} role={role} permissions={permissions} />
                ))}
            </tbody>
        </table>
    );
}

