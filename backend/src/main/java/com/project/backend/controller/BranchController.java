package com.project.backend.controller;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Branch;
import com.project.backend.repository.BranchRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.service.BranchService;
import com.project.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
public class BranchController {

    @Autowired
    private BranchService branchService;
    @Autowired
    private BranchRepository branchRepository;

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
    public ResponseEntity<String> updateBranch(@PathVariable Long id, @RequestBody Branch branch) throws ResourceNotFoundException {
        Optional <Branch> currentBranchOpt = branchRepository.findById(id);
        if(currentBranchOpt.isPresent()){
           Branch currentBranch = currentBranchOpt.get();
           if(branchService.isBranchNameUsingOther(id, branch.getName())){
               return new ResponseEntity<>("BranchExist", HttpStatus.BAD_REQUEST);
           }else{
               Branch updatedBranch = branchService.updateBranch(id,branch);
               return new ResponseEntity<>("Branch Updated", HttpStatus.OK);
           }
        }else {
            throw new ResourceNotFoundException("Branch not found");
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
