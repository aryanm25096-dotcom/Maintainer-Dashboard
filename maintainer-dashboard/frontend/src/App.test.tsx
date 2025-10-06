import React from "react";

// Simple test component to verify React is working
export default function AppTest() {
  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1 style={{ 
        color: "#1e40af", 
        fontSize: "2.5rem",
        marginBottom: "1rem"
      }}>
        🎉 Hello Maintainer Dashboard!
      </h1>
      <p style={{ 
        color: "#374151", 
        fontSize: "1.2rem",
        marginBottom: "2rem"
      }}>
        If you can see this, React is working correctly on localhost:5173
      </p>
      <div style={{ 
        background: "#e0f2fe", 
        padding: "20px", 
        borderRadius: "8px",
        border: "2px solid #0ea5e9",
        maxWidth: "500px"
      }}>
        <h2 style={{ color: "#0c4a6e", marginBottom: "1rem" }}>✅ Diagnosis Complete</h2>
        <ul style={{ textAlign: "left", color: "#0c4a6e" }}>
          <li>✅ React is mounting correctly</li>
          <li>✅ Vite server is running on port 5173</li>
          <li>✅ JSX is rendering properly</li>
          <li>✅ File extensions are correct</li>
        </ul>
        <p style={{ 
          marginTop: "1rem", 
          color: "#0c4a6e",
          fontWeight: "bold"
        }}>
          Next: We'll restore your full dashboard!
        </p>
      </div>
    </div>
  );
}