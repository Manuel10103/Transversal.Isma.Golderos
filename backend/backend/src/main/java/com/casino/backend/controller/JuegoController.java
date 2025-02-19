package com.casino.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class JuegoController {

    @GetMapping("/juegos/tragaperras")
    public String mostrarTragaperras() {
        return "juegos/tragaperras"; 
    }

    @GetMapping("/juegos/carrera")
    public String mostrarCarreraCaballos() {
        return "juegos/dino"; 
    }
}
