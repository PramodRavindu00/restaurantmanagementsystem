package com.project.backend.controller;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Branch;
import com.project.backend.model.User;
import com.project.backend.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("branch/update/{id}")
    public ResponseEntity<Branch> updateBranch(@PathVariable Long id, @RequestBody Branch branch) throws ResourceNotFoundException {
        Branch updatedBranch = branchService.updateBranch(id,branch);
        return new ResponseEntity<>(updatedBranch, HttpStatus.OK);
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
    @PutMapping("branch/deactivate/{id}")
    public ResponseEntity<String> deactivateBranch(@PathVariable Long id) throws ResourceNotFoundException {
        Branch deactivatedBranch = branchService.deactivate( id);
        return new ResponseEntity<>(deactivatedBranch.toString(), HttpStatus.OK);
    }

    @PutMapping("branch/reactivate/{id}")
    public ResponseEntity<String> reactivateBranch(@PathVariable Long id) throws ResourceNotFoundException {
        Branch deactivatedBranch = branchService.reactivate(id);
        return new ResponseEntity<>(deactivatedBranch.toString(), HttpStatus.OK);
    }
}
