import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  delay?: number; // delay before showing tooltip (ms)
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  backgroundColor = "#1f2937", // default: Tailwind gray-800
  textColor = "#ffffff", // default: white
  delay = 50,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  useEffect(() => {
    if (show && wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spacing = 8;

      let top = wrapperRect.top - tooltipRect.height - spacing;
      let left =
        wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2;

      // Prevent overflow on the sides
      left = Math.max(
        10,
        Math.min(left, window.innerWidth - tooltipRect.width - 10)
      );

      // If tooltip goes off top, show it below
      if (top < 0) {
        top = wrapperRect.bottom + spacing;
      }

      setStyle({
        position: "fixed",
        top,
        left,
        zIndex: 9999,
      });

      setIsVisible(true);
    } else {
      // trigger fade-out before hiding
      setIsVisible(false);
      const timer = setTimeout(() => {
        setStyle({});
      }, 200); // match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [show, text]);

  return (
    <div
      ref={wrapperRef}
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {(show || isVisible) && (
        <div
          ref={tooltipRef}
          className="transition-opacity duration-200 ease-in-out px-3 py-1 text-sm rounded-md shadow-lg pointer-events-none"
          style={{
            ...style,
            backgroundColor,
            color: textColor,
            opacity: isVisible ? 1 : 0,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
