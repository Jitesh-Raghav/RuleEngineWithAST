package com.example.ruleengineast.service;

import com.example.ruleengineast.entity.Node;
import com.example.ruleengineast.entity.Rule;
import com.example.ruleengineast.repository.RuleRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RuleService {

    @Autowired
    private RuleRepository ruleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Create a rule from a string and save it in the database
    public Rule createRule(String ruleName, String ruleString) throws JsonProcessingException {
        Node ruleAST = createRuleAST(ruleString);
        Rule rule = new Rule();
        rule.setRuleName(ruleName);
        rule.setRuleAST(objectMapper.writeValueAsString(ruleAST));  // Convert AST to JSON
        return ruleRepository.save(rule);
    }

    // Parse rule string and create AST (this can be more complex based on actual grammar)
    private Node createRuleAST(String ruleString) {
        // Simplified logic for creating AST from string
        Node root = new Node();
        root.setType("operator");
        root.setValue("AND");

        Node left = new Node("operand", null, null, "age > 30");
        Node right = new Node("operand", null, null, "salary > 50000");

        root.setLeft(left);
        root.setRight(right);

        return root;
    }

    // Combine two rules
    public Rule combineRules(Long ruleId1, Long ruleId2, String operator) throws Exception {
        Rule rule1 = ruleRepository.findById(ruleId1)
                .orElseThrow(() -> new Exception("Rule not found: " + ruleId1));
        Rule rule2 = ruleRepository.findById(ruleId2)
                .orElseThrow(() -> new Exception("Rule not found: " + ruleId2));

        Node ast1 = objectMapper.readValue(rule1.getRuleAST(), Node.class);
        Node ast2 = objectMapper.readValue(rule2.getRuleAST(), Node.class);

        Node combinedAST = combineASTs(ast1, ast2, operator);

        Rule combinedRule = new Rule();
        combinedRule.setRuleName("Combined Rule");
        combinedRule.setRuleAST(objectMapper.writeValueAsString(combinedAST));

        return ruleRepository.save(combinedRule);
    }

    // Combine two ASTs using an operator (AND/OR)
    private Node combineASTs(Node rule1, Node rule2, String operator) {
        Node combinedRoot = new Node();
        combinedRoot.setType("operator");
        combinedRoot.setValue(operator); // AND/OR

        combinedRoot.setLeft(rule1);
        combinedRoot.setRight(rule2);

        return combinedRoot;
    }

    // Evaluate a rule against user data
    public boolean evaluateRule(Long ruleId, Map<String, Object> userData) throws Exception {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new Exception("Rule not found: " + ruleId));

        Node root = objectMapper.readValue(rule.getRuleAST(), Node.class);
        return evaluateAST(root, userData);
    }

    // Recursively evaluate AST nodes
    private boolean evaluateAST(Node root, Map<String, Object> userData) {
        if ("operand".equals(root.getType())) {
            String[] parts = root.getValue().split(" ");
            String field = parts[0];
            String operator = parts[1];
            int value = Integer.parseInt(parts[2]);

            if ("age".equals(field)) {
                int age = (int) userData.get("age");
                return evaluateCondition(age, operator, value);
            } else if ("salary".equals(field)) {
                int salary = (int) userData.get("salary");
                return evaluateCondition(salary, operator, value);
            }
        } else if ("operator".equals(root.getType())) {
            boolean leftResult = evaluateAST(root.getLeft(), userData);
            boolean rightResult = evaluateAST(root.getRight(), userData);

            if ("AND".equals(root.getValue())) {
                return leftResult && rightResult;
            } else if ("OR".equals(root.getValue())) {
                return leftResult || rightResult;
            }
        }
        return false;
    }

    private boolean evaluateCondition(int fieldValue, String operator, int value) {
        switch (operator) {
            case ">": return fieldValue > value;
            case "<": return fieldValue < value;
            case "=": return fieldValue == value;
            default: return false;
        }
    }
}