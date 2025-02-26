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

    
    // 🟢 FORMULARIO DE REGISTRO
    @GetMapping("/registro")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new UsuarioEntity());
        return "usuarios/registro"; 
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
        return "usuarios/login"; 
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
                    return "redirect:/casino/premium"; 
                } else {
                    return "redirect:/casino/normal"; 
                }
            }
        }

        model.addAttribute("error", "Credenciales incorrectas");
        return "usuarios/login";
    }

    //  CERRAR SESIÓN (LOGOUT)
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/usuarios/login";
    }

    //  FORMULARIO DE DEPÓSITO
    @GetMapping("/deposito")
    public String mostrarFormularioDeposito(Model model) {
        model.addAttribute("transaccion", new Transaccion());
        return "usuarios/deposito"; // 📌 Asegúrate de que este archivo existe
    }

    //  PROCESAR DEPÓSITO
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

    //  OBTENER SALDO DEL USUARIO
    @GetMapping("/saldo")
public ResponseEntity<?> obtenerSaldo(HttpSession session) {
    UsuarioEntity usuario = (UsuarioEntity) session.getAttribute("usuario");
    if (usuario != null) {
        // OBTIENE EL SALDO ACTUAL DESDE LA BD, NO DESDE LA SESIÓN
        Optional<UsuarioEntity> optUsuario = usuarioRepository.findById(usuario.getIdUsuario());
        if (optUsuario.isPresent()) {
            UsuarioEntity usuarioBD = optUsuario.get();
            return ResponseEntity.ok(Collections.singletonMap("saldo", usuarioBD.getSaldo()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado en la BD");
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
}


    // Método para mostrar la página de retiro
    @GetMapping("/retirar")
    public String mostrarFormularioRetiro(Model model, HttpSession session) {
        UsuarioEntity usuario = (UsuarioEntity) session.getAttribute("usuario");
        if (usuario != null) {
            model.addAttribute("usuario", usuario);
        }
        return "casino/retirar"; // Página de retiro
    }

    // Método para procesar el retiro
    @PostMapping("/retirar")
    public String procesarRetiro(@RequestParam("monto") BigDecimal monto, HttpSession session, Model model) {
        UsuarioEntity usuario = (UsuarioEntity) session.getAttribute("usuario");

        if (usuario == null) {
            model.addAttribute("error", "Usuario no autenticado");
            return "redirect:/usuarios/login"; // Redirigir al login si no está autenticado
        }

        if (usuario.getSaldo().compareTo(monto) < 0) {
            model.addAttribute("error", "Saldo insuficiente");
            return "casino/retirar"; // Redirigir de nuevo a la página de retiro
        }

        // Realizar el retiro
        usuario.setSaldo(usuario.getSaldo().subtract(monto));
        usuarioRepository.save(usuario);

        // Registrar la transacción de retiro
        Transaccion transaccion = new Transaccion(usuario, TipoTransaccion.RETIRO, monto, "", "", "");
        transaccionRepository.save(transaccion);

        model.addAttribute("usuario", usuario);
        model.addAttribute("mensaje", "Retiro exitoso. Saldo actualizado.");

        return "casino/retirar"; 
    }

    
}
