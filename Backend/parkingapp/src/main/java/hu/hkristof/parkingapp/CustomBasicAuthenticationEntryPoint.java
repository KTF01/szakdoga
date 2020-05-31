package hu.hkristof.parkingapp;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

/**
 * Autentikációs belépési pont arra az esetre ha nem sikerül az autentikáció.
 * @author krist
 *
 */
public class CustomBasicAuthenticationEntryPoint extends BasicAuthenticationEntryPoint{
	@Override
    public void commence(final HttpServletRequest request, 
            final HttpServletResponse response, 
            final AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.addHeader("WWW-Authenticate", "Basic realm=" + getRealmName() + "");
         
        PrintWriter writer = response.getWriter();
        writer.println("{ \"message\": \"HTTP Status 401 : " + authException.getMessage()+"\"}");
    }
     
    @Override
    public void afterPropertiesSet() {
        setRealmName("REALM");
        super.afterPropertiesSet();
    }
}
