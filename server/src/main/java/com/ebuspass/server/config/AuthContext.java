package com.ebuspass.server.config;

public class AuthContext {

    private static final ThreadLocal<AuthUser> current = new ThreadLocal<>();

    public static void set(AuthUser user) { current.set(user); }
    public static AuthUser get() { return current.get(); }
    public static void clear() { current.remove(); }

    public static class AuthUser {
        private String id;
        private String role;
        private String email;

        public AuthUser() {}

        public AuthUser(String id, String role, String email) {
            this.id = id;
            this.role = role;
            this.email = email;
        }

        public String getId() { return id; }
        public String getRole() { return role; }
        public String getEmail() { return email; }

        public void setId(String id) { this.id = id; }
        public void setRole(String role) { this.role = role; }
        public void setEmail(String email) { this.email = email; }
    }
}
