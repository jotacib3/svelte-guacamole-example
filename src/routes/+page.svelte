<div class="container mx-auto p-8 flex flex-col items-center justify-center min-h-[80vh]">
    <h1 class="text-4xl font-bold mb-6 text-center">Ejemplo de Integración con Apache Guacamole</h1>
    
    <div class="max-w-2xl text-center mb-8">
        <p class="text-lg mb-4">
            Esta aplicación demuestra cómo integrar Apache Guacamole con SvelteKit para proporcionar
            acceso remoto a servidores SSH directamente desde el navegador.
        </p>
        <p class="text-lg mb-6">
            Guacamole es una aplicación de cliente remoto basada en navegador que soporta
            protocolos estándar como VNC, RDP y SSH.
        </p>
    </div>
    
    <a 
        href="/guacamole"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
    >
        <span>Probar Conexión SSH</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
    </a>
</div>
