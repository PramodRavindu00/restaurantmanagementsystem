package com.project.backend.service;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Branch;
import com.project.backend.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository branchRepository;

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public List<Branch> getActiveBranches() {
        return branchRepository.findAllActive();
    }

    public Branch newBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    public Branch updateBranch(Long id , Branch branch) throws ResourceNotFoundException {
      if(!branchRepository.existsById(id)) {
          throw new ResourceNotFoundException("Branch not found");
      }
      branch.setId(id);
      return branchRepository.save(branch);
    }

    public Branch deactivate(Long id) throws ResourceNotFoundException {
 Branch branch = branchRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        branch.setActive(false);
        return branchRepository.save(branch);

    }

    public Branch reactivate(Long id) throws ResourceNotFoundException {
        Branch branch = branchRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        branch.setActive(true);
            return branchRepository.save(branch);
    }

    public boolean isBranchExist(String branch) {
        return branchRepository.findByName(branch).isPresent();
    }

    public boolean isBranchNameUsingOther(Long id, String name) {
        return branchRepository.nameTakenWhenUpdating(id,name)>0;
    }
}
