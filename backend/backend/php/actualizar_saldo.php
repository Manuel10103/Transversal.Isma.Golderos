<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id_usuario = $_POST["id_usuario"];
    $nuevo_saldo = $_POST["nuevo_saldo"];

    $sql = "UPDATE usuario SET saldo = ? WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("di", $nuevo_saldo, $id_usuario);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Saldo actualizado"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar saldo"]);
    }

    $stmt->close();
    $conn->close();
}
?>
