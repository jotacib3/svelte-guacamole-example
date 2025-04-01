<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';

    let { form } = $props();
    let loading = $state(false);
    let iframeElement = $state<HTMLIFrameElement>();

    /**
     * Asegura que el iframe tenga el foco para permitir la interacción con el teclado
     */
    function focusIframe() {
        iframeElement?.focus();
    }

    onMount(() => {
        // Asegurar que el iframe tenga foco cuando se cargue
        if (form?.success && iframeElement) {
            setTimeout(focusIframe, 1000); // Dar tiempo para que el iframe se cargue completamente
        }
    });
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">SSH Connection Test</h1>
    
    <form
        method="POST"
        action="?/connect"
        use:enhance={() => {
            loading = true;
            return async ({ update }) => {
                loading = false;
                await update();
                // Dar foco al iframe después de una conexión exitosa
                setTimeout(focusIframe, 1000);
            };
        }}
    >
        <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
        >
            {loading ? 'Connecting...' : 'Connect to SSH'}
        </button>
    </form>

    {#if form?.error}
        <div class="text-red-500 mt-4">
            {form.error}
        </div>
    {/if}

    {#if form?.success}
        <div class="mt-4">
            <iframe
                bind:this={iframeElement}
                title="Guacamole SSH Terminal"
                src="http://localhost:8080/guacamole/#/?token={form.authToken}"
                class="w-full h-[600px] border-0"
                allow="clipboard-read; clipboard-write"
                role="application"
                allowfullscreen
            ></iframe>
        </div>
    {/if}
</div>