<style lang="less">
.article {
  font-size: 16px;
  font-weight: 400;
  margin: 12px 0;
}
</style>
<template>
  <div class="editor">
    <Row style="min-width:780px">
      <Card>
        <p slot="title">
          富文本编辑 -
          <a href="http://www.wangeditor.com/" target="_blank">wangEditor</a>&nbsp;&nbsp;&nbsp;
          其他编辑器推荐：
          <a
            href="https://github.com/notadd/neditor"
            target="_blank"
          >neditor</a>
        </p>
        <Form ref="form" :label-width="60">
          <Form-item label="内容详情">
            <editor @on-change="show" ref="editor"></editor>
          </Form-item>
          <Form-item label="说明：">使用开源wangEditor编辑器，已配置好图片上传、表情包、编辑HTML代码、全屏预览、XSS攻击过滤。
            <br>当然你可以根据官方文档自行配置使用，由于wangEditor轻量简洁美观等特点这里没有选用neditor。
          </Form-item>
          <Alert type="warning" show-icon style="width:50%">现已组件化封装 使用说明见下方</Alert>
          <h3 class="article">events</h3>
          <Table :columns="columns1" :data="data1" border size="small" width="700"></Table>
          <h3 class="article">methods</h3>
          <Table :columns="columns2" :data="data2" border size="small" width="700"></Table>
        </Form>
      </Card>
    </Row>
  </div>
</template>

<script>
import editor from "@/views/my-components/xboot/editor";
export default {
  name: "html-edit",
  components: {
    editor
  },
  data() {
    return {
      data: "",
      columns1: [
        {
          title: "事件名",
          key: "name"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "返回值",
          key: "value"
        }
      ],
      data1: [
        {
          name: "on-change",
          type: "String",
          value: "富文本编辑器内容（已过滤XSS）"
        }
      ],
      columns2: [
        {
          title: "方法名",
          key: "name"
        },
        {
          title: "说明",
          key: "type"
        },
        {
          title: "参数",
          key: "value"
        }
      ],
      data2: [
        {
          name: "setData",
          type: "设置富文本编辑器内容（回显使用）",
          value: "你要设定的内容"
        }
      ],
    };
  },
  methods: {
    init(){
      this.$refs.editor.setData('<img src="http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_doge02_org.png" alt="[doge]">');
    },
    show(v) {
      this.data = v;
    }
  },
  mounted() {
    this.init();
  }
};
</script>