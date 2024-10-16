package com.example.ruleengineast.controller;

import com.example.ruleengineast.entity.Rule;
import com.example.ruleengineast.service.RuleService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rules")
public class RuleController {

    @Autowired
    private RuleService ruleService;

    @PostMapping("/create")
    public Rule createRule(@RequestBody Map<String, String> request) throws JsonProcessingException {
        String ruleName = request.get("ruleName");
        String ruleString = request.get("ruleString");
        return ruleService.createRule(ruleName, ruleString);
    }

    @PostMapping("/combine")
    public Rule combineRules(@RequestBody Map<String, Object> request) throws Exception {
        Long ruleId1 = Long.parseLong(request.get("ruleId1").toString());
        Long ruleId2 = Long.parseLong(request.get("ruleId2").toString());
        String operator = request.get("operator").toString();
        return ruleService.combineRules(ruleId1, ruleId2, operator);
    }

    @PostMapping("/evaluate")
    public boolean evaluateRule(@RequestBody Map<String, Object> request) throws Exception {
        Long ruleId = Long.parseLong(request.get("ruleId").toString());
        Map<String, Object> userData = (Map<String, Object>) request.get("userData");
        return ruleService.evaluateRule(ruleId, userData);
    }

//
//    @PostMapping("/evaluate")
//    ata");
//        return ruleService.evaluateRule(ruleId, userData);
//    }
}