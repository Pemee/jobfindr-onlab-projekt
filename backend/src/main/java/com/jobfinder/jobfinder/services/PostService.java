package com.jobfinder.jobfinder.services;

import com.jobfinder.jobfinder.models.Post;
import com.jobfinder.jobfinder.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    PostRepository postRepository;

    public List<Post> listAllPosts(){
        return postRepository.findAll();
    }

    public String addPost(Post post){
        postRepository.save(post);
        return "Post successfully created!";
    }

    public Optional<List<Post>> findPostByTitle(String title){
       return postRepository.findByTitle(title);
    }

    public String modifyPost(Post post){
        if(postRepository.findById(post.getId()).isEmpty()){
            return "Post not found!";
        }
        Optional<Post> foundPost = postRepository.findById(post.getId());
        Post modifiedPost = foundPost.get();
        if(post.getDescription() != null){
            modifiedPost.setDescription(post.getDescription());
        }
        if(post.getTitle() != null){
            modifiedPost.setTitle(post.getTitle());
        }
        if(post.getCountry() != null){
            modifiedPost.setCountry(post.getCountry());
        }
        if(post.getCompany_name() != null){
            modifiedPost.setCompany_name(post.getCompany_name());
        }
        if(post.getDetails() != null){
            modifiedPost.setDetails(post.getDetails());
        }



        postRepository.save(modifiedPost);
        return "ok";
    }

    public Optional<Post> getPostById(Long id){
        return postRepository.findById(id);
    }
    public List<String> getAllCountries() {
        return postRepository.findAllCountries();
    }
}
