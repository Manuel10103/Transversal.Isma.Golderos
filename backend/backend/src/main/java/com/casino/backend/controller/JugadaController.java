package com.casino.backend.controller;

import com.casino.backend.entity.Jugada;
import com.casino.backend.entity.JugadaDTO;
import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.JugadaRepository;
import com.casino.backend.service.JugadaService;
import com.casino.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/jugada")
public class JugadaController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JugadaService jugadaService;

    @Autowired
    private JugadaRepository jugadaRepository;

    // 🟢 REGISTRAR UNA NUEVA JUGADA
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarJugada(@RequestBody JugadaDTO jugadaDTO) {
        UsuarioEntity usuario = usuarioService.buscarPorNombre(jugadaDTO.getUsuario());
        
        if (usuario != null) {
            Jugada nuevaJugada = new Jugada();
            nuevaJugada.setUsuario(usuario);
            nuevaJugada.setResultado(jugadaDTO.getResultado());
            nuevaJugada.setFechaHora(LocalDateTime.now());
            nuevaJugada.setSaldoFinal(jugadaDTO.getSaldo());

            jugadaService.guardar(nuevaJugada);

            // 🟢 ACTUALIZAR SALDO DEL USUARIO
           usuario.setSaldo(BigDecimal.valueOf(jugadaDTO.getSaldo()));

            usuarioService.actualizarUsuario(usuario);

            return ResponseEntity.ok(Collections.singletonMap("mensaje", "Jugada registrada con éxito"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }

    // 🟢 OBTENER HISTORIAL DE JUGADAS POR USUARIO
    @GetMapping("/historial")
    public ResponseEntity<List<Jugada>> obtenerHistorial(@RequestParam String usuario) {
        UsuarioEntity usuarioEncontrado = usuarioService.buscarPorNombre(usuario);
        
        if (usuarioEncontrado != null) {
            List<Jugada> historial = jugadaRepository.findByUsuario(usuarioEncontrado);
            return ResponseEntity.ok(historial);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
}
