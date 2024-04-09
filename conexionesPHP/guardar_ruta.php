<?php
// Incluir el archivo de conexión
include 'conexion.php';

// Obtener datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"));

try {
    // Verificar si se proporcionó un ID para actualizar la ruta
    if (isset($data->id)) {
        // Actualizar la ruta existente
        $id = $conexion->real_escape_string($data->id);
        $coordenadas = $conexion->real_escape_string($data->coordenadas);
        
        $sql = "UPDATE rutas SET coordenadas='$coordenadas' WHERE id=$id";
    } else {
        // Verificar si ya existe una ruta con el nombre seleccionado
        $nombre_ruta = $conexion->real_escape_string($data->nombre_ruta);
        $coordenadas = $conexion->real_escape_string($data->coordenadas);

        $sql = "SELECT id FROM rutas WHERE nombre_ruta='$nombre_ruta'";
        $result = $conexion->query($sql);

        if ($result->num_rows > 0) {
            // Actualizar la ruta existente
            $row = $result->fetch_assoc();
            $id = $row['id'];
            $sql = "UPDATE rutas SET coordenadas='$coordenadas' WHERE id=$id";
        } else {
            // Insertar una nueva ruta
            $sql = "INSERT INTO rutas (nombre_ruta, coordenadas) VALUES ('$nombre_ruta', '$coordenadas')";
        }
    }

    // Ejecutar la consulta SQL
    if ($conexion->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "La ruta ha sido guardada correctamente."]);
    } else {
        throw new Exception("Error al ejecutar la consulta SQL: " . $conexion->error);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

// Cerrar la conexión
$conexion->close();
?>
