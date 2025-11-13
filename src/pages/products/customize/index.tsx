"use client";

import { useState, useEffect } from "react";
import ProductViewer from "@/components/three/ProductViewer";
import { useSearchParams } from "next/navigation";

export default function CustomizePage() {
  const productId = useSearchParams().get("id");

  const [product, setProduct] = useState<any>(null);
  const [materialsList, setMaterialsList] = useState<string[]>([]);
  const [targetMaterial, setTargetMaterial] = useState<string>("");
  const [image, setImage] = useState<string | undefined>();
  const [color, setColor] = useState<string>();

  // Fetch product details
  useEffect(() => {
    // if (!productId) return;

    const fetchProduct = async () => {
      const res = await fetch(
        `http://localhost:4000/api/products/${"6915706857960539207c4392"}`
      );
      const data = await res.json();
      setProduct(data.product);
    };

    fetchProduct();
  }, [productId]);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT — 3D Viewer */}
      <div className="w-2/3 h-[600px] border rounded-lg shadow">
        <ProductViewer
          modelUrl={product.modelUrl}
          userImage={image}
          color={color}
          targetMaterial={targetMaterial}
          onMaterialsDetected={(list) => {
            setMaterialsList(list);
            if (!targetMaterial) setTargetMaterial(list[0]); // auto-select first material
          }}
        />
      </div>

      {/* RIGHT — Controls */}
      <div className="w-1/3 p-4 border rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">{product.name}</h2>

        {/* Material Selector */}
        <div>
          <p className="font-semibold mb-1">Select Material:</p>
          <select
            className="border p-2 rounded w-full"
            value={targetMaterial}
            onChange={(e) => setTargetMaterial(e.target.value)}
          >
            {materialsList.map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Image */}
        <div>
          <p className="font-semibold mb-1">Upload Logo/Image:</p>
          <input type="file" onChange={handleImage} />
        </div>

        {/* Color Picker */}
        <div>
          <p className="font-semibold mb-1">Pick Color:</p>
          <input
            type="color"
            className="w-16 h-10"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Save Customization
        </button>
      </div>
    </div>
  );
}
