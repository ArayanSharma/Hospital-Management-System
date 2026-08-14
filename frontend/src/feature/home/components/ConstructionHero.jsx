import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ConstructionHero() {
  const triggerRef = useRef(null);
  const canvasRef = useRef(null);
  const currentFrameRef = useRef(0);
  const imageElementsRef = useRef([]);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedPercent, setLoadedPercent] = useState(0);

  // 1. Draw image to canvas using responsive object-cover logic
  const drawImage = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imageElementsRef.current[index];
    if (!img || !img.complete) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate aspect ratio for object-cover
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 2. Preload all 50 frames
  useEffect(() => {
    let loadedCount = 0;
    const total = 50;
    const preloadedImages = [];

    for (let i = 1; i <= total; i++) {
      const num = String(i).padStart(3, '0');
      // Resolve path using Vite's dynamic asset URL
      const imgUrl = new URL(`../../../assets/herovideo/ezgif-frame-${num}.jpg`, import.meta.url).href;
      
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        loadedCount++;
        setLoadedPercent(Math.round((loadedCount / total) * 100));
        if (loadedCount === total) {
          setImagesLoaded(true);
        }
      };
      preloadedImages.push(img);
    }
    imageElementsRef.current = preloadedImages;
  }, []);

  // 3. Manage canvas size and redraw on resize
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawImage(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);

  // 4. GSAP ScrollTrigger Setup
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw the first frame initially
    drawImage(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5, // responsive scroll scrub speed
          invalidateOnRefresh: true,
        },
      });

      // Frame animation from 0 to 49
      const frameObj = { frame: 0 };
      tl.to(frameObj, {
        frame: 49,
        snap: 'frame',
        ease: 'none',
        duration: 10,
        onUpdate: () => {
          currentFrameRef.current = frameObj.frame;
          drawImage(frameObj.frame);
        },
      });

      // Camera zooming and subtle panning
      tl.to(canvasRef.current, {
        scale: 1.08,
        x: 10,
        y: 5,
        ease: 'none',
        duration: 2,
      }, 0)
      .to(canvasRef.current, {
        scale: 1.12,
        x: -5,
        y: -10,
        ease: 'none',
        duration: 2,
      }, 2)
      .to(canvasRef.current, {
        scale: 1.06,
        x: 8,
        y: 12,
        ease: 'none',
        duration: 2,
      }, 4)
      .to(canvasRef.current, {
        scale: 1.03,
        x: -12,
        y: 4,
        ease: 'none',
        duration: 2,
      }, 6)
      .to(canvasRef.current, {
        scale: 1.0,
        x: 0,
        y: 0,
        ease: 'none',
        duration: 2,
      }, 8);

    }, triggerRef);

    return () => ctx.revert();
  }, [imagesLoaded]);

  // Loading state with visual percentage progress bar
  if (!imagesLoaded) {
    return (
      <div className="w-full h-screen bg-[#06152D] flex flex-col justify-center items-center text-white">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-4 animate-pulse">
          Preloading Cinematic Sequence
        </div>
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-[#0076FF] transition-all duration-150"
            style={{ width: `${loadedPercent}%` }}
          />
        </div>
        <div className="text-[10px] tracking-wider text-neutral-500 mt-2 font-mono">
          {loadedPercent}%
        </div>
      </div>
    );
  }

  return (
    <div ref={triggerRef} className="relative w-full h-[600vh] bg-[#06152D] select-none">
      {/* Sticky Canvas Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Subtle Dark Cinematic Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/40 mix-blend-multiply" />
        
        {/* GPU-Accelerated Canvas for Frame Drawing */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full transform will-change-transform" 
        />

      </div>
    </div>
  );
}
