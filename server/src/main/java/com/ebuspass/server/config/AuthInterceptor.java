package com.ebuspass.server.config;

import com.ebuspass.server.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtService jwtService;

    public AuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    private String getTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if ("token".equals(c.getName())) return c.getValue();
        }
        return null;
    }

    private void writeJson(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        String method = request.getMethod();

// Public endpoint: GET /api/drivers
        String method1 = request.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method1)) {
            return true;
        }


        String token = getTokenFromCookies(request);
        if (token == null || token.isBlank()) {
            writeJson(response, 401, "Not authenticated");
            return false;
        }

        try {
            Claims claims = jwtService.verifyAndGetClaims(token);
            String id = String.valueOf(claims.get("id"));
            String role = String.valueOf(claims.get("role"));
            String email = String.valueOf(claims.get("email"));

            AuthContext.set(new AuthContext.AuthUser(id, role, email));
            return true;
        } catch (Exception e) {
            writeJson(response, 401, "Invalid token");
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        AuthContext.clear();
    }
}
