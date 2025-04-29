package com.jobfinder.jobfinder.repositories;

import com.jobfinder.jobfinder.models.Application;
import com.jobfinder.jobfinder.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCompanyName(String cname);
}
