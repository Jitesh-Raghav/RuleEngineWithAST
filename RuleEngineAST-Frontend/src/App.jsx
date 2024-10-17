import React from 'react';
import CreateRule from './components/CreateRule';
import CombineRules from './components/CombineRules';
import EvaluateRule from './components/EvaluateRule';

function App() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Rule Engine</h1>
      <CreateRule />
      <CombineRules />
      <EvaluateRule />
    </div>
  );
}

export default App;
