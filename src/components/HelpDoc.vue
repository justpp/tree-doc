<template >
  <div class="doc">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          node-key="id"
          accordion
          highlight-current
          auto-expand-parent
          :default-checked-keys="defaultExpandKeys"
          :default-expanded-keys="defaultExpandKeys"
          :filter-node-method="filterNode"
          @node-click="leftClick"
          @node-contextmenu.prevent="rightClick"
          ref="tree"
        >
        </el-tree>
        <!-- 右键菜单-->
        <div v-show="rightMenuVisible">
          <ul id="menu" class="menu">
            <li class="menu__item" @click="modify">修改</li>
            <li class="menu__item" @click="addLateral">平级添加</li>
            <li class="menu__item" @click="addNext">下级添加</li>
            <li class="menu__item" @click="delOne">删除</li>
          </ul>
        </div>
      </el-aside>
      <el-container>
        <!-- header -->
        <el-header><h3>{{ this.currData.title }}</h3></el-header>
        <!-- 主体 -->
        <el-main v-html="this.currData.content"></el-main>
      </el-container>
    </el-container>
  </div>
  <DocForm ref="DocForm"/>
</template>
<script>
import DocForm from "./DocForm";
import axios from "axios";
import qs from "querystring";
export default {
  name: "HelpDoc",
  components: {
    DocForm,
  },
  data() {
    return {
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      rightMenuVisible: false,

      currData: [],
      currNode: {},
      defaultExpandKeys:[],
      isEdit:false
    }
  },

  methods: {
    // 关键字搜索
    filterNode(value, data) {
      if (!value) return true;
      // 以标题搜索
      return data.title.indexOf(value) !== -1;
    },
    // 获取data数据
    getDocList(){
      axios.defaults.baseURL='/api'
      axios.get('/help/helpDocList',{}).then((res)=>{
        if (res.data.code !== 200){
          alert(res.data.msg)
        } else {
          if (res.data.data.length > 0){
            this.data = res.data.data;
          } else {
           this.DocFormShow(this.currData);
          }
        }
      }).catch((error)=>{
        console.log(error);
      });
    },
    // 表单diag
    DocFormShow(val) {
      this.$refs.DocForm.showForm(val,this.isEdit);
    },
    leftClick(data) {
      this.currData = data;
      this.defaultExpandKeys = [];
      this.defaultExpandKeys = [this.currData.id];
    },
    rightClick(MouseEvent) {
      this.rightMenuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.rightMenuVisible = true;
      this.isEdit = false; // 每次点击左侧让右侧按钮回复默认
      this.isDisplay = true; // 每次点击左侧 右侧显示
      let menu = document.querySelector("#menu");
      menu.style.left = MouseEvent.clientX + 60 + "px";
      // menu.style.left = MouseEvent.clientX - 184 + "px"; // 适配erp
      document.addEventListener("click", this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
      menu.style.top = MouseEvent.clientY - 10 + "px";
      // menu.style.top = MouseEvent.clientY - 88 + "px";// 适配erp
      return false;
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.rightMenuVisible = false;
      document.removeEventListener("click", this.foo); // 要及时关掉监听，加一个alert你就知道了
    },
    // 修改
    modify () {
      this.isEdit = true;
      this.DocFormShow(this.currData);
      this.isEdit = false;
    },
    // 平级添加
    addLateral() {
      let net_obj = {
        'id': 0,
        'parent_id': this.currData.parent_id,
        'title': '',
        'content': '',
      }
      this.DocFormShow(net_obj);
    },
    // 下级添加
    addNext() {
      let net_obj = {
        'id': 0,
        'parent_id': this.currData.id,
        'title': '',
        'content': '',
      }
      this.DocFormShow(net_obj);
    },
    delOne() {
      if (!confirm('确定删除本条记录么？')){
        return false;
      }
      axios.defaults.baseURL='/api'
      axios.post('/help/delOne',
          qs.stringify({
            id: this.currData.id,
          })
      ).then((res)=>{
        if (res.data.code !== 200){
          alert(res.data.msg)
        } else {
          this.getDocList();
        }
      }).catch((error)=>{
        console.log(error);
      });
      this.defaultExpandKeys = [];
      this.defaultExpandKeys = [this.currData['parent_id']];
    },
    // 修改之后 同步修改显示的内容
    setCurrent(title,content){
      this.currData.title = title;
      this.currData.content = content;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    data(){
      if (Object.keys(this.currData).length === 0  && Object.keys(this.data[0]).length > 0) {
        this.currData = this.data[0];
      }
    },

  },
  mounted: function () {
    this.getDocList();
  },
};
</script>
<style>
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #fff;
  color: #333;
  text-align: center;
  height: 90vh;
}

.el-main {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}
.dock {
  height: 100vh;
}
.menu__item {
  display: block;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
  /*margin-left: 0.9px; // erp*/
  margin-left: -42px;
}
.menu {
  height: 125px;
  /*width: 92px;// erp*/
  width: 50px;
  position: absolute;
  border-radius: 10px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
}
li:hover {
  background-color: #1790ff;
  color: white;
}
</style>