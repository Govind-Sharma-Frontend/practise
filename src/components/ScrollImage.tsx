// components/ScrollImage.tsx
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ScrollImage: React.FC = () => {
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: imageRef.current,
      start: "top top", // When the top of the image hits the top of the viewport
      end: "+=100%", // End the pin after scrolling 100% of the image height
      scrub: true, // Smoothly animate the scrolling
      pin: true, // Pin the image
    });

    return () => {
      trigger.kill(); // Clean up on unmount
    };
  }, []);

  return (
    <div ref={imageRef} className="image-container">
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
        aperiam accusamus expedita saepe consequuntur eos magnam. Numquam ipsam
        placeat quae aliquid quasi suscipit totam recusandae, nam maxime quis,
        aperiam ratione?
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
        aperiam accusamus expedita saepe consequuntur eos magnam. Numquam ipsam
        placeat quae aliquid quasi suscipit totam recusandae, nam maxime quis,
        aperiam ratione?
      </p>{" "}
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
        aperiam accusamus expedita saepe consequuntur eos magnam. Numquam ipsam
        placeat quae aliquid quasi suscipit totam recusandae, nam maxime quis,
        aperiam ratione?
      </p>{" "}
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
        aperiam accusamus expedita saepe consequuntur eos magnam. Numquam ipsam
        placeat quae aliquid quasi suscipit totam recusandae, nam maxime quis,
        aperiam ratione?
      </p>
      <Image
        src="https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTgwOTN8MHwxfHNlYXJjaHw1fHxCTVd8ZW58MHx8fHwxNzMwNzg1Mjg5fDA&ixlib=rb-4.0.3&q=80&w=1080"
        alt="Scroll-triggered Image"
        objectFit="cover"
        width={500}
        height={300}
      />
    </div>
  );
};

export default ScrollImage;
