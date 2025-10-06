import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel = ({ images, autoPlay = true, interval = 5000, className = "" }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images.length) return null;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Main Image */}
      <div className="relative h-full">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 w-10 h-10 p-0"
              onClick={goToPrevious}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 w-10 h-10 p-0"
              onClick={goToNext}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {/* Slide Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-background/50 hover:bg-background/70'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation (Optional) */}
      {images.length > 1 && images.length <= 6 && (
        <div className="flex space-x-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-border'
              }`}
              onClick={() => goToSlide(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;