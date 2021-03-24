import React from 'react';
import './Ripple.scss';

export const RippleButton = ({Component, children, clickHandler = () => {}, style = {}}) => {
    const rippleButton = (e) => {
        const button = e.currentTarget;
        console.log(button);
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height =  `${diameter}px`;
        circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
          }
        button.append(circle);
        clickHandler();
    }
    return <Component onClick={(e) => rippleButton(e)} style={style}>
        {children}
    </Component>
}



