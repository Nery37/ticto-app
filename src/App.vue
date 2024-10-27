<template>
  <span>
    <Loader />
    <router-view></router-view>
  </span>
</template>

<script>
import Loader from '@/components/Loader.vue';
export default {
  components: {
    Loader
  }
}
</script>
