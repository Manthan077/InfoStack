import { useState } from "react";

export default function ImageUpload() {
  const [image, setImage] = useState(null);

  const handleImage = (file) => {
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImage(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed rounded-xl p-4 text-center bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors"
    >
      <h3 className="font-medium text-gray-700 mb-2">
        🖼️ Image Input (Multimodal)
      </h3>

      {!image ? (
        <>
          <p className="text-sm text-gray-500 mb-3">
            Drag & drop an image or click to upload
          </p>

          <label className="inline-block cursor-pointer bg-white border px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImage(e.target.files[0])}
            />
          </label>

          <p className="mt-2 text-xs text-gray-400">
            (For diagrams, notes, scanned docs – future vision support)
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <img
            src={image}
            alt="preview"
            className="w-40 h-40 object-cover rounded-lg shadow"
          />
          <span className="text-xs text-green-600 font-medium">
            Image ready for analysis
          </span>
        </div>
      )}
    </div>
  );
}
