<style lang="less">
@import "./roleManage.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
            <Button @click="addRole" v-show="add_flag" type="primary" icon="md-add">添加角色</Button>
            <!--<Button @click="delAll" icon="md-trash">批量删除</Button>-->
            <Button @click="init" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="page" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="role_name">
          <Input v-model="roleForm.role_name" placeholder="按照Spring Security约定建议以‘ROLE_’开头"/>
        </FormItem>
        <FormItem label="描述" prop="role_desc">
          <Input v-model="roleForm.role_desc"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
    <!-- 菜单权限 -->
    <Modal :title="modalTitle" v-model="permModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}" class="permModal">
      <Tree ref="tree" @on-check-change="getCheck()" :data="permData" multiple></Tree>
      <Spin size="large" v-if="treeLoading"></Spin>
      <div slot="footer">
        <Button type="text" @click="cancelPermEdit">取消</Button>
        <Button @click="selectTreeAll">全选/反选</Button>
        <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
      </div>
    </Modal>
    <!-- 数据权限 -->
    <Modal :title="modalTitle" v-model="depModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}" class="depModal">
      <Form :label-width="65" >
        <FormItem label="数据范围">
          <Select v-model="dataType">
            <Option :value="0">全部数据权限</Option>
            <Option :value="1">自定义数据权限</Option>
          </Select>
        </FormItem>
      </Form>
      <Alert show-icon>
        默认可查看全部数据，自定义数据范围请点击选择下方数据
      </Alert>
      <div v-if="dataType!=0" style="margin-top:15px">
        <Tree ref="depTree"   :data="depData" :load-data="loadData" @on-toggle-expand="expandCheckDep" multiple style="margin-top:15px"></Tree>
        <Spin size="large" v-if="depTreeLoading"></Spin>
      </div>
      <div slot="footer">
        <Button type="text" @click="depModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitDepLoading" @click="submitDepEdit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getRoleList,
  getAllPermissionList,
  addRole,
  editRole,
  deleteRole,
  setDefaultRole,
  editRolePerm,
  initDepartment,
  loadDepartment,
  editRoleDep
} from "@/api/index";
import util from "@/libs/util.js";
import circleLoading from "@/views/my-components/circle-loading.vue";
export default {
  name: "role-manage",
  components: {
    circleLoading
  },
  data() {
    return {
      loading: true,
      treeLoading: true,
      depTreeLoading: true,
      operationLoading: false,
      submitPermLoading: false,
      submitDepLoading: false,
      searchKey: "",
      sortColumn: "createTime",
      sortType: "desc",
      modalType: 0,
      roleModalVisible: false,
      permModalVisible: false,
      depModalVisible: false,
      modalTitle: "",
      roleForm: {
          role_name:'',
        role_desc: ""
      },
      roleFormValidate: {
        role_name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      submitLoading: false,
      selectList: [],
      selectCount: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },

          {
              title: "ID",
              key: "role_id",
              width: 150,
            //  sortable: true
          },
        {
          title: "角色名称",
          key: "role_name",
          width: 150,
        //  sortable: true
        },
        {
          title: "描述",
          key: "role_desc",
            width: 150,
        //  minWidth: 190,
        //  sortable: true,
            tooltip:true,
        },
        {
          title: "添加时间",
          key: "create_time",
          width: 170,
          // sortable: true,
          // sortType: "desc"
         },
        // {
        //   title: "更新时间",
        //   key: "updateTime",
        //   width: 160,
        //   sortable: true
        // },
        // {
        //   title: "是否设置为注册用户默认角色",
        //   key: "defaultRole",
        //   align: "center",
        //   width: 180,
        //   render: (h, params) => {
        //     if (params.row.defaultRole) {
        //       return h("div", [
        //         h(
        //           "Button",
        //           {
        //             props: {
        //               type: "success",
        //               size: "small"
        //             },
        //             style: {
        //               marginRight: "5px"
        //             },
        //             on: {
        //               click: () => {
        //                 this.cancelDefault(params.row);
        //               }
        //             }
        //           },
        //           "取消默认"
        //         )
        //       ]);
        //     } else {
        //       return h("div", [
        //         h(
        //           "Button",
        //           {
        //             props: {
        //               type: "info",
        //               size: "small"
        //             },
        //             style: {
        //               marginRight: "5px"
        //             },
        //             on: {
        //               click: () => {
        //                 this.setDefault(params.row);
        //               }
        //             }
        //           },
        //           "设为默认"
        //         )
        //       ]);
        //     }
        //   }
        // },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 300,
          render: (h, params) => {
              let menu="";
              let edit="";
              let del="";
              if(this.$route.meta.permTypes.includes('editPerm')){
                  menu= h(
                      "Button",
                      {
                          props: {
                              type: "warning",
                              size: "small"
                          },
                          style: {
                              marginRight: "5px"
                          },
                          on: {
                              click: () => {
                                  this.editPerm(params.row);
                              }
                          }
                      },
                      "菜单权限"
                  );
              }
              if(this.$route.meta.permTypes.includes('edit')){
                  edit= h(
                      "Button",
                      {
                          props: {
                              size: "small"
                          },
                          style: {
                              marginRight: "5px"
                          },
                          on: {
                              click: () => {
                                  this.edit(params.row);
                              }
                          }
                      },
                      "编辑"
                  );
              }
              if(this.$route.meta.permTypes.includes('delete')){
                  del=  h(
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
              }
            return h("div", [
           menu,

              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "primary",
              //       size: "small"
              //     },
              //     style: {
              //       marginRight: "5px"
              //     },
              //     on: {
              //       click: () => {
              //         this.editDep(params.row);
              //       }
              //     }
              //   },
              //   "数据权限"
              // ),
              edit,
              del

            ]);
          }
        }
      ],
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      permData: [],
      editRolePermId: "",
      selectAllFlag: false,
      depData: [],
      dataType: 0,
      editDepartments: [],
        add_flag:false,
    };
  },
  methods: {
    init() {
      this.getRoleList();
      let that=this;
if(this.$route.meta.permTypes.includes('add')){
    that.add_flag=true;
}
    },
      getCheck(){
          // let ids=getCheckedNodes();
          let ids='';
          //  console.log(this.$refs.tree.getCheckedNodes())
          let idsNode=this.$refs.tree.getCheckedNodes();
          idsNode.forEach(function (v) {
              if(v.children){
                  v.children.forEach(function (i) {
                      ids += i.id+ ",";
                      if(i.children){
                          i.children.forEach(function (r) {
                              ids += r.id+ ",";
                              //   console.log(r)
                          })


                      }
                  })

              }
              ids += v.id + ",";
          })
          ids = ids.substring(0, ids.length - 1);
          this.ids=ids;
      },
    changePage(v) {
      this.page = v;
      this.getRoleList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getRoleList();
    },
    changeSort(e) {
      this.sortColumn = e.key;
      this.sortType = e.order;
      if (e.order === "normal") {
        this.sortType = "";
      }
      this.getRoleList();
    },
    getRoleList() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortColumn,
        order: this.sort
      };
      getRoleList(params).then(res => {
        this.loading = false;
        if (res.code === 200) {
          this.data = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    getPermList(role_id) {
      this.treeLoading = true;
      getAllPermissionList({role_id:role_id}).then(res => {
        this.treeLoading = false;
        if (res.success === true) {
          this.deleteDisableNode(res.data);
          this.permData = res.data;
        }
      });
    },
    // 递归标记禁用节点
    deleteDisableNode(permData) {
      let that = this;
      permData.forEach(function(e) {
        if (e.status === -1) {
          e.title = "[已禁用] " + e.title;
          e.disabled = true;
        }
        if (e.children && e.children.length > 0) {
          that.deleteDisableNode(e.children);
        }
      });
    },
    cancelRole() {
      this.roleModalVisible = false;
    },
    submitRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加
            this.submitLoading = true;
            addRole(this.roleForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.getRoleList();
                this.roleModalVisible = false;
              }else{
                  this.$Message.error(res.message);
              }
            });
          } else {
            this.submitLoading = true;
            editRole(this.roleForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.getRoleList();
                this.roleModalVisible = false;
              }else{
                  this.$Message.error(res.message);
              }
            });
          }
        }
      });
    },
    addRole() {
      this.modalType = 0;
      this.modalTitle = "添加角色";
      this.$refs.roleForm.resetFields();
      delete this.roleForm.id;
      this.roleModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑角色";
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let roleInfo = JSON.parse(str);
      this.roleForm = roleInfo;
      this.roleModalVisible = true;
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除角色 " + v.role_name + " ?",
        onOk: () => {
          this.operationLoading = true;
          deleteRole({role_id:v.role_id}).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.getRoleList();
            }else{
                this.$Message.error(res.message);
            }
          });
        }
      });
    },
    setDefault(v) {
      this.$Modal.confirm({
        title: "确认设置",
        content: "您确认要设置所选的 " + v.name + " 为注册用户默认角色?",
        onOk: () => {
          let params = {
            id: v.id,
            isDefault: true
          };
          this.operationLoading = true;
          setDefaultRole(params).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.getRoleList();
            }
          });
        }
      });
    },
    cancelDefault(v) {
      this.$Modal.confirm({
        title: "确认取消",
        content: "您确认要取消所选的 " + v.name + " 角色为默认?",
        onOk: () => {
          let params = {
            id: v.id,
            isDefault: false
          };
          this.operationLoading = true;
          setDefaultRole(params).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.getRoleList();
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
          deleteRole(ids).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getRoleList();
            }
          });
        }
      });
    },
    editPerm(v) {
        console.warn(v);
      this.editRolePermId = v.role_id;
      this.modalTitle = "分配 " + v.role_name + " 的菜单权限(点击选择)";
      // 匹配勾选
      let rolePerms = v.act_list;
        // 获取所有菜单权限树
        this.getPermList(v.role_id);
      // 递归判断子节点
        if(rolePerms){
            rolePerms=rolePerms.split(',');
           // console.log(rolePerms);
            this.checkPermTree(this.permData, rolePerms);
        }

      this.permModalVisible = true;

    },
    // 递归判断子节点
    checkPermTree(permData, rolePerms) {
       // alert(1)
      //  console.log(rolePerms)
      let that = this;
      permData.forEach(function(p) {
        if (that.hasPerm(p, rolePerms) && p.status!=-1) {
          p.selected = true;
        } else {
          p.selected = false;
        }
        if (p.children && p.children.length > 0) {
          that.checkPermTree(p.children, rolePerms);
        }
      });
    },
    // 判断角色拥有的权限节点勾选
    hasPerm(p, rolePerms) {
      let flag = false;
      for (let i = 0; i < rolePerms.length; i++) {
        if (p.id === rolePerms[i]) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },
    // 全选反选
    selectTreeAll() {

      this.selectAllFlag = !this.selectAllFlag;
      let select = this.selectAllFlag;
      this.selectedTreeAll(this.permData, select);
    },
    // 递归全选节点
    selectedTreeAll(permData, select) {

      let that = this;
      permData.forEach(function(e) {
        e.selected = select;
        if (e.children && e.children.length > 0) {
          that.selectedTreeAll(e.children, select);
          console.log(e.children)
        }
      });
    },
    submitPermEdit() {
      this.submitPermLoading = true;
      let permIds = "";
      let selectedNodes = this.$refs.tree.getSelectedNodes();
      selectedNodes.forEach(function(e) {
        permIds += e.id + ",";
      });
      permIds = permIds.substring(0, permIds.length - 1);
      editRolePerm({
        roleId: this.editRolePermId,
        permIds: permIds
      }).then(res => {
        this.submitPermLoading = false;
        if (res.success === true) {
          this.$Message.success("操作成功");
          util.initRouter(this);
          this.getRoleList();
          this.permModalVisible = false;
        }
      });
    },
    cancelPermEdit() {
      this.permModalVisible = false;
    },
    loadData(item, callback) {
      loadDepartment(item.id, { openDataFilter: false }).then(res => {
        if (res.success === true) {
          res.result.forEach(function(e) {
            e.selected = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.result);
        }
      });
    },
    editDep(v) {
      this.dataType = 0;
      this.editRolePermId = v.id;
      this.modalTitle = "分配 " + v.name + " 的数据权限";
      if (v.dataType) {
        this.dataType = v.dataType;
      }
      // 匹配勾选
      let roleDepIds = v.departments;
      this.editDepartments = roleDepIds;
      this.depTreeLoading = true;
      initDepartment({ openDataFilter: false }).then(res => {
        this.depTreeLoading = false;
        if (res.success === true) {
          res.result.forEach(function(e) {
            e.selected = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.depData = res.result;
          // 判断子节点
          this.checkDepTree(this.depData, roleDepIds);
          this.depModalVisible = true;
        }
      });
    },
    expandCheckDep(v) {
      // 判断展开子节点
      this.checkDepTree(v.children, this.editDepartments);
    },
    // 判断子节点
    checkDepTree(depData, roleDepIds) {
      let that = this;
      depData.forEach(function(p) {
        if (that.hasDepPerm(p, roleDepIds)) {
          p.selected = true;
        } else {
          p.selected = false;
        }
      });
    },
    // 判断角色拥有的权限节点勾选
    hasDepPerm(p, roleDepIds) {
      let flag = false;
      for (let i = 0; i < roleDepIds.length; i++) {
        if (p.id === roleDepIds[i].departmentId) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },
    submitDepEdit() {
      let depIds = "";
      if (this.dataType != 0) {
        let selectedNodes = this.$refs.depTree.getSelectedNodes();
        if (selectedNodes.length < 1) {
          this.$Message.error("请至少选择一条数据");
          return;
        }
        selectedNodes.forEach(function(e) {
          depIds += e.id + ",";
        });
        depIds = depIds.substring(0, depIds.length - 1);
      }
      this.submitDepLoading = true;
      editRoleDep({
        roleId: this.editRolePermId,
        dataType: this.dataType,
        depIds: depIds
      }).then(res => {
        this.submitDepLoading = false;
        if (res.success === true) {
          this.$Message.success("操作成功");
          this.getRoleList();
          this.depModalVisible = false;
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<!--<style lang="less">-->
  <!--@import "roleManage.less";-->
<!--</style>-->
<!--<template>-->
  <!--<div class="search">-->
    <!--<Row>-->
      <!--<Col>-->
        <!--<Card>-->
          <!--<Row class="operation">-->
            <!--<Button @click="addRole"   type="primary" icon="plus-round">添加角色</Button>-->
            <!--&lt;!&ndash;<Button @click="delAll" id="del_all" type="ghost" icon="trash-a">批量删除</Button>&ndash;&gt;-->
            <!--<Button @click="init" icon="refresh">刷新</Button>-->
          <!--</Row>-->
          <!--<Row>-->
            <!--<Alert show-icon>-->
              <!--已选择 <span class="select-count">{{selectCount}}</span> 项-->
              <!--<a class="select-clear" @click="clearSelectAll">清空</a>-->
            <!--</Alert>-->
          <!--</Row>-->
          <!--<Row class="margin-top-10 searchable-table-con1">-->
            <!--<Table size="small" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>-->
          <!--</Row>-->
          <!--<Row type="flex" justify="end" class="code-row-bg page">-->
            <!--<Page :current="this.pageNumber" :total="total" :page-size="this.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[20,50,100,1000]" size="small" show-total show-elevator show-sizer></Page>-->
          <!--</Row>-->
        <!--</Card>-->
      <!--</Col>-->
    <!--</Row>-->
    <!--<Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="500">-->
      <!--<Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">-->
        <!--<FormItem label="角色名称" prop="role_name">-->
          <!--<Input v-model="roleForm.role_name" placeholder="按照Spring Security约定建议以‘ROLE_’开头"/>-->
        <!--</FormItem>-->
        <!--<FormItem label="角色描述" prop="role_desc">-->
          <!--<Input v-model="roleForm.role_desc" type="textarea" :autosize="{minRows: 3,maxRows: 7}" placeholder="请输入"></Input>-->
        <!--</FormItem>-->
        <!--<FormItem label="选择权限" v-model="permModalVisible" prop="role_desc">-->

          <!--<Tree ref="tree" :data="permData"  @on-check-change="getCheck()" show-checkbox  multiple></Tree>-->
          <!--<Spin size="large" v-if="treeLoading"></Spin>-->
          <!--&lt;!&ndash;<Button type="ghost" @click="selectTreeAll">全选/反选</Button>&ndash;&gt;-->
          <!--&lt;!&ndash;<div slot="footer">&ndash;&gt;-->
          <!--&lt;!&ndash;<Button type="text" @click="cancelPermEdit">取消</Button>&ndash;&gt;-->

          <!--&lt;!&ndash;<Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;<Button type="ghost" @click="selectTreeAll">全选/反选</Button>&ndash;&gt;-->
        <!--</FormItem>-->
        <!--&lt;!&ndash;<p style="color: #ed3f14">注：不勾选权限默认为所有权限</p>&ndash;&gt;-->
      <!--</Form>-->
      <!--<div slot="footer">-->

        <!--<Button type="text" @click="cancelRole">取消</Button>-->
        <!--<Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>-->
      <!--</div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash;<Modal title="分配权限(点击选择)" v-model="permModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">&ndash;&gt;-->
    <!--&lt;!&ndash;<Tree ref="tree" :data="permData" multiple></Tree>&ndash;&gt;-->
    <!--&lt;!&ndash;<Spin size="large" v-if="treeLoading"></Spin>&ndash;&gt;-->
    <!--&lt;!&ndash;<div slot="footer">&ndash;&gt;-->
    <!--&lt;!&ndash;<Button type="text" @click="cancelPermEdit">取消</Button>&ndash;&gt;-->
    <!--&lt;!&ndash;<Button type="ghost" @click="selectTreeAll">全选/反选</Button>&ndash;&gt;-->
    <!--&lt;!&ndash;<Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</Modal>&ndash;&gt;-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
   <!--// import quill from 'vue-quill-editor'-->
    <!--//import VDistpicker from 'v-distpicker'-->
    <!--import circleLoading from "@/views/my-components/circle-loading.vue";-->
    <!--export default {-->
        <!--name: "role-manage",-->
        <!--components: {-->
            <!--circleLoading,-->
         <!--//   VDistpicker,-->
          <!--//  quill,-->
        <!--},-->
        <!--data() {-->
            <!--return {-->
                <!--edit_a:false,-->
                <!--del:false,-->
                <!--flag_add:false,-->
                <!--flag_delAll:false,-->
                <!--ids:'',-->
                <!--loading: true,-->
                <!--treeLoading: true,-->
                <!--submitPermLoading: false,-->
                <!--sortColumn: "createTime",-->
                <!--sortType: "desc",-->
                <!--modalType: 0,-->
                <!--roleModalVisible: false,-->
                <!--permModalVisible: false,-->
                <!--modalTitle: "",-->
                <!--roleForm: {-->
                    <!--name: ""-->
                <!--},-->
                <!--roleFormValidate: {-->
                    <!--name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]-->
                <!--},-->
                <!--submitLoading: false,-->
                <!--selectList: [],-->
                <!--selectCount: 0,-->
                <!--columns: [-->
                    <!--{-->
                        <!--type: "selection",-->
                        <!--width: 60,-->
                        <!--align: "center"-->
                    <!--},-->
                    <!--{-->
                        <!--title: "ID",-->
                        <!--key: "role_id",-->
                        <!--sortable: true-->
                    <!--},-->
                    <!--{-->
                        <!--title: "角色名称",-->
                        <!--key: "role_name",-->
                        <!--sortable: true-->
                    <!--},-->
                    <!--{-->
                        <!--title: "描述",-->
                        <!--key: "role_desc",-->
                        <!--sortable: true-->
                    <!--},-->
                    <!--// {-->
                    <!--//   title: "创建时间",-->
                    <!--//   key: "createTime",-->
                    <!--//   sortable: true,-->
                    <!--//   sortType: "desc"-->
                    <!--// },-->
                    <!--// {-->
                    <!--//   title: "更新时间",-->
                    <!--//   key: "updateTime",-->
                    <!--//   sortable: true-->
                    <!--// },-->
                    <!--// {-->
                    <!--//   title: "是否设置为注册用户默认角色",-->
                    <!--//   key: "defaultRole",-->
                    <!--//   align: "center",-->
                    <!--//   render: (h, params) => {-->
                    <!--//     if (params.row.defaultRole) {-->
                    <!--//       return h("div", [-->
                    <!--//         h(-->
                    <!--//           "Button",-->
                    <!--//           {-->
                    <!--//             props: {-->
                    <!--//               type: "success",-->
                    <!--//               size: "small"-->
                    <!--//             },-->
                    <!--//             style: {-->
                    <!--//               marginRight: "5px"-->
                    <!--//             },-->
                    <!--//             on: {-->
                    <!--//               click: () => {-->
                    <!--//                 this.cancelDefault(params.row);-->
                    <!--//               }-->
                    <!--//             }-->
                    <!--//           },-->
                    <!--//           "取消默认"-->
                    <!--//         )-->
                    <!--//       ]);-->
                    <!--//     } else {-->
                    <!--//       return h("div", [-->
                    <!--//         h(-->
                    <!--//           "Button",-->
                    <!--//           {-->
                    <!--//             props: {-->
                    <!--//               type: "info",-->
                    <!--//               size: "small"-->
                    <!--//             },-->
                    <!--//             style: {-->
                    <!--//               marginRight: "5px"-->
                    <!--//             },-->
                    <!--//             on: {-->
                    <!--//               click: () => {-->
                    <!--//                 this.setDefault(params.row);-->
                    <!--//               }-->
                    <!--//             }-->
                    <!--//           },-->
                    <!--//           "设为默认"-->
                    <!--//         )-->
                    <!--//       ]);-->
                    <!--//     }-->
                    <!--//   }-->
                    <!--// },-->
                    <!--{-->
                        <!--title: "操作",-->
                        <!--key: "action",-->
                        <!--align: "center",-->
                        <!--width: 300,-->
                        <!--render: (h, params) => {-->
                            <!--return h("div", [-->
                                <!--// h(-->
                                <!--//   "Button",-->
                                <!--//   {-->
                                <!--//     props: {-->
                                <!--//       type: "warning",-->
                                <!--//       size: "small"-->
                                <!--//     },-->
                                <!--//     style: {-->
                                <!--//       marginRight: "5px"-->
                                <!--//     },-->
                                <!--//     on: {-->
                                <!--//       click: () => {-->
                                <!--//         this.editPerm(params.row);-->
                                <!--//       }-->
                                <!--//     }-->
                                <!--//   },-->
                                <!--//   "分配权限"-->
                                <!--// ),-->
                                <!--h(-->
                                    <!--"Button",-->
                                    <!--{-->
                                        <!--props: {-->
                                            <!--type: "primary",-->
                                            <!--size: "small",-->
                                            <!--//     disabled: (params.row.edit_name==3)?false:true,-->
                                        <!--},-->
                                        <!--style: {-->
                                            <!--marginRight: "5px",-->
                                            <!--display:(this.edit_a===true)?"inline-block":"none",-->
                                        <!--},-->
                                        <!--on: {-->
                                            <!--click: () => {-->
                                                <!--this.edit(params.row);-->
                                            <!--}-->
                                        <!--}-->
                                    <!--},-->
                                    <!--"编辑"-->
                                <!--),-->
                                <!--h(-->
                                    <!--"Button",-->
                                    <!--{-->
                                        <!--props: {-->
                                            <!--type: "error",-->
                                            <!--size: "small",-->
                                            <!--display:(this.del===true)?"inline-block":"none",-->
                                            <!--//         disabled: (params.row.del_name==2)?false:true,-->
                                        <!--},-->
                                        <!--on: {-->
                                            <!--click: () => {-->
                                                <!--this.remove(params.row);-->
                                            <!--}-->
                                        <!--}-->
                                    <!--},-->
                                    <!--"删除"-->
                                <!--)-->
                            <!--]);-->
                        <!--}-->
                    <!--}-->
                <!--],-->
                <!--data: [],-->
                <!--pageNumber: 1,-->
                <!--pageSize: 10,-->
                <!--total: 0,-->
                <!--permData: [],-->
                <!--editRolePermId: "",-->
                <!--selectPermList: [],-->
                <!--selectAllFlag: false,-->
            <!--};-->
        <!--},-->
        <!--methods: {-->
            <!--init() {-->
                <!--this.getRoleList();-->
                <!--this.getBtns();-->
                <!--// 获取所有菜单权限树-->

            <!--},-->
            <!--changePage(v) {-->
                <!--this.pageNumber = v;-->
                <!--this.getRoleList();-->
                <!--this.clearSelectAll();-->
            <!--},-->
            <!--changePageSize(v) {-->
                <!--this.pageSize = v;-->
                <!--this.getRoleList();-->
            <!--},-->
            <!--changeSort(e) {-->
                <!--this.sortColumn = e.key;-->
                <!--this.sortType = e.order;-->
                <!--if (e.order === "normal") {-->
                    <!--this.sortType = "";-->
                <!--}-->
                <!--this.getRoleList();-->
            <!--},-->
            <!--getRoleList() {-->
                <!--this.loading = true;-->
                <!--let that=this;-->
                <!--let name=this.$route.name;-->
                <!--let params = {-->
                    <!--pageNumber: this.pageNumber,-->
                    <!--pageSize: this.pageSize,-->
                    <!--//sort: "createTime"-->
                    <!--root_name:name-->
                <!--};-->
                <!--this.getRequest("/adminRole/index", params).then(res => {-->
                    <!--this.loading = false;-->
                    <!--if (res.success === true) {-->
                        <!--this.data = res.data.data;-->
                        <!--this.total = res.data.total;-->
                        <!--res.rule.forEach(function (v,k) {-->
                            <!--console.log(v)-->
                            <!--if(v==3){-->

                                <!--that.edit_a=true-->
                            <!--}-->
                            <!--if(v==4){-->

                                <!--that.del=true-->
                            <!--}-->
                        <!--})-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--getEditPermList(id) {-->
                <!--this.treeLoading = true;-->
                <!--this.getRequest("/admin/role_edit_info",{role_id:id}).then(res => {-->
                    <!--this.treeLoading = false;-->
                    <!--if (res.success === true) {-->
                        <!--// this.deleteDisableNode(res.result);-->
                        <!--this.permData = res.data;-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--getPermList() {-->
                <!--this.treeLoading = true;-->
                <!--this.getRequest("/permission/getAllList").then(res => {-->
                    <!--this.treeLoading = false;-->
                    <!--if (res.success === true) {-->
                        <!--// this.deleteDisableNode(res.result);-->
                        <!--this.permData = res.data;-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--// 递归删除禁用节点-->
            <!--deleteDisableNode(permData) {-->
                <!--let that = this;-->
                <!--permData.forEach(function(e) {-->
                    <!--// if (e.status === 1) {-->
                    <!--//   e.title += "(已禁用)"-->
                    <!--//   e.disabled = true-->
                    <!--// }-->
                    <!--if (e.children && e.children.length > 0) {-->
                        <!--that.deleteDisableNode(e.children);-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--cancelRole() {-->
                <!--this.roleModalVisible = false;-->
                <!--this.ids='';-->
            <!--},-->
            <!--submitRole() {-->


                <!--let url = "/admin/roleSave";-->
                <!--if (this.modalType === 1 ) {-->
                    <!--// 编辑用户-->
                    <!--url = "/admin/roleSave";-->
                <!--}-->
                <!--if(this.roleForm.act_list && this.ids==''){-->

                    <!--// console.log(this.roleForm.act_list);-->
                    <!--//-->
                    <!--// return ;-->
                    <!--// let ids='';-->
                    <!--// ids= this.roleForm.act_list.join(',');-->
                    <!--// console.log(ids)-->
                    <!--this.roleForm.ids=this.roleForm.act_list;-->
                    <!--//   alert(1)-->
                    <!--// return-->
                <!--}else{-->
                    <!--this.roleForm.ids=this.ids;-->
                    <!--// console.log(this.roleForm.ids);-->
                    <!--//-->
                    <!--// return ;-->
                <!--}-->

                <!--// console.log(this.roleForm)-->
                <!--//   return-->
                <!--this.submitLoading = true;-->
                <!--this.postRequest(url, this.roleForm).then(res => {-->
                    <!--this.submitLoading = false;-->
                    <!--if (res.success === true) {-->
                        <!--this.$Message.success("操作成功");-->
                        <!--this.getRoleList();-->
                        <!--this.roleModalVisible = false;-->
                    <!--}else{-->
                        <!--this.$Message.error(res.msg);-->
                    <!--}-->
                <!--});-->
            <!--},-->

            <!--addRole() {-->
                <!--this.modalType = 0;-->
                <!--this.modalTitle = "添加角色";-->
                <!--this.roleForm=[];-->
                <!--this.getPermList();-->
                <!--this.roleModalVisible = true;-->
            <!--},-->
            <!--edit(v) {-->
                <!--this.modalType = 1;-->
                <!--this.modalTitle = "编辑角色";-->
                <!--// 转换null为""-->
                <!--for (let attr in v) {-->
                    <!--if (v[attr] === null) {-->
                        <!--v[attr] = "";-->
                    <!--}-->
                <!--}-->
                <!--let str = JSON.stringify(v);-->
                <!--let roleInfo = JSON.parse(str);-->
                <!--this.roleForm = roleInfo;-->
                <!--this.getEditPermList(v.role_id)-->
                <!--//  console.log(this.permData)-->
                <!--this.roleModalVisible = true;-->
            <!--},-->

            <!--remove(v) {-->
                <!--this.$Modal.confirm({-->
                    <!--title: "确认删除",-->
                    <!--content: "您确认要删除角色 " + v.role_name + " ?",-->
                    <!--onOk: () => {-->
                        <!--this.deleteRequest("/admin/roleDel", { id: v.role_id }).then(res => {-->
                            <!--if (res.success === true) {-->
                                <!--this.$Message.success("删除成功");-->
                                <!--this.getRoleList();-->
                            <!--}else{-->
                                <!--this.$Message.error(res.msg);-->
                            <!--}-->
                        <!--});-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--setDefault(v) {-->
                <!--this.$Modal.confirm({-->
                    <!--title: "确认设置",-->
                    <!--content: "您确认要设置所选的 " + v.name + " 为注册用户默认角色?",-->
                    <!--onOk: () => {-->
                        <!--let params = {-->
                            <!--id: v.id,-->
                            <!--isDefault: true-->
                        <!--};-->
                        <!--this.postRequest("/role/setDefault", params).then(res => {-->
                            <!--if (res.success === true) {-->
                                <!--this.$Message.success("操作成功");-->
                                <!--this.getRoleList();-->
                            <!--}-->
                        <!--});-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--cancelDefault(v) {-->
                <!--this.$Modal.confirm({-->
                    <!--title: "确认取消",-->
                    <!--content: "您确认要取消所选的 " + v.name + " 角色为默认?",-->
                    <!--onOk: () => {-->
                        <!--let params = {-->
                            <!--id: v.id,-->
                            <!--isDefault: false-->
                        <!--};-->
                        <!--this.postRequest("/role/setDefault", params).then(res => {-->
                            <!--if (res.success === true) {-->
                                <!--this.$Message.success("操作成功");-->
                                <!--this.getRoleList();-->
                            <!--}-->
                        <!--});-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--clearSelectAll() {-->
                <!--this.$refs.table.selectAll(false);-->
            <!--},-->
            <!--changeSelect(e) {-->
                <!--this.selectList = e;-->
                <!--this.selectCount = e.length;-->
            <!--},-->
            <!--delAll() {-->
                <!--if (this.selectCount <= 0) {-->
                    <!--this.$Message.warning("您还未选择要删除的数据");-->
                    <!--return;-->
                <!--}-->
                <!--this.$Modal.confirm({-->
                    <!--title: "确认删除",-->
                    <!--content: "您确认要删除所选的 " + this.selectCount + " 条数据?",-->
                    <!--onOk: () => {-->
                        <!--let ids = "";-->
                        <!--this.selectList.forEach(function(e) {-->
                            <!--ids += e.id + ",";-->
                        <!--});-->
                        <!--ids = ids.substring(0, ids.length - 1);-->
                        <!--this.deleteRequest("/role/delAllByIds", { ids: ids }).then(res => {-->
                            <!--if (res.success === true) {-->
                                <!--this.$Message.success("删除成功");-->
                                <!--this.clearSelectAll();-->
                                <!--this.getRoleList();-->
                            <!--}-->
                        <!--});-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--editPerm(v) {-->
                <!--this.editRolePermId = v.id;-->
                <!--// 匹配勾选-->
                <!--let rolePerms = v.act_list;-->
                <!--// 递归判断子节点-->
                <!--this.checkPermTree(this.permData, rolePerms);-->
                <!--//  this.permModalVisible = true;-->
            <!--},-->
            <!--// 递归判断子节点-->
            <!--checkPermTree(permData, rolePerms) {-->
                <!--let that = this;-->
                <!--permData.forEach(function(p) {-->
                    <!--// console.log(p)-->
                    <!--if (that.hasPerm(p, rolePerms)) {-->
                        <!--p.checked = true;-->
                    <!--} else {-->
                        <!--p.checked = false;-->
                    <!--}-->
                    <!--if (p.children && p.children.length > 0) {-->
                        <!--if(that.checkPermTree(p.children, rolePerms)){-->
                            <!--p.children.checked = true;-->
                        <!--}else{-->
                            <!--p.children.checked = false;-->
                        <!--}-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--// 判断角色拥有的权限节点勾选-->
            <!--hasPerm(p, rolePerms) {-->
<!--//console.log(rolePerms)-->
                <!--let flag = false;-->
                <!--for (let i = 0; i < rolePerms.length; i++) {-->

                    <!--if (p.id == rolePerms[i]) {-->
                        <!--// console.log(p.id )-->
                        <!--// console.log(rolePerms[i]);-->
                        <!--flag = true;-->
                        <!--break;-->
                    <!--}-->
                <!--}-->
                <!--if (flag) {-->
                    <!--return true;-->
                <!--}-->
                <!--return false;-->
            <!--},-->
            <!--// 全选反选-->
            <!--selectTreeAll() {-->
                <!--this.selectAllFlag = !this.selectAllFlag-->
                <!--let select = this.selectAllFlag-->
                <!--this.selectedTreeAll(this.permData, select)-->
            <!--},-->
            <!--// 递归全选节点-->
            <!--selectedTreeAll(permData, select) {-->
                <!--let that = this;-->
                <!--permData.forEach(function(e) {-->
                    <!--e.selected = select-->
                    <!--if (e.children && e.children.length > 0) {-->
                        <!--that.selectedTreeAll(e.children, select);-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--getCheck(){-->
                <!--// let ids=getCheckedNodes();-->
                <!--let ids='';-->
                <!--//  console.log(this.$refs.tree.getCheckedNodes())-->
                <!--let idsNode=this.$refs.tree.getCheckedNodes();-->
                <!--idsNode.forEach(function (v) {-->
                    <!--if(v.children){-->
                        <!--v.children.forEach(function (i) {-->
                            <!--ids += i.id+ ",";-->
                            <!--if(i.children){-->
                                <!--i.children.forEach(function (r) {-->
                                    <!--ids += r.id+ ",";-->
                                    <!--//   console.log(r)-->
                                <!--})-->


                            <!--}-->
                        <!--})-->

                    <!--}-->
                    <!--ids += v.id + ",";-->
                <!--})-->
                <!--ids = ids.substring(0, ids.length - 1);-->
                <!--this.ids=ids;-->
            <!--},-->
            <!--submitPermEdit() {-->
                <!--this.submitPermLoading = true;-->
                <!--let permIds = "";-->
                <!--let selectedNodes = this.$refs.tree.getSelectedNodes();-->
                <!--selectedNodes.forEach(function(e) {-->
                    <!--permIds += e.id + ",";-->
                <!--});-->
                <!--permIds = permIds.substring(0, permIds.length - 1);-->
                <!--this.postRequest("/role/editRolePerm/" + this.editRolePermId, {-->
                    <!--permIds: permIds-->
                <!--}).then(res => {-->
                    <!--this.submitPermLoading = false;-->
                    <!--if (res.success === true) {-->
                        <!--this.$Message.success("操作成功");-->
                        <!--this.getRoleList();-->
                        <!--this.permModalVisible = false;-->
                    <!--}else{-->
                        <!--this.$Message.error(res.msg);-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--cancelPermEdit() {-->
                <!--this.permModalVisible = false;-->
            <!--},-->
            <!--getBtns(){-->
                <!--//  console.log(this.$route)-->
                <!--let name=this.$route.name;-->
                <!--this.postRequest('/admin/getBtns',{name:name}).then(res=>{-->
                    <!--this.btns=res.data;-->
                    <!--let that=this;-->
                    <!--this.btns.forEach(function (v) {-->
                        <!--if(v==1){-->
                            <!--//  $('#add').show();-->
                            <!--that.flag_add=true;-->
                            <!--// $('#add_yi').show();-->
                        <!--}-->
                        <!--//  if(v==2){-->
                        <!--//   this.del='inline-block'-->
                        <!--//-->
                        <!--//  }-->
                        <!--//  if(v==3){-->
                        <!--// this.edi='inline-block'-->
                        <!--//-->
                        <!--//  }-->
                        <!--if(v==2){-->
                            <!--// $('#del_all').show();-->
                            <!--that.flag_delAll=true;-->
                        <!--}-->
                    <!--})-->
                <!--})-->
            <!--}-->

        <!--},-->
        <!--mounted() {-->
            <!--this.init();-->
            <!--// this.getBtns();-->
        <!--}-->
    <!--};-->
<!--</script>-->
