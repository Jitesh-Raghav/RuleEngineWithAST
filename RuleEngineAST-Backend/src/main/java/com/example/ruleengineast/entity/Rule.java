package com.example.ruleengineast.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rules")
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rule_name")
    private String ruleName;

    @Lob
    @Column(name = "rule_ast", columnDefinition = "TEXT")
    private String ruleAST;  // JSON string representation of the Node (AST)

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}