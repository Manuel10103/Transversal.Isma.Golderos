package com.casino.backend.service;

import com.casino.backend.entity.UsuarioEntity;
import java.math.BigDecimal;

public interface UsuarioService {

    UsuarioEntity registrarUsuario(UsuarioEntity usuario);

    UsuarioEntity validarCredenciales(String email, String contrasena);

    boolean actualizarSaldo(Long idUsuario, BigDecimal monto, boolean esDeposito);

    UsuarioEntity buscarPorNombre(String nombre);

    void actualizarUsuario(UsuarioEntity usuario);
}
