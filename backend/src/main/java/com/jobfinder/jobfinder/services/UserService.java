package com.jobfinder.jobfinder.services;

import com.jobfinder.jobfinder.models.User;
import com.jobfinder.jobfinder.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService{

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, BCryptPasswordEncoder bCryptPasswordEncoder1) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder1;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String registerUser(User user) {
        userRepository.save(user);
        return "User registered successfully!";
    }

    @Transactional
    public String updateUser(User user){
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());

        if(optionalUser.isEmpty()) {
            return "User not found";
        }
        User modifiedUser = optionalUser.get();
        modifiedUser.setCountry(user.getCountry());
        modifiedUser.setPhone_number(user.getPhone_number());
        userRepository.save(modifiedUser);
        return "ok";
    }

    public User getUserByUsername(String username){
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            return null;
        }
        return optionalUser.get();
    }
    public User getUserById(Long id){
        Optional<User> optionalUser = userRepository.findById(id);
        if(optionalUser.isEmpty()) {
            return null;
        }
        return optionalUser.get();
    }

    public boolean userAlreadyRegistered(String username, String email){
        Optional<User> optionalUser1 = userRepository.findByUsername(username);
        Optional<User> optionalUser2 = userRepository.findByEmail(email);
        return (optionalUser1.isPresent() || optionalUser2.isPresent());
    }

}
