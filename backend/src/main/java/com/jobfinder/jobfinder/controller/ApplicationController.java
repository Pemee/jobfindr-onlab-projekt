package com.jobfinder.jobfinder.controller;


import com.jobfinder.jobfinder.models.Application;
import com.jobfinder.jobfinder.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/application")
public class ApplicationController {

    @Autowired
    ApplicationService applicationService;

    @GetMapping("/getAll")
    public List<Application> getAll(){
        return applicationService.getAllApplications();
    }
    @GetMapping("/company/{cname}")
    public List<Application> getAppByComapany(@PathVariable String cname){
        return applicationService.getAppByCompanyName(cname);
    }

    @PostMapping("/addApplication")
    public ResponseEntity<String> addApplication(@RequestBody Application app){
        String response = applicationService.addApplication(app);
        if(response.equals("ok")){
            return ResponseEntity.status(HttpStatus.OK).body("Application added successfully!");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong!");
    }
}
