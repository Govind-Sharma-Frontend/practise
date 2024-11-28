// pages/scrollAnimationPage.tsx
import dynamic from "next/dynamic";
import React from "react";

const ScrollImage = dynamic(() => import("@/components/ScrollImage"), {
  ssr: false, // Ensures the component only loads on the client side
});

const ScrollAnimationPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-center my-5 text-5xl font-semibold">
        Scrolling animation
      </h1>
      <ScrollImage />
      <div style={{ height: "200vh", backgroundColor: "#f0f0f0" }}>
        {/* Adding extra height for scrolling */}
        <h2 className="text-center my-5 text-4xl">
          Scroll Down for More Content
        </h2>
        {/* Repeat or add more content here */}
      </div>
    </div>
  );
};

export default ScrollAnimationPage;
