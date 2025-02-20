package com.casino.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class JuegoController {

    @GetMapping("/tragaperras")
    public String mostrarTragaperras() {
        return "juegos/tragaperras"; 
    }

    @GetMapping("/carrera")
    public String mostrarCarreraCaballos() {
        return "juegos/dino"; 
    }   

    @GetMapping("/ruleta")
    public String mostrarRuleta() {
        return "juegos/ruleta";
    }

}
