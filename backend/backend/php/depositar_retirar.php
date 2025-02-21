<?php
session_start();
include("conexion.php");

if (!isset($_SESSION["id_usuario"])) {
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
    exit();
}

$id_usuario = $_SESSION["id_usuario"];
$monto = $_POST["monto"];
$tipo = $_POST["tipo"]; // "DEPOSITO" o "RETIRO"

if ($monto <= 0) {
    echo json_encode(["status" => "error", "message" => "Cantidad no válida"]);
    exit();
}

// Verificar saldo antes de retirar
if ($tipo == "RETIRO") {
    $sql_check = "SELECT saldo FROM usuario WHERE id_usuario = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("i", $id_usuario);
    $stmt_check->execute();
    $stmt_check->bind_result($saldo_actual);
    $stmt_check->fetch();
    $stmt_check->close();

    if ($saldo_actual < $monto) {
        echo json_encode(["status" => "error", "message" => "Saldo insuficiente"]);
        exit();
    }
}

// Actualizar saldo del usuario
$sql_update = "UPDATE usuario SET saldo = saldo " . ($tipo == "DEPOSITO" ? "+" : "-") . " ? WHERE id_usuario = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("di", $monto, $id_usuario);

if ($stmt_update->execute()) {
    // Registrar la transacción en la tabla
    $sql_transaccion = "INSERT INTO transaccion (id_usuario, monto, tipo) VALUES (?, ?, ?)";
    $stmt_transaccion = $conn->prepare($sql_transaccion);
    $stmt_transaccion->bind_param("ids", $id_usuario, $monto, $tipo);
    $stmt_transaccion->execute();
    $stmt_transaccion->close();

    echo json_encode(["status" => "success", "message" => "$tipo realizado con éxito"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error en la transacción"]);
}

$stmt_update->close();
$conn->close();
?>
