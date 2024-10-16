package com.example.ruleengineast.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Node {
    private String type; // 'operator' or 'operand'
    private Node left;   // Left child node (for operators)
    private Node right;  // Right child node (for operators)
    private String value; // Operand value, e.g., "age > 30"
}
