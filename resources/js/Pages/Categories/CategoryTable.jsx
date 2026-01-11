import React from "react";
import CategoryRow from "./CategoryRow";

export default function CategoryTable({ categories }) {
    return (
        <table className="w-full table-auto border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                {categories.map((category) => (
                    <CategoryRow key={category.id} category={category} />
                ))}
            </tbody>
        </table>
    );
}

