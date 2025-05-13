package com.jobfinder.jobfinder.controller;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/session")
public class KeycloakSessionController {

    private final String realm = "jobfindr";
    private Keycloak getKeycloakInstance() {
         return KeycloakBuilder.builder()
                .serverUrl("http://localhost:8080")
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .grantType("password")
                .build();

    }

    @GetMapping("/{username}")
    public ResponseEntity<Void> checkUserSession(@PathVariable String username) {
        try (Keycloak keycloak = getKeycloakInstance()) {
            List<UserRepresentation> users = keycloak.realm(realm)
                    .users()
                    .search(username, true); // Exact match for username

            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // User not found
            }

            String userId = users.getFirst().getId();

            List<?> sessions = keycloak.realm(realm)
                    .users()
                    .get(userId)
                    .getUserSessions();

            if (!sessions.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
