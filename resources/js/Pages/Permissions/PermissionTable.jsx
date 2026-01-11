import React from "react";
import PermissionRow from "./PermissionRow";

export default function PermissionTable({ permissions }) {
    return (
        <table className="w-full table-auto border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                {permissions.map((permission) => (
                    <PermissionRow key={permission.id} permission={permission} />
                ))}
            </tbody>
        </table>
    );
}

