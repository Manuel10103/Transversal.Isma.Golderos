package com.casino.backend.controller;

import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.UsuarioRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // MOSTRAR FORMULARIO DE REGISTRO
    @GetMapping("/registro")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new UsuarioEntity());
        return "usuarios/registro";
    }

    // PROCESAR REGISTRO
    @PostMapping("/registro")
    public String registrarUsuario(@ModelAttribute UsuarioEntity usuario) {
        usuarioRepository.save(usuario);
        return "redirect:/usuarios/login";
    }

    // MOSTRAR FORMULARIO DE LOGIN
    @GetMapping("/login")
    public String mostrarFormularioLogin() {
        return "usuarios/login";
    }

    // PROCESAR LOGIN
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

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); 
        return "redirect:/usuarios/login";
    }

}
