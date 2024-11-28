// DraggableImage.tsx
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTgwOTN8MHwxfHNlYXJjaHw1fHxCTVd8ZW58MHx8fHwxNzMwNzg1Mjg5fDA&ixlib=rb-4.0.3&q=80&w=1080",
    top: "10px",
    left: "50px",
  },

  {
    src: "https://images.unsplash.com/photo-1699017200186-cc4d9f7d569b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTgwOTN8MHwxfHNlYXJjaHwxNXx8Qk1XfGVufDB8fHx8MTczMDc4NTI4OXww&ixlib=rb-4.0.3&q=80&w=1080",
    right: "50px",
    top: "50px",
  },

  {
    src: "https://images.unsplash.com/photo-1516610540415-d1b25463c7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTgwOTN8MHwxfHNlYXJjaHw5fHxCTVd8ZW58MHx8fHwxNzMwNzg1Mjg5fDA&ixlib=rb-4.0.3&q=80&w=1080",
    bottom: "10%",
    left: "5%",
  },
  {
    src: "https://images.unsplash.com/photo-1660985248084-9f4210c9d93d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTgwOTN8MHwxfHNlYXJjaHwyMnx8Qk1XfGVufDB8fHx8MTczMDc4NjQyOXww&ixlib=rb-4.0.3&q=80&w=1080",
    bottom: "25%",
    right: "5%",
  },
];

const DraggableImage: React.FC = () => {
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    // Import GSAP Draggable plugin conditionally
    import("gsap/Draggable").then((DraggableModule) => {
      const Draggable = DraggableModule.default;
      gsap.registerPlugin(Draggable);

      // Make each image draggable
      imageRefs.current.forEach((ref) => {
        if (ref) {
          Draggable.create(ref, {
            type: "x,y",
            edgeResistance: 1,
            bounds: "html",
            // inertia: true,
          });
        }
      });
    });
  }, []);

  const setRef = (el: HTMLImageElement | null, index: number) => {
    imageRefs.current[index] = el; // Assign the element to the ref array
  };

  return (
    <>
      {images.map((item, index) => (
        <Image
          key={index}
          ref={(el) => setRef(el, index)} // Use setRef to handle the ref assignment
          src={item.src}
          alt={`Draggable Element ${index + 1}`}
          width={300}
          className="rounded-xl"
          height={720}
          style={{
            position: "absolute",
            cursor: "grab",
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
          }} // Position them for visibility
        />
      ))}
    </>
  );
};

export default DraggableImage;
