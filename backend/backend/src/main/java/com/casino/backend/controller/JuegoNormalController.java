package com.casino.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class JuegoNormalController {

    @GetMapping("/tragaperrasNormal")
    public String mostrarTragaperrasNormal() {
        return "juegos/tragaperrasNormal";
    }

    @GetMapping("/DinoNormal")
    public String mostrarDinoNormal() {
        return "juegos/DinoNormal";
    }
}
