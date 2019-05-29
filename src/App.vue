<template>
  <div id="app"> 
    <router-view/>
  </div>
</template>
<script>
export default {
  name:'App'
}

//字体动态变化
    document.addEventListener("DOMContentLoaded", ()=>{
   const html = document.querySelector('html');
    let fontSize = window.innerWidth / 10;
    fontSize = fontSize > 50 ? 50 : fontSize;
    html.style.fontSize = fontSize + 'px';
});

window.onload = function() {
  //禁止Safari浏览器缩放
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  });
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault()
  });
  
}
</script>

<style lang="scss">
body{
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
