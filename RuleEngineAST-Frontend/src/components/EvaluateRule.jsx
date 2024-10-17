import React, { useState } from 'react';
import axios from 'axios';

const EvaluateRule = () => {
    const [ruleId, setRuleId] = useState("");
    const [userData, setUserData] = useState([{ key: '', value: '' }]); // Initialize with one field
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const data = [...userData];
        data[index][name] = value;
        setUserData(data);
    };

    const addField = () => {
        setUserData([...userData, { key: '', value: '' }]); // Add a new field
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error before new submission

        // Transform userData into an object for the request
        const transformedData = userData.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value; // Only include non-empty keys
            return acc;
        }, {});

        try {
            const res = await axios.post('http://localhost:8080/rules/evaluate', {
                ruleId,
                userData: transformedData
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError('Error evaluating rule: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Evaluate Rule</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruleId">
                        Rule ID
                    </label>
                    <input
                        id="ruleId"
                        type="text"
                        value={ruleId}
                        onChange={(e) => setRuleId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Rule ID"
                        required
                    />
                </div>
                {userData.map((data, index) => (
                    <div className="mb-4" key={index}>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`key-${index}`}>
                            Key
                        </label>
                        <input
                            id={`key-${index}`}
                            type="text"
                            name="key"
                            value={data.key}
                            onChange={(e) => handleInputChange(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter parameter key (e.g., age)"
                            required
                        />
                        <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor={`value-${index}`}>
                            Value
                        </label>
                        <input
                            id={`value-${index}`}
                            type="text"
                            name="value"
                            value={data.value}
                            onChange={(e) => handleInputChange(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter parameter value (e.g., 20)"
                            required
                        />
                    </div>
                ))}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={addField}
                        className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Parameter
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Evaluate
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {result !== null && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Evaluation Result:</h3>
                    <p>{result ? "True" : "False"}</p>
                </div>
            )}
        </div>
    );
};

export default EvaluateRule;
