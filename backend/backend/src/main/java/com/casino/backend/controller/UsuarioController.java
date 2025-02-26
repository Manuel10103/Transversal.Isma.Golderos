package com.casino.backend.controller;

import com.casino.backend.entity.TipoTransaccion;
import com.casino.backend.entity.Transaccion;
import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.TransaccionRepository;
import com.casino.backend.repo.UsuarioRepository;
import com.casino.backend.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private UsuarioService usuarioService;

    // 🟢 FORMULARIO DE REGISTRO
    @GetMapping("/registro")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new UsuarioEntity());
        return "usuarios/registro"; // 📌 Asegúrate de que este archivo existe
    }

    // 🟢 PROCESAR REGISTRO
    @PostMapping("/registro")
    public String registrarUsuario(@ModelAttribute UsuarioEntity usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return "redirect:/usuarios/registro?error=usuario_existe";
        }
        usuarioRepository.save(usuario);
        return "redirect:/usuarios/login?registro=exitoso";
    }

    // 🟢 FORMULARIO DE LOGIN
    @GetMapping("/login")
    public String mostrarFormularioLogin() {
        return "usuarios/login"; // 📌 Asegúrate de que este archivo existe
    }

    // 🟢 PROCESAR LOGIN
    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam(name = "contraseya") String password,
                        Model model, HttpSession session) {
        Optional<UsuarioEntity> optionalUsuario = usuarioRepository.findByEmail(email);

        if (optionalUsuario.isPresent()) {
            UsuarioEntity usuario = optionalUsuario.get();

            if (usuario.getContraseya().equals(password)) {
                session.setAttribute("usuario", usuario);

                if ("PREMIUM".equals(usuario.getRol().name())) {
                    return "redirect:/casino/premium"; // 📌 Asegúrate de que esta ruta existe
                } else {
                    return "redirect:/casino/normal"; // 📌 Asegúrate de que esta ruta existe
                }
            }
        }

        model.addAttribute("error", "Credenciales incorrectas");
        return "usuarios/login";
    }

    // 🟢 CERRAR SESIÓN (LOGOUT)
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/usuarios/login";
    }

    // 🟢 FORMULARIO DE DEPÓSITO
    @GetMapping("/deposito")
    public String mostrarFormularioDeposito(Model model) {
        model.addAttribute("transaccion", new Transaccion());
        return "usuarios/deposito"; // 📌 Asegúrate de que este archivo existe
    }

    // 🟢 PROCESAR DEPÓSITO
    @PostMapping("/deposito")
    public String procesarDeposito(@RequestParam BigDecimal monto,
                                   @RequestParam String tarjeta,
                                   @RequestParam String fechaExpiracion,
                                   @RequestParam String cvv,
                                   HttpSession session) {
        UsuarioEntity usuario = (UsuarioEntity) session.getAttribute("usuario");

        if (usuario != null) {
            usuario.setSaldo(usuario.getSaldo().add(monto));
            usuarioRepository.save(usuario);

            Transaccion transaccion = new Transaccion(usuario, TipoTransaccion.DEPOSITO, monto, tarjeta, fechaExpiracion, cvv);
            transaccionRepository.save(transaccion);

            session.setAttribute("usuario", usuario); // Actualiza el saldo en sesión
        }

        return "redirect:/casino/premium";
    }

    // 🟢 OBTENER SALDO DEL USUARIO
    @GetMapping("/api/usuario/saldo")
    public ResponseEntity<?> obtenerSaldo(@RequestParam String usuario) {
        UsuarioEntity usuarioEncontrado = usuarioService.buscarPorNombre(usuario);
        if (usuarioEncontrado != null) {
            return ResponseEntity.ok(Collections.singletonMap("saldo", usuarioEncontrado.getSaldo()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
}
