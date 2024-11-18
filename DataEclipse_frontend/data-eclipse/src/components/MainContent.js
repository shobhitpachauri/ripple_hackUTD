import React, { useState } from 'react';

function MainContent() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h2>Main Content</h2>
      <p>Click the button below to increase the counter:</p>
      <button onClick={() => setCount(count + 1)}>Counter: {count}</button>
    </main>
  );
}

export default MainContent;
