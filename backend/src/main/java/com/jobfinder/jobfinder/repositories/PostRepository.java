package com.jobfinder.jobfinder.repositories;

import com.jobfinder.jobfinder.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<List<Post>> findByTitle(String title);
    Optional<Post> findById(long Id);
    @Query("SELECT DISTINCT p.country FROM Post p")
    List<String> findAllCountries();
}
