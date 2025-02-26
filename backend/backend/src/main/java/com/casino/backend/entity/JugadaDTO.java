package com.casino.backend.entity;

public class JugadaDTO {
    private String usuario;
    private String resultado;
    private double saldo;
    private String fecha;

    // Constructor vacío (necesario para la deserialización de JSON)
    public JugadaDTO() {
    }

    // Constructor con parámetros
    public JugadaDTO(String usuario, String resultado, double saldo, String fecha) {
        this.usuario = usuario;
        this.resultado = resultado;
        this.saldo = saldo;
        this.fecha = fecha;
    }

    // GETTERS y SETTERS
    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public double getSaldo() {
        return saldo;
    }

    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}
