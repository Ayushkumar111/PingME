import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const ImageLightbox = ({ image, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.5, 5));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.5, 0.5));
  };
  
  // Reset to default view
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Mouse down to start dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  // Mouse move to drag image
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  // Mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-base-300/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
            onClick={handleZoomIn}
            className="btn btn-circle btn-sm bg-base-200"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="btn btn-circle btn-sm bg-base-200"
          >
            <ZoomOut size={16} />
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-circle btn-sm bg-base-200"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={onClose}
            className="btn btn-circle btn-sm bg-base-200"
          >
            <X size={16} />
          </button>
        </div>
        
        <div 
          className="overflow-hidden rounded-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={image}
            alt={alt || "Image"}
            className="object-contain max-h-[80vh] select-none"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease'
            }}
            draggable="false"
          />
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-base-content/70">
          {Math.round(scale * 100)}% • Click and drag to move • Scroll wheel to zoom
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;