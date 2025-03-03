package com.casino.backend.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/casino")
public class CasinoController {

    @GetMapping("/normal")
    public String mostrarZonaNormal(HttpSession session, Model model) {
        Object usuario = session.getAttribute("usuario");
        if (usuario == null) {
            return "redirect:/usuarios/login"; 
        }

        model.addAttribute("usuario", usuario);
        return "casino/normal"; 
    }

    @GetMapping("/premium")
    public String mostrarZonaPremium(HttpSession session, Model model) {   
        Object usuario = session.getAttribute("usuario");
        if (usuario == null) {
            return "redirect:/usuarios/login"; 
        }

        model.addAttribute("usuario", usuario);
        return "casino/premium"; 
    }
}
