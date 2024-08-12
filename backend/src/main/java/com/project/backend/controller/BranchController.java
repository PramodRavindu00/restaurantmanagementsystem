package com.project.backend.controller;

import com.project.backend.model.Branch;
import com.project.backend.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BranchController {

    @Autowired
    private BranchService branchService;

    @PostMapping("branch/add")
    public ResponseEntity<String> createBranch(@RequestBody Branch branch) {
        if(branchService.isBranchExist(branch.getName())){
            return new ResponseEntity<>("BranchExist", HttpStatus.BAD_REQUEST);
        }else{
            Branch newBranch = branchService.newBranch(branch);
            return new ResponseEntity<>(newBranch.toString(), HttpStatus.CREATED);
        }
    }

    @GetMapping("branch/allBranch")
        public ResponseEntity<List<Branch>> getAllBranch() {
List<Branch> branches = branchService.getAllBranches();
return new ResponseEntity<>(branches, HttpStatus.OK);
    }

    @GetMapping("branch/activeBranch")
    public ResponseEntity<List<Branch>> getActiveBranch() {
        List<Branch> branches = branchService.getActiveBranches();
        return new ResponseEntity<>(branches, HttpStatus.OK);
    }
}
