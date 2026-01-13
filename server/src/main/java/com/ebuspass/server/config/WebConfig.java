package com.ebuspass.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    public WebConfig(AuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // PASSES:
        // Express requires auth for:
        //   POST /api/passes
        //   GET  /api/passes (admin only, but auth first)
        //   POST /api/passes/:id/accept (admin only, but auth first)
        //   DELETE /api/passes/:id (admin only, but auth first)
        // Express keeps PUBLIC:
        //   POST /api/passes/search
        //   POST /api/passes/renew
        //   GET  /api/passes/:id/pdf
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/passes/**", "/api/drivers/**")
                .excludePathPatterns(
                        "/api/passes/search",
                        "/api/passes/renew"
//                        "/api/passes/**/pdf"
                );


        // DRIVERS & PAYMENTS:
        // We will set exact rules after you paste drivers.js and payments.js,
        // because some endpoints may be public or admin-only like passes.
    }
}
