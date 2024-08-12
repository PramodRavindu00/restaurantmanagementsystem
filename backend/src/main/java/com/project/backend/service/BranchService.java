package com.project.backend.service;

import com.project.backend.model.Branch;
import com.project.backend.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public boolean isBranchExist(String branch) {
        return branchRepository.findByName(branch).isPresent();
    }

}
