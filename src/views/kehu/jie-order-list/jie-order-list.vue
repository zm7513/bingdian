<style lang="less">
@import "jie-order-list.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>     
                    <Form inline :label-width="70" class="search-form">
                      <Form-item label="搜索日志">
                        <Input type="text" v-model="searchKey" clearable placeholder="请输入搜索关键词" style="width: 200px"/>
                      </Form-item>
                      <Form-item label="创建时间">
                        <DatePicker type="daterange" v-model="selectDate" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                      </Form-item>
                      <Form-item style="margin-left:-35px;" class="br">
                        <Button @click="getOrderList"  type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handleReset" >重置</Button>
                      </Form-item>
                    </Form>
                    <Row class="operation">
                      <!--<Button @click="clearAll" type="error" icon="md-trash">清空全部</Button>-->
                      <Button @click="delAll" icon="md-trash">批量删除</Button>
                      <Button @click="getOrderList" icon="md-refresh">刷新</Button>
                      <circleLoading v-if="operationLoading"/>
                    </Row>
                     <Row>
                        <Alert show-icon>
                            已选择 <span class="select-count">{{selectCount}}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                        </Alert>
                    </Row>
                    <Row>
                        <Table :loading="loading" size="small" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {
  getOrderListData,
  getSearchLogData,
  deleteLog,
  deleteAllLog
} from "@/api/index";
import circleLoading from "../../my-components/circle-loading.vue";
export default {
  name: "jie-order-list",
  components: {
    circleLoading
  },
  data() {
    return {
      loading: true,
      operationLoading: false,
      selectList: [],
      selectCount: 0,
      selectDate: null,
      searchKey: "",
      sortColumn: "createTime",
      sortType: "desc",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          type: "ID",
            key: "id",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "客户姓名",
          key: "name",
          width: 110,
          sortable: true,
          fixed: "left"
        },
        {
          title: "联系电话",
          key: "tel",
          width: 120,
          align: "center",
          sortable: true,

        },

        {
          title: "维修类别",
          width: 200,
          key: "cate_name",
          tooltip: true
        },
          {
              title: "维修人员",
              width: 200,
              key: "real_name",
              tooltip: true
          },
        {
          title: "描述",
          key: "desc",
          width: 105,
          sortable: true
        },
        {
          title: "创建时间",
          key: "create_time",
          width: 120,
          sortable: true
        },
        {
          title: "维修状态",
          key: "wei_status_name",
          width: 100,
          sortable: true
        },
        {
          title: "支付状态",
          key: "pay_status_name",
          width: 130,
          sortable: true,
          align: "center",

        },
        {
          title: "提现状态",
          key: "ti_status_name",
          sortable: true,
          width: 150,
          sortType: "desc"
        },
          {
              title: "是否优惠",
              key: "is_quan_name",
              sortable: true,
              width: 150,
              sortType: "desc"
          },
          {
              title: "维修期",
              key: "create_time",
              sortable: true,
              width: 150,
              sortType: "desc"
          },
        {
          title: "操作",
          key: "action",
          width: 98,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      startDate: "",
      endDate: ""
    };
  },
  methods: {
    init() {
      this.getOrderList();
    },
    changePage(v) {
      this.pageNumber = v;
      this.getOrderList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getOrderList();
    },
    selectDateRange(v) {
      if (v) {
        this.startDate = v[0];
        this.endDate = v[1];
      }
    },
    getOrderList() {
      this.loading = true;
      let params = "";
      // 后端可配置使用数据库或Elasticsearch搜索 这里分开了2个请求
      if (this.searchKey === "" && this.startDate === "") {
        params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          // sort: this.sortColumn,
          // order: this.sortType
        };
        this.postRequest('/order/jie_index',params).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result;
            this.total = res.count;
          }
        });
      } else {
        params = {
          key: this.searchKey,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          sort: this.sortColumn,
          order: this.sortType,
          startDate: this.startDate,
          endDate: this.endDate
        };
          this.postRequest('/order/index',params).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result.content;
            this.total = res.result.totalElements;
          }
        });
      }
    },
    handleReset() {
      this.searchKey = "";
      this.selectDate = null;
      this.startDate = "";
      this.endDate = "";
      this.getOrderList();
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该条数据?",
        onOk: () => {
          this.operationLoading = true;
          this.deleteRequest('/order/del_jieoorderAll',{ids:v.id}).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.init();
            }else{
                this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    changeSort(e) {
      this.sortColumn = e.key;
      this.sortType = e.order;
      if (e.order === "normal") {
        this.sortType = "";
      }
      this.getOrderList();
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.operationLoading = true;
          this.deleteRequest('/order/del_jieoorderAll',{ids:ids}).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.init();
            }else{
                this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    clearAll() {
      this.$Modal.confirm({
        title: "请谨慎进行此操作！",
        content: "您确认要彻底清空删除所有数据?",
        onOk: () => {
          this.loading = true;
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          deleteAllLog().then(res => {
            this.loading = false;
            if (res.success === true) {
              this.$Message.success("清空日志成功");
              this.clearSelectAll();
              this.init();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>