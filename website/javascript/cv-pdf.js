// Función para generar y descargar el CV como PDF
function downloadCV() {
    // Primero, hacer una solicitud para obtener el contenido del CV
    fetch('Patricio_Maya_CV.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el CV');
            }
            return response.text();
        })
        .then(html => {
            // Crear un nuevo documento
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Extraer solo el contenido principal (sin scripts o estilos innecesarios)
            const bodyContent = tempDiv.querySelector('body');
            
            // Opciones para la generación del PDF
            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'Patricio_Maya_CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Mostrar un mensaje mientras se genera el PDF
            const downloadButton = document.getElementById('download-cv');
            const originalText = downloadButton.innerHTML;
            downloadButton.innerHTML = 'Generando PDF...';
            downloadButton.disabled = true;
            
            // Generar el PDF
            html2pdf().from(bodyContent).set(opt).save()
                .then(() => {
                    // Restaurar el botón después de la descarga
                    setTimeout(() => {
                        downloadButton.innerHTML = originalText;
                        downloadButton.disabled = false;
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error al generar el PDF:', error);
                    downloadButton.innerHTML = 'Error: Intenta de nuevo';
                    downloadButton.disabled = false;
                    
                    setTimeout(() => {
                        downloadButton.innerHTML = originalText;
                    }, 3000);
                });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo generar el PDF. Por favor, inténtalo de nuevo más tarde.');
        });
}

// Asignar el evento al botón cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-cv');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadCV);
    }
});