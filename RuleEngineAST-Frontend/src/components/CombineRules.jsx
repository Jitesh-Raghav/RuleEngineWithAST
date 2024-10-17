import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CombineRule = () => {
    const [rules, setRules] = useState([]); // Store existing rules
    const [ruleId1, setRuleId1] = useState("");
    const [ruleId2, setRuleId2] = useState("");
    const [combinationOperator, setCombinationOperator] = useState("AND"); // Default operator
    const [combinedRule, setCombinedRule] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const res = await axios.get('http://localhost:8080/rules'); // Adjust API endpoint as necessary
                setRules(res.data); // Assume the API returns a list of rules
            } catch (err) {
                console.log("what errer");
                console.error(err);
            }
        };

        fetchRules();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/rules/combine', {
                ruleId1,
                ruleId2,
                operator: combinationOperator
            });
            setCombinedRule(res.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to combine rules. Please check the rule IDs and try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Combine Rules</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruleId1">
                        Rule ID 1
                    </label>
                    <input
                        id="ruleId1"
                        type="text"
                        value={ruleId1}
                        onChange={(e) => setRuleId1(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Rule ID 1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruleId2">
                        Rule ID 2
                    </label>
                    <input
                        id="ruleId2"
                        type="text"
                        value={ruleId2}
                        onChange={(e) => setRuleId2(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Rule ID 2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operator">
                        Combination Operator
                    </label>
                    <select
                        id="operator"
                        value={combinationOperator}
                        onChange={(e) => setCombinationOperator(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Combine
                    </button>
                </div>
            </form>
            {combinedRule && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Combined Rule:</h3>
                    <p>Rule ID: {combinedRule.id}</p>
                    <p>Rule Name: {combinedRule.ruleName}</p>
                    <p>AST: {combinedRule.ruleAST}</p>
                </div>
            )}
            {error && (
                <div className="mt-4 text-red-500">{error}</div>
            )}
        </div>
    );
};

export default CombineRule;
