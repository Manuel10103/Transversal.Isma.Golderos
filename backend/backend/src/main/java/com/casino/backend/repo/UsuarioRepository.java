package com.casino.backend.repo;

import com.casino.backend.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {
    Optional<UsuarioEntity> findByEmail(String email);
    Optional<UsuarioEntity> findByNombre(String nombre);
}
