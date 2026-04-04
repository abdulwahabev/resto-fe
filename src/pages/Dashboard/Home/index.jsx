import React from 'react';

const Home = () => {
    return (
        <div
            className="container mt-5"
            style={{
                maxWidth: 800,
                padding: 30,
                borderRadius: 12,
                backgroundColor: "#f8f9fa",
                textAlign: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
            }}
        >
            {/* Heading */}
            <h1
                style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    marginBottom: 20,
                    color: "#1f1f1f"
                }}
            >
                Dashboard
            </h1>

            {/* Description */}
            <p style={{ fontSize: 16, color: "#333", lineHeight: 1.6 }}>
                Welcome to the Dashboard! Here you can manage your activities, monitor updates,
                and keep track of important information in one place. This centralized view helps
                you stay organized and efficiently handle your tasks.
            </p>

            <p style={{ fontSize: 16, color: "#333", lineHeight: 1.6 }}>
                Whether you are an admin managing products and users or a regular user
                checking your orders and profile, this dashboard provides a clear overview
                to make navigation simple and intuitive.
            </p>
        </div>
    );
};

export default Home;