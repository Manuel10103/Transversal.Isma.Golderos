package com.casino.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.casino.backend.entity.Jugada;
import com.casino.backend.entity.UsuarioEntity;
import java.util.List;

@Repository
public interface JugadaRepository extends JpaRepository<Jugada, Long> {
    List<Jugada> findByUsuario(UsuarioEntity usuario);
}

