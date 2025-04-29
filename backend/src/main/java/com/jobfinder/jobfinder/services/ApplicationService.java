package com.jobfinder.jobfinder.services;

import com.jobfinder.jobfinder.models.Application;
import com.jobfinder.jobfinder.repositories.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;


    public List<Application> getAllApplications(){
        return applicationRepository.findAll();
    }

    public List<Application> getAppByCompanyName(String cname){
        return applicationRepository.findByCompanyName(cname);
    }

    public String addApplication(Application app){
        applicationRepository.save(app);
        return "ok";
    }
}
