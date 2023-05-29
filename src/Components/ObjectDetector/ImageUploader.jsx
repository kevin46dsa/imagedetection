import React, { useState } from 'react';
import * as cocoSsd from 'coco-ssd'; // Assuming you have coco-ssd package installed

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [detectedObjects, setDetectedObjects] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;

      image.onload = async () => {
        // Create a new Coco SSD model
        const model = await cocoSsd.load();

        // Perform object detection on the image
        const predictions = await model.detect(image);

        setDetectedObjects(predictions);
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/jpeg" onChange={handleImageUpload} />
      {detectedObjects.map((object, index) => (
        <div key={index}>{object.class}</div>
      ))}
    </div>
  );
};

export default ImageUploader;