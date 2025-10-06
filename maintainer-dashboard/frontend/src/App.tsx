import React from "react";

// SIMPLE TEST COMPONENT - This will help us verify React is working
export default function App() {
  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      backgroundColor: "#f0f9ff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1 style={{ 
        color: "#1e40af", 
        fontSize: "3rem",
        marginBottom: "1rem",
        fontWeight: "bold"
      }}>
        🎉 Hello Dashboard!
      </h1>
      <p style={{ 
        color: "#374151", 
        fontSize: "1.5rem",
        marginBottom: "2rem"
      }}>
        React is working correctly on localhost:3004
      </p>
      <div style={{ 
        background: "#dbeafe", 
        padding: "30px", 
        borderRadius: "12px",
        border: "3px solid #3b82f6",
        maxWidth: "600px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ color: "#1e40af", marginBottom: "1rem", fontSize: "1.8rem" }}>
          ✅ Vite React App is Working!
        </h2>
        <ul style={{ textAlign: "left", color: "#1e40af", fontSize: "1.2rem", lineHeight: "1.6" }}>
          <li>✅ React is mounting to DOM correctly</li>
          <li>✅ Vite dev server is running on port 3004</li>
          <li>✅ JSX is rendering properly</li>
          <li>✅ File extensions are correct</li>
          <li>✅ No 404 errors</li>
        </ul>
        <p style={{ 
          marginTop: "1.5rem", 
          color: "#1e40af",
          fontWeight: "bold",
          fontSize: "1.1rem"
        }}>
          🚀 Ready to restore the full dashboard!
        </p>
      </div>
    </div>
  );
}