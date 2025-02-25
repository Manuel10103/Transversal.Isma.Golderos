package com.casino.backend.service;

import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    
    public UsuarioEntity registrarUsuario(UsuarioEntity usuario) {
        
        Optional<UsuarioEntity> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("El usuario con este email ya existe.");
        }

        return usuarioRepository.save(usuario);
    }

    
    public UsuarioEntity validarCredenciales(String email, String contraseya) {
        return usuarioRepository.findByEmail(email)
                .filter(u -> u.getContraseya().equals(contraseya)) 
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas."));
    }

    
}
