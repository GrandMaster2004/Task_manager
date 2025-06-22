"use client";

import { useState } from "react";

const ApiDebug = () => {
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult("");

    try {
      // Test basic connection
      const response = await fetch("http://localhost:4000/");
      const text = await response.text();
      setTestResult(`Backend connection: ${response.status} - ${text}`);
    } catch (error) {
      setTestResult(`Backend connection failed: ${error.message}`);
    }

    setLoading(false);
  };

  const testAuth = async () => {
    setLoading(true);
    setTestResult("");

    try {
      // Test auth endpoint
      const response = await fetch("http://localhost:4000/api/user/me", {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || "no-token"
          }`,
        },
      });
      const data = await response.json();
      setTestResult(`Auth test: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setTestResult(`Auth test failed: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <h3 className="font-semibold mb-2">API Debug</h3>
      <div className="space-y-2">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Test Backend
        </button>
        <button
          onClick={testAuth}
          disabled={loading}
          className="w-full px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
        >
          Test Auth
        </button>
      </div>
      {testResult && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">{testResult}</div>
      )}
    </div>
  );
};

export default ApiDebug;
