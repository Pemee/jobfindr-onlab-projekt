package com.jobfinder.jobfinder.controller;

import com.jobfinder.jobfinder.models.Post;
import com.jobfinder.jobfinder.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/post")
public class PostController {
    @Autowired
    PostService postService;

    @GetMapping("/getAllPosts")
    public List<Post> getAllPosts(){
        return postService.listAllPosts();
    }

    @PostMapping("/addPost")
    public ResponseEntity<String> addPost(@RequestBody Post post){
        if(post != null){
            postService.addPost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully!");
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong try again!");
        }
    }

    @GetMapping("/getPostById")
    public Optional<Post> getPost(@RequestParam long id){
        return postService.getPostById(id);
    }

    @GetMapping("/getAllCountries")
    public List<String> getCountries(){
        return postService.getAllCountries();
    }

    @PutMapping("/updatePost")
    public ResponseEntity<String> updatePost(@RequestBody Post post){
        String response = postService.modifyPost(post);
        if(response.equals("ok")){
            return ResponseEntity.status(HttpStatus.OK).body("Post updated successfully!");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong!");
    }
}
