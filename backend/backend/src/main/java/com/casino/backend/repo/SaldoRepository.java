package com.casino.backend.repo;

import com.casino.backend.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaldoRepository extends JpaRepository<UsuarioEntity, Long> {
    
}
