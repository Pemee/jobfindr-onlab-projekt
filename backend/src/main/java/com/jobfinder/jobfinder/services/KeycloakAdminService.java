package com.jobfinder.jobfinder.services;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class KeycloakAdminService {

    private final Keycloak keycloak;

    public KeycloakAdminService() {
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl("http://localhost:8080")
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .grantType("password")
                .build();
    }

    public void createUser(String username, String email, String password, String firstName, String lastName, String roleName) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        Response response = keycloak.realm("jobfindr").users().create(user);

        if (response.getStatus() == 201) {
            System.out.println("User created successfully!");

            String userId = keycloak.realm("jobfindr")
                    .users()
                    .search(username)
                    .stream()
                    .filter(u -> u.getUsername().equals(username))
                    .findFirst()
                    .map(UserRepresentation::getId)
                    .orElse(null);

            if (userId == null) {
                System.out.println("User ID not found!");
                return;
            }

            RoleRepresentation role = keycloak.realm("jobfindr")
                    .roles()
                    .get(roleName)
                    .toRepresentation();

            if (role == null) {
                System.out.println("Role not found: " + roleName);
                return;
            }

            keycloak.realm("jobfindr")
                    .users()
                    .get(userId)
                    .roles()
                    .realmLevel()
                    .add(Collections.singletonList(role));

            System.out.println("Role assigned successfully!");
        } else {
            System.out.println("Failed to create user! Response Code: " + response.getStatus());
            System.out.println("Response: " + response.readEntity(String.class));
        }
    }

}

