package com.casino.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "usuario")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "contraseya", nullable = false)
    private String contraseya;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "saldo", precision = 10, scale = 2, nullable = false)
    private BigDecimal saldo = BigDecimal.ZERO;

    public UsuarioEntity() {}

    public UsuarioEntity(Long idUsuario, String nombre, String contraseya, Rol rol, String email, BigDecimal saldo) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.contraseya = contraseya;
        this.rol = rol;
        this.email = email;
        this.saldo = saldo;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContraseya() {
        return contraseya;
    }

    public void setContraseya(String contraseya) {
        this.contraseya = contraseya;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }    
}
