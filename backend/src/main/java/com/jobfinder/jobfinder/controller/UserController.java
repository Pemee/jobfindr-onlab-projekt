package com.jobfinder.jobfinder.controller;


import com.jobfinder.jobfinder.models.User;
import com.jobfinder.jobfinder.services.KeycloakAdminService;
import com.jobfinder.jobfinder.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
        if(userService.userAlreadyRegistered(user.getUsername(), user.getEmail())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or email already registered");
        }
        keycloakAdminService.createUser(user.getUsername(),user.getEmail(),user.getPassword(), user.getFirstname(),user.getLastname(), user.getRole());

        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        String hashPass = bcrypt.encode(user.getPassword());
        user.setPassword(hashPass);
        userService.registerUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");

    }

    @PutMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestBody User user){
        String response = userService.updateUser(user);
        if (response.equals("ok")){
            return ResponseEntity.status(HttpStatus.OK).body("User successfully updated!");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong!");
    }
    @GetMapping("/user/username/{username}")
    public User getUserByUsername(@PathVariable String username){
        return userService.getUserByUsername(username);
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

}
