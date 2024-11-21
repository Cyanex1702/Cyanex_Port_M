"use client";
import { useCallback } from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    profileImage: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  // ... (keeping all the state and handlers the same)
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ... (keeping all the callback functions and effects the same)
  const getDirection = useCallback(() => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  }, [direction, containerRef]);

  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  }, [speed, containerRef]);

  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [containerRef, scrollerRef, getDirection, getSpeed, setStart]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  // ... (keeping all the event handlers the same)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
    document.body.classList.add('disable-select');
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startPosition) * 3;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPosition(e.touches[0].pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current!.offsetLeft;
    const walk = (x - startPosition) * 3;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const scrollLeftFunc = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRightFunc = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative h-[500px] md:h-[650px] w-full">
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 h-[calc(100%-60px)] w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex h-full min-w-full shrink-0 gap-4 md:gap-16 py-4 w-max flex-nowrap",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {items.map((item, idx) => (
            <li
              className="w-[85vw] md:w-[60vw] h-[calc(100%-20px)] relative rounded-2xl border border-b-0 
                flex-shrink-0 border-slate-800 px-4 py-6 md:p-16 overflow-y-auto"
              style={{
                background: "rgb(4,7,29)",
                backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
              }}
              key={idx}
            >
              <blockquote className="h-full flex flex-col justify-between">
                <div
                  aria-hidden="true"
                  className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <div className="flex-grow overflow-y-auto mb-6">
                  <span className="relative z-20 text-sm md:text-lg leading-[1.6] text-white font-normal">
                    {item.quote}
                  </span>
                </div>
                <div className="relative z-20 flex flex-row items-center">
                  <div className="me-3">
                    <Image
                      src={item.profileImage}
                      alt={item.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      width={250}
                      height={250}
                    />
                  </div>
                  <span className="flex flex-col gap-1">
                    <span className="text-lg md:text-xl font-bold leading-[1.6] text-white">
                      {item.name}
                    </span>
                    <span className="text-xs md:text-sm leading-[1.6] text-white-200 font-normal">
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={scrollLeftFunc}
          className="p-3 md:p-4 bg-gray-800 text-white rounded-full hover:bg-yellow-400 hover:text-black"
        >
          <FaRegArrowAltCircleLeft size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
        <button
          onClick={scrollRightFunc}
          className="p-3 md:p-4 bg-gray-800 text-white rounded-full hover:bg-yellow-400 hover:text-black"
        >
          <FaRegArrowAltCircleRight size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </div>
  );
};
