<template>
  <p @click="changeTitle">{{ title }}</p>
</template>
<script>
import {ref,watch} from 'vue'
export default {
  name: 'test',
  setup(){
    let title = ref('23');
    const changeTitle = ()=>{
      console.log(123)
      title.value ++
    }
    watch(()=>title.value,(new_val,old_val)=>{
      console.log(old_val)
      console.log(new_val)
      console.log('stash 1')
    });
    return {title,changeTitle}
  },
}
</script>