<?php
// Incluir el archivo de conexión
include 'conexion.php';

// Obtener el número de línea desde la solicitud GET
$lineNumber = $_GET['lineNumber'];

try {
    // Consulta SQL para obtener la ruta correspondiente al número de línea
    $sql = "SELECT coordenadas FROM rutas WHERE nombre_ruta = 'ruta$lineNumber'";

    // Ejecutar la consulta SQL
    $result = $conexion->query($sql);

    // Verificar si se obtuvieron resultados
    if ($result->num_rows > 0) {
        // Obtener la fila de resultados como un array asociativo
        $row = $result->fetch_assoc();

        // Devolver las coordenadas de la ruta como una respuesta JSON
        echo json_encode(["success" => true, "coordenadas" => $row['coordenadas']]);
    } else {
        // No se encontró la ruta en la base de datos
        echo json_encode(["success" => false, "error" => "No se encontró la ruta en la base de datos"]);
    }
} catch (Exception $e) {
    // Error al ejecutar la consulta SQL
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

// Cerrar la conexión
$conexion->close();
?>
