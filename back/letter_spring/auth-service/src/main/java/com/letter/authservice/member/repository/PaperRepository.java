package com.letter.authservice.member.repository;

import com.letter.authservice.member.entity.Paper;
import com.letter.authservice.member.entity.Roll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaperRepository extends JpaRepository<Paper, Long> {
    List<Paper> findAllByRollId(Long rollId);
}
