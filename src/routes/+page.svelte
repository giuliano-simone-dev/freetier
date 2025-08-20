<script>
  import { onMount } from 'svelte';
  import { GradientButton  } from 'flowbite-svelte';
  let imageVisible = false;
  
  onMount(() => {
    // Pequeño delay para que la animación sea visible
    setTimeout(() => {
      imageVisible = true;
    }, 100);
  });
</script>

<div class="hero-container">
  <!-- Imagen de fondo -->
  <div 
    class="background-image"
    class:visible={imageVisible}
    style="background-image: url('./resources/fondo.png')"
  ></div>
  
  <!-- Texto encima -->
  <div class="content">
    <h1 class="text-8xl font-bold text-white">Comienza a rankear tus listas</h1>
    <p class="text-2xl mt-4 text-white">¡Bienvenido a FreeTier!</p>
    <GradientButton class="w-50 h-15 text-2xl mt-8" href="./#/editor" color="cyanToBlue">Crear Lista</GradientButton>

  </div>
</div>

<style>
  .hero-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 2s ease-in-out;
    z-index: 1;
  }
  
  .background-image.visible {
    opacity: 0.7; /* Ajusta la opacidad para que el texto sea legible */
  }
  
  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Sombra para mejor legibilidad */
  }
</style>