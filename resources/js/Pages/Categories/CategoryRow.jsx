import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function CategoryRow({ category }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);

    function save() {
        Inertia.put(`/categories/${category.id}`, { name });
        setEditing(false);
    }

    function remove() {
        if (confirm("Delete this category?")) {
            Inertia.delete(`/categories/${category.id}`);
        }
    }

    return (
        <tr className="border-t">
            <td className="p-2">
                {editing ? (
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-1 rounded w-full"
                    />
                ) : (
                    <strong>{category.name}</strong>
                )}
            </td>

            <td className="p-2">
                {editing ? (
                    <>
                        <button
                            onClick={save}
                            className="text-green-600 mr-2 hover:text-green-800"
                        >
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
                        {can.update && (
                            <Button onClick={() => handleEdit(cat.id)}>
                                Modifier
                            </Button>
                        )}
                        {can.delete && (
                            <Button onClick={() => handleDelete(cat.id)}>
                                Supprimer
                            </Button>
                        )}
                        {/* <button
                            onClick={() => Inertia.get(`/categories/${category.id}/edit`)}
                            className="text-blue-600 mr-2 hover:text-blue-800"
                        >
                            Edit
                        </button>

                        <button onClick={remove} className="text-red-600 hover:text-red-800">
                            Delete
                        </button> */}
                    </>
                )}
            </td>
        </tr>
    );
}

