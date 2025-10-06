import React from 'react';

// Fallback component for any missing or broken components
export function FallbackComponent({ name = "Component" }) {
  return (
    <div style={{ 
      padding: "20px", 
      textAlign: "center", 
      border: "2px dashed #ccc",
      borderRadius: "8px",
      margin: "20px"
    }}>
      <h2 style={{ color: "#666" }}>{name} Loading...</h2>
      <p style={{ color: "#888" }}>
        If this message persists, there may be an issue with the {name} component.
      </p>
    </div>
  );
}

// Error fallback for any component that fails to load
export function ErrorFallback({ error, resetError }) {
  return (
    <div style={{ 
      padding: "20px", 
      textAlign: "center",
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      margin: "20px"
    }}>
      <h2 style={{ color: "#dc2626" }}>Component Error</h2>
      <p style={{ color: "#991b1b" }}>
        Something went wrong loading this component.
      </p>
      <button 
        onClick={resetError}
        style={{
          padding: "8px 16px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px"
        }}
      >
        Try Again
      </button>
    </div>
  );
}