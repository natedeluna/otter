import React, { use } from 'react';
import { useState, useEffect, useRef } from 'react';
import { set } from 'zod';

interface TimeSelectionSliderProps {
}

const TimeSelectionBlock: React.FC = ({ elementYPosition, timeBlockHeight, isMouseDown }) => {
    return (
        <div
        className={`timeSelectionSlider bg-fuchsia-200 rounded-xl border-fuchsia-100 border-4 transition duration-200 ${isMouseDown ? 'shadow-xl' : 'shadow-sm'}`}
        style={{
            position: 'relative',
            left: 0,
            top: `${elementYPosition}px`,
            width: '100%',
            minHeight: `${timeBlockHeight}px`,
        }}>
            <div className='resize-top absolute flex items-center w-full justify-center h-5 opacity-0 transition duration-200 hover:opacity-100  '>
                <div className='relative bg-[#f9e2ff] h-[5px] w-[20%] rounded-md'></div>
            </div>
            <div className='resize-bottom absolute bottom-0 left-0 flex items-center w-full justify-center h-5 opacity-0 transition duration-200 hover:opacity-100  '>
                <div className='relative bg-[#f9e2ff] h-[5px] w-[20%] rounded-md'></div>
            </div>
        <div className="removeTimeBlock absolute right-0 top-0 m-2 hover:border-fuchsia-900 text-fuchsia-900 text-xs cursor-pointer transition duration-300">remove</div>
    </div>
    );
}

const TimeSelectionSlider: React.FC<TimeSelectionSliderProps> = (props) => {
    const [showTimeBlock, setShowTimeBlock] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseUp, setIsMouseUp] = useState(true);
    const [elementYPosition, setElementYPosition] = useState(0);
    const [elementHeight, setElementHeight] = useState(20);
    const [timeContainerRect, setTimeContainerRect] = useState({} as DOMRect);
    const [mouseDownAnchor, setMouseDownAnchor] = useState(0);
    const [timeBlockHeight, setTimeBlockHeight] = useState(20);
    const [moveTimeBlock, setMoveTimeBlock] = useState(false);
    const [resizeTimeBlock, setResizeTimeBlock] = useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const t = e.target as HTMLDivElement;
        setIsMouseDown(true);
        setIsMouseUp(false);
        setTimeContainerRect(e.currentTarget.getBoundingClientRect());
        if (t == document.querySelector('.timeSelectionSlider')) {
            console.log('move time block');
            setMouseDownAnchor(e.clientY);
            setMoveTimeBlock(true);
            return;
        }

        if (t== document.querySelector('.resize-top') || t == document.querySelector('.resize-bottom')) {
            setMoveTimeBlock(false);
            setResizeTimeBlock(true);
            return;
        }
        if (t == document.querySelector('.removeTimeBlock')) {
            document.querySelector('.timeSelectionSlider').remove();
            return;
        }
        setShowTimeBlock(true);
        setMouseDownAnchor(e.clientY);
        const rect = e.currentTarget.getBoundingClientRect();
        const maxTop = 2;
        const yPos = Math.max(e.clientY - rect.top-10, maxTop);
        setElementYPosition(yPos);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (resizeTimeBlock) {
            return
        }

        if (moveTimeBlock) {
            let slider = document.querySelector('.timeSelectionSlider');
            let currentTop = parseFloat(slider.style.top);
            let currentHeight = parseFloat(slider.style.height);
            let finalTop = currentTop + e.movementY;
            let maxTop = (timeContainerRect.height-20) - currentHeight;

            if (finalTop < 6) {finalTop = 6;};
            if (finalTop > maxTop) {finalTop = maxTop};

            slider.style.top = `${finalTop}px`;

            return;
        }
        const mouseMovingUp = (elementYPosition > e.clientY - timeContainerRect.top-10);
        let slider = document.querySelector('.timeSelectionSlider');
        if (mouseMovingUp && timeContainerRect.top+15 < e.clientY) {
            let newYPos = Math.max(e.clientY - timeContainerRect.top-10, 5);
            slider.style.top = `${newYPos}px`;
            slider.style.height = `${(mouseDownAnchor - e.clientY)+timeBlockHeight}px`;
            return
        }
        let newHeight = e.clientY - timeContainerRect.top - elementYPosition;
        const maxHeight = timeContainerRect.height - (elementYPosition+15);
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
        }
        slider.style.height = `${newHeight}px`;
    };

    useEffect(() => {
        const handleMouseUp = () => {
            let slider = document.querySelector('.timeSelectionSlider');
            const height = slider.getBoundingClientRect().height;
            setIsMouseUp(true);
            setMouseDownAnchor(0);
            setTimeBlockHeight(height);
            setIsMouseDown(false);
            setMoveTimeBlock(false);
            setResizeTimeBlock(false);
            window.removeEventListener('pointerup', handleMouseUp);
        };
        if (isMouseDown) {
            window.addEventListener('pointerup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('pointerup', handleMouseUp);
        };
    }, [isMouseDown, elementHeight, isMouseUp]);
  
  return (
    <div 
        className='w-full rounded-xl bg-zinc-50 border-spacing-1 h-[300px] py-2 px-4 timeSelectionContainer'
        onPointerDown={handleMouseDown}
        onPointerMove={isMouseDown ? handleMouseMove: undefined}
        >
                        {showTimeBlock && (
                <TimeSelectionBlock 
                elementYPosition={elementYPosition}
                timeBlockHeight={elementHeight}
                isMouseDown={isMouseDown}
                />
            )}
    </div>
  );
};

export default TimeSelectionSlider;
