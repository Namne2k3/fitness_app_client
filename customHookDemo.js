import React from 'react';

function ChildComponent({ handleClick }) {
    console.log("Child component rendered");

    return <button onClick={handleClick}>Click me</button>;
}

export default React.memo(ChildComponent);
