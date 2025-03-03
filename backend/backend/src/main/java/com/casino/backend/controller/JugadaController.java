package com.casino.backend.controller;

import com.casino.backend.entity.Jugada;
import com.casino.backend.entity.JugadaDTO;
import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.JugadaRepository;
import com.casino.backend.repo.UsuarioRepository;
import com.casino.backend.service.JugadaService;
import com.casino.backend.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jugada")
public class JugadaController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository UsuarioRepository;

    @Autowired
    private JugadaService jugadaService;

    @Autowired
    private JugadaRepository jugadaRepository;

    // REGISTRAR UNA NUEVA JUGADA
    @PostMapping("/registrar")
public ResponseEntity<?> registrarJugada(@RequestBody JugadaDTO jugadaDTO, HttpSession session) {
    // 1. Verificar que el usuario en sesión está presente
    UsuarioEntity usuarioSesion = (UsuarioEntity) session.getAttribute("usuario");
    if (usuarioSesion == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
    }

    // 2. Buscar en la BD para tener saldo actualizado
    Optional<UsuarioEntity> optUsuario = UsuarioRepository.findById(usuarioSesion.getIdUsuario());
    if (!optUsuario.isPresent()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado en BD");
    }
    UsuarioEntity usuario = optUsuario.get();

    // 3. Lógica de actualizar saldo
    double saldoActual = usuario.getSaldo().doubleValue();
    double nuevoSaldo;
    if ("GANADO".equalsIgnoreCase(jugadaDTO.getResultado())) {
        nuevoSaldo = saldoActual + jugadaDTO.getGanancia();
    } else if ("PERDIDO".equalsIgnoreCase(jugadaDTO.getResultado())) {
        nuevoSaldo = saldoActual - jugadaDTO.getMonto();
    } else {
        nuevoSaldo = saldoActual; // EMPATE
    }

    // 4. Guardar en BD
    usuario.setSaldo(BigDecimal.valueOf(nuevoSaldo));
    UsuarioRepository.save(usuario);

    // 5. Registrar la jugada
    Jugada nuevaJugada = new Jugada();
    nuevaJugada.setUsuario(usuario);
    nuevaJugada.setResultado(jugadaDTO.getResultado());
    nuevaJugada.setFechaHora(LocalDateTime.now());
    nuevaJugada.setSaldoFinal(nuevoSaldo);
    jugadaService.guardar(nuevaJugada);

    return ResponseEntity.ok(Collections.singletonMap("mensaje", "Jugada registrada con éxito"));
}



    // OBTENER HISTORIAL DE JUGADAS POR USUARIO
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
