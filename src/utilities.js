export const drawReact = (detections, ctx) =>{
    // Loop through each prediction
    detections.forEach(prediction => {
     
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = `${prediction['class']} - ${prediction['score'].toFixed(2)}%`; 
  
      // Set styling
      //const color = Math.floor(Math.random()*16777215).toString(16);
      const color = "EE4B2B"
      ctx.strokeStyle = '#' + color
      ctx.font = '36px Arial';
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = '#' + color
      ctx.fillText(text, x, y);

      ctx.rect(x, y, width, height); 
      ctx.stroke();
    });
  }