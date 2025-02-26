package com.casino.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.casino.backend.entity.Jugada;
import com.casino.backend.repo.JugadaRepository;

@Service
public class JugadaService {
    @Autowired
    private JugadaRepository jugadaRepository;

    public void guardar(Jugada jugada) {
        jugadaRepository.save(jugada);
    }
}
