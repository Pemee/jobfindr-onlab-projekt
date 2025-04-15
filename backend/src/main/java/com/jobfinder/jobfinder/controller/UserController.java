package com.jobfinder.jobfinder.controller;


import com.jobfinder.jobfinder.models.User;
import com.jobfinder.jobfinder.services.KeycloakAdminService;
import com.jobfinder.jobfinder.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private KeycloakAdminService keycloakAdminService;

    @GetMapping("/user/getAllUsers")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        userService.registerUser(user);
        keycloakAdminService.createUser(user.getUsername(),user.getEmail(),user.getPassword(), user.getFirstname(),user.getLastname(), user.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");

    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, HttpSession session) {
        try{
            boolean isAuthenticated = userService.authenticate(user.getUsername(),user.getPassword());

            if (isAuthenticated){
                session.setAttribute("user", user.getUsername());
                return ResponseEntity.ok("Login was successful!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestBody User user){
        String response = userService.updateUser(user);
        if (response == "ok"){
            return ResponseEntity.status(HttpStatus.OK).body("User successfully updated!");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong!");
    }
    @GetMapping("/user/{username}")
    public User getUserByUsername(@PathVariable String username){
        return userService.getUserByUsername(username);
    }
}
