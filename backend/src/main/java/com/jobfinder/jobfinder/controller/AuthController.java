package com.jobfinder.jobfinder.controller;

import com.jobfinder.jobfinder.dto.LoginRequest;
import com.jobfinder.jobfinder.services.KeycloakAuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final KeycloakAuthService keycloakAuthService;

    public AuthController(KeycloakAuthService keycloakAuthService) {
        this.keycloakAuthService = keycloakAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
            ResponseEntity<String> authResponse = keycloakAuthService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());

            if (authResponse.getStatusCode() == HttpStatus.OK) {
            JSONObject jsonResponse = new JSONObject(authResponse.getBody());
            String accessToken = jsonResponse.getString("access_token");
            String refreshToken = jsonResponse.getString("refresh_token");

            Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(24 * 60 * 60);

            Cookie accessTokenCookie = new Cookie("access_token", accessToken);
            accessTokenCookie.setHttpOnly(false);
            accessTokenCookie.setSecure(false);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(24 * 60 * 60);

            response.addCookie(refreshTokenCookie);
            response.addCookie(accessTokenCookie);

            return ResponseEntity.ok(accessToken);
        }
        return authResponse;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(name = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {
        if (refreshToken != null) {
            keycloakAuthService.logoutUser(refreshToken);
        }

        // Remove refresh token cookie
        Cookie deleteCookie = new Cookie("refresh_token", null);
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(true);
        deleteCookie.setPath("/");
        deleteCookie.setMaxAge(0);

        Cookie deleteCookie2 = new Cookie("access_token", null);
        deleteCookie2.setHttpOnly(true);
        deleteCookie2.setSecure(true);
        deleteCookie2.setPath("/");
        deleteCookie2.setMaxAge(0);
        response.addCookie(deleteCookie);
        response.addCookie(deleteCookie2);

        return ResponseEntity.ok("Logged out successfully");
    }
}
