<template>
  <el-dialog title="编辑文档"
             fullscreen
             v-model="showVis">
  <el-form :model="form">
    <el-form-item label="标题" :label-width="formLabelWidth">
      <el-input v-model="form.title" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="内容" :label-width="formLabelWidth">
      <editor-bar ref="Editor" :content="form.content" :isClear="isClear" @change="changeContent"></editor-bar>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="showVis = false">取 消</el-button>
      <el-button type="primary" @click="formSubmit">确 定</el-button>
    </span>
  </template>
</el-dialog>
</template>
<script>
import EditorBar from './Editor'
import axios from "axios";
import qs from "querystring"

export default {
  name: 'doc-form',
  components: { EditorBar },
  data() {
    return {
      form: {
        id: 0,
        parent_id: 0,
        title: '',
        content: String,
        children: {}
      },
      formLabelWidth: '120px',
      showVis: false,
      isClear: false,
      isEdit: false
    };
  },
  props: {
    currData: Object
  },
  methods: {
    showForm(val,isEdit) {
      this.isEdit = isEdit;
      this.showVis = true;
      if (Object.keys(val).length > 0){
        this.form = {...val}
      }
    },
    formSubmit(){
      this.showVis = false;
      // axios.defaults.baseURL='/api'
      axios.post('/help/insertOrUpdate',
          qs.stringify({
            id: this.form.id,
            parent_id: this.form.parent_id,
            title: this.form.title,
            content: this.form.content,
          })
          ).then((res)=>{
        if (res.data.code !== 200){
          alert(res.data.msg)
        } else {
         this.$parent.getDocList();
         if (this.isEdit){
           this.$parent.setCurrent(this.form.title,this.form.content);
         }
        }
      }).catch((error)=>{
        console.log(error);
      });
    },
    changeContent(val){
      this.form.content = val;
    }
  },
  mounted() {
  },
  watch: {
    form(){
      console.log(this.form)
    },

  },
};
</script>