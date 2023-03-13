<?php
echo "ingreso php";
$fileName = $_POST['fileName'];
$geoJsonString = $_POST['geoJsonString'];
$filePath = "../proyectos/" . $fileName;

if (file_put_contents($filePath, $geoJsonString) !== false) {
  echo "El archivo se ha guardado exitosamente.";
} else {
  echo "Ocurrió un error al guardar el archivo.";
}
?>
