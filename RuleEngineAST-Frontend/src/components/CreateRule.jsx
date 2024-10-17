import React, { useState } from 'react';
import axios from 'axios';

const CreateRule = () => {
    const [ruleName, setRuleName] = useState("");
    const [ruleString, setRuleString] = useState("");
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
            const res = await axios.post('http://localhost:8080/rules/create', {
                ruleName,
                ruleString,
                userData: transformedData
            });
            setResult(res.data);
            setRuleName('');
            setRuleString('');
            setUserData([{ key: '', value: '' }]); // Reset fields after creation
        } catch (err) {
            console.error(err);
            setError('Error creating rule: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Create Rule</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruleName">
                        Rule Name
                    </label>
                    <input
                        id="ruleName"
                        type="text"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Rule Name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruleString">
                        Rule String
                    </label>
                    <input
                        id="ruleString"
                        type="text"
                        value={ruleString}
                        onChange={(e) => setRuleString(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Rule String (e.g., age>20)"
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
                        Create Rule
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {result && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Rule Created:</h3>
                    <p>ID: {result.id}</p>
                    <p>Name: {result.ruleName}</p>
                    <p>AST: {result.ruleAST}</p>
                </div>
            )}
        </div>
    );
};

export default CreateRule;
