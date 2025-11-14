<template>
  <div :class="['switch-container', { 'active': modelValue }]" @click="toggleSwitch">
    <Motion
      :animate="{
        x: modelValue ? 24 : 0,
      }"
      class="switch-handle"
    />
  </div>
</template>

<script setup>
import { Motion } from '@motionone/vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const toggleSwitch = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<style scoped>
.switch-container {
  width: 56px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.switch-container.active {
  background-color: rgba(10, 200, 110, 0.4);
}

.switch-handle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 0 2px rgba(255, 255, 255, 1);
}
</style>