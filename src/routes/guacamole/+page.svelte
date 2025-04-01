<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } =$props();
    let loading = $state(false);
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
                title="Guacamole"
                src="http://localhost:8080/guacamole/#/?token={form.authToken}"
                class="w-full h-[600px] border-0"
            ></iframe>
        </div>
    {/if}
</div>