import React from "react";
export default function Welcome({auth}) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="text-center p-6 max-w-xl">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    PharmaStock
                </h1>

                <p className="text-gray-700 text-lg mb-6">
                    Gestion des stocks pharmaceutiques — administration simple et sécurisée.
                </p>

                {auth.user ? (
                    <a href={route('users.index')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow-lg transition">Accueil</a>
                ) : (
                    <a href={route('login')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow-lg transition">Connexion</a>
                )}
            </div>

            <footer className="mt-12 text-gray-500 text-sm">
                &copy; 2026 PharmaStock. Tous droits réservés.
            </footer>
        </div>
    );
}
