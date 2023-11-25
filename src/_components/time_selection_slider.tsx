import React from 'react';
import { useState, useEffect } from 'react';
import { set } from 'zod';

interface TimeSelectionSliderProps {
}

const TimeSelectionSlider: React.FC<TimeSelectionSliderProps> = (props) => {
    const [isTimeBlockMounted, setIsTimeBlockMounted] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseUp, setIsMouseUp] = useState(true);
    const [elementYPosition, setElementYPosition] = useState(0);
    const [elementHeight, setElementHeight] = useState(0);
    const [timeContainerRect, setTimeContainerRect] = useState({} as DOMRect);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsMouseDown(true);
        setIsMouseUp(false);
        setIsTimeBlockMounted(true);
        setTimeContainerRect(e.currentTarget.getBoundingClientRect());
        const rect = e.currentTarget.getBoundingClientRect();
        const maxTop = 2;
        const yPos = Math.max(e.clientY - rect.top-10, maxTop);
        setElementYPosition(yPos);
        setElementHeight(0);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const mouseMovingUp = (elementYPosition > e.clientY - timeContainerRect.top-10);
        if (mouseMovingUp) {
            let newYPos = Math.max(e.clientY - timeContainerRect.top-10, 5);
            setElementYPosition(newYPos);
            setElementHeight(elementHeight - e.movementY);
        }
        let newHeight = e.clientY - timeContainerRect.top - elementYPosition;
        const maxHeight = timeContainerRect.height - (elementYPosition+15);
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
        }
        if (!mouseMovingUp) {
            setElementHeight(newHeight);
        }
    };

    useEffect(() => {
        const handleMouseUp = () => {
            setIsMouseUp(true);
            elementHeight == 0 ? setIsTimeBlockMounted(false) : setIsTimeBlockMounted(true);
            setIsMouseDown(false);
            window.removeEventListener('pointerup', handleMouseUp);
        };
        if (isMouseDown) {
            window.addEventListener('pointerup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('pointerup', handleMouseUp);
        };
    }, [isMouseDown, elementHeight, isMouseUp, isTimeBlockMounted]);
  
  return (
    <div 
        className='w-full rounded-xl bg-zinc-50 border-spacing-1 h-[200px] py-2 px-4 '
        onPointerDown={handleMouseDown}
        onPointerMove={isMouseDown ? handleMouseMove: undefined}
        >
            {/* <div className='absolute top-0 left-0'>{yPos}</div> */}
            {isTimeBlockMounted && (
                <div
                    className={`bg-fuchsia-200 rounded-xl border-fuchsia-100 border-4 transition duration-200 ${isMouseDown ? 'shadow-xl' : 'shadow-sm'}`}
                    style={{
                        position: 'relative',
                        left: 0,
                        top: `${elementYPosition}px`,
                        height: `${elementHeight}px`,
                        width: '100%',
                        minHeight: '20px',
                    }}
                />
            )}
    </div>
  );
};

export default TimeSelectionSlider;
