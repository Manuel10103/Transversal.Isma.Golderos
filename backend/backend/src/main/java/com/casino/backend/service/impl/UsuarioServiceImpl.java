package com.casino.backend.service.impl;

import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.UsuarioRepository;
import com.casino.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UsuarioEntity registrarUsuario(UsuarioEntity usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El usuario con este email ya existe.");
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public UsuarioEntity validarCredenciales(String email, String contrasena) {
        return usuarioRepository.findByEmail(email)
                .filter(u -> u.getContraseya().equals(contrasena))
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas."));
    }

    @Override
    public boolean actualizarSaldo(Long idUsuario, BigDecimal monto, boolean esDeposito) {
        return usuarioRepository.findById(idUsuario).map(usuario -> {
            BigDecimal saldoActual = usuario.getSaldo();
            BigDecimal nuevoSaldo = esDeposito ? saldoActual.add(monto) : saldoActual.subtract(monto);
            if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
                return false; // Saldo insuficiente
            }
            usuario.setSaldo(nuevoSaldo);
            usuarioRepository.save(usuario);
            return true;
        }).orElse(false);
    }

    @Override
    public UsuarioEntity buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre).orElse(null);
    }

    @Override
    public void actualizarUsuario(UsuarioEntity usuario) {
        usuarioRepository.save(usuario);
    }
}
