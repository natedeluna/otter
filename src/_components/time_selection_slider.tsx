import React from 'react';
import { useState } from 'react';

interface TimeSelectionSliderProps {
}

const TimeSelectionSlider: React.FC<TimeSelectionSliderProps> = (props) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [initialY, setInitialY] = useState(0);
    const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
    const [elementHeight, setElementHeight] = useState(0);
    const [yPos, setyPos] = useState(0);
    const [timeContainerRect, setTimeContainerRect] = useState({} as DOMRect);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsMouseDown(true);
        setTimeContainerRect(e.currentTarget.getBoundingClientRect());
        const rect = e.currentTarget.getBoundingClientRect();
        const maxTop = 2;
        const yPos = Math.max(e.clientY - rect.top-10, maxTop);
        setElementPosition({ ...elementPosition, y: yPos });
        setElementHeight(0);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isMouseDown) return;
        setyPos(e.clientY);
        let newHeight = e.clientY - timeContainerRect.top - elementPosition.y;
        const maxHeight = timeContainerRect.height - (elementPosition.y+15);
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
    }
        setElementHeight(newHeight);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };
  
  return (
    <div 
        className='w-full rounded-lg bg-zinc-50 border-spacing-1 h-[200px] p-2 '
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        >
            {/* <div className='absolute top-0 left-0'>{yPos}</div> */}
            {isMouseDown && (
                <div
                    className='bg-fuchsia-100'
                    style={{
                        position: 'relative',
                        left: 0,
                        borderRadius: '4.5px',
                        top: `${elementPosition.y}px`,
                        width: '100%',
                        minHeight: '10px',
                        height: `${elementHeight}px`,
                    }}
                />
            )}
    </div>
  );
};

export default TimeSelectionSlider;
