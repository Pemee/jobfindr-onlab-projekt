package com.jobfinder.jobfinder.repositories;

import com.jobfinder.jobfinder.dto.PostApplicationView;
import com.jobfinder.jobfinder.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<List<Post>> findByTitle(String title);
    Optional<Post> findById(long Id);
    @Query("SELECT DISTINCT p.country FROM Post p")
    List<String> findAllCountries();

    @Query(value = """
        SELECT p.title AS title, a.score AS score,
               u.firstname AS firstname, u.lastname AS lastname,
               u.country AS country, u.phone_number AS phoneNumber,
               u.email AS email
        FROM post p
        JOIN application a ON a.post_id = p.id
        JOIN user u ON a.applier_id = u.id
        WHERE p.company_name = :cname
    """, nativeQuery = true)
    List<PostApplicationView> findApplicationViewsByCompanyName(@Param("cname") String cname);
}
