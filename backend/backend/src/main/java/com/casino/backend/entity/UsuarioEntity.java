package com.casino.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class UsuarioEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_usuario")
	private Integer idUsuario;


    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "contraseya", nullable = false)
    private String contraseya;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "saldo", columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private Double saldo;

    
    public UsuarioEntity() {
    }

    
    public UsuarioEntity(Integer idUsuario, String nombre, String contraseya, Rol rol, String email, Double saldo) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.contraseya = contraseya;
        this.rol = rol;
        this.email = email;
        this.saldo = saldo;
    }

    
    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
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

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

    
}
