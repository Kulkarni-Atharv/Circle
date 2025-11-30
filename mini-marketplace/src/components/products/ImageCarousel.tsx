/**
 * ImageCarousel component
 * 
 * Swipeable image carousel for displaying multiple product images.
 * Features navigation arrows, dots indicator, and touch support.
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
    images: string[]
    alt: string
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    /**
     * Navigate to previous image
     */
    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    /**
     * Navigate to next image
     */
    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    /**
     * Navigate to specific image
     */
    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    if (images.length === 0) {
        return (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
            </div>
        )
    }

    return (
        <div className="relative w-full">
            {/* Main image container */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-muted">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${alt} - Image ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>

                {/* Navigation arrows - only show if multiple images */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                            onClick={handlePrevious}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                            onClick={handleNext}
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all',
                                index === currentIndex
                                    ? 'bg-primary w-4'
                                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                            )}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
