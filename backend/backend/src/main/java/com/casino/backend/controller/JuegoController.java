package com.casino.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class JuegoController {

    @GetMapping("/tragaperras")
    public String mostrarTragaperras() {
        return "juegos/tragaperras"; 
    }

    @GetMapping("/dino")
    public String mostrarCarreraCaballos() {
        return "juegos/dino"; 
    }   

    @GetMapping("/ruleta")
    public String mostrarRuleta() {
        return "juegos/ruleta";
    }

}
