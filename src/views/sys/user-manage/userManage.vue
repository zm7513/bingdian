<style lang="less">
@import "./userManage.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row @keydown.enter.native="handleSearch">
            <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
              <Form-item label="管理员名称" prop="name">
                <Input
                  type="text"
                  v-model="searchForm.name"
                  clearable
                  placeholder="请输入名称"
                  style="width: 200px"
                />
              </Form-item>
              <!--<Form-item label="部门" prop="department">-->
                <!--<department-choose @on-select="handleSelectDep" ref="dep"></department-choose>-->
              <!--</Form-item>-->
              <!--<span v-if="drop">-->
                <!--<Form-item label="手机号" prop="mobile">-->
                  <!--<Input-->
                    <!--type="text"-->
                    <!--v-model="searchForm.mobile"-->
                    <!--clearable-->
                    <!--placeholder="请输入手机号"-->
                    <!--style="width: 200px"-->
                  <!--/>-->
                <!--</Form-item>-->
                <!--<Form-item label="邮箱" prop="email">-->
                  <!--<Input-->
                    <!--type="text"-->
                    <!--v-model="searchForm.email"-->
                    <!--clearable-->
                    <!--placeholder="请输入邮箱"-->
                    <!--style="width: 200px"-->
                  <!--/>-->
                <!--</Form-item>-->
                <!--<Form-item label="性别" prop="sex">-->
                  <!--<Select v-model="searchForm.sex" placeholder="请选择" clearable style="width: 200px">-->
                    <!--<Option v-for="(item, i) in dictSex" :key="i" :value="item.value">{{item.title}}</Option>-->
                  <!--</Select>-->
                <!--</Form-item>-->
                <!--<Form-item label="用户类型" prop="type">-->
                  <!--<Select-->
                    <!--v-model="searchForm.type"-->
                    <!--placeholder="请选择"-->
                    <!--clearable-->
                    <!--style="width: 200px"-->
                  <!--&gt;-->
                    <!--<Option value="0">普通用户</Option>-->
                    <!--<Option value="1">管理员</Option>-->
                  <!--</Select>-->
                <!--</Form-item>-->
                <!--<Form-item label="用户状态" prop="status">-->
                  <!--<Select-->
                    <!--v-model="searchForm.status"-->
                    <!--placeholder="请选择"-->
                    <!--clearable-->
                    <!--style="width: 200px"-->
                  <!--&gt;-->
                    <!--<Option value="0">正常</Option>-->
                    <!--<Option value="-1">禁用</Option>-->
                  <!--</Select>-->
                <!--</Form-item>-->
                <!--<Form-item label="创建时间">-->
                  <!--<DatePicker-->
                    <!--v-model="selectDate"-->
                    <!--type="daterange"-->
                    <!--format="yyyy-MM-dd"-->
                    <!--clearable-->
                    <!--@on-change="selectDateRange"-->
                    <!--placeholder="选择起始时间"-->
                    <!--style="width: 200px"-->
                  <!--&gt;</DatePicker>-->
                <!--</Form-item>-->
              <!--</span>-->
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="add" v-show="add_flag" type="primary" icon="md-add">添加用户</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Dropdown @on-click="handleDropdown">
              <Button>更多操作
                <Icon type="md-arrow-dropdown"/>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
                <DropdownItem name="exportData">导出所选数据</DropdownItem>
                <DropdownItem name="exportAll">导出全部数据</DropdownItem>
                <!--<DropdownItem name="importData">导入数据(付费)</DropdownItem>-->
              </DropdownMenu>
            </Dropdown>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              sortable="custom"
              @on-sort-change="changeSort"
              @on-selection-change="showSelect"
              ref="table"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.page"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal
      :title="modalTitle"
      v-model="userModalVisible"
      :mask-closable="false"
      :width="540"
      :styles="{top: '30px'}"
    >
      <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">
        <FormItem label="用户名" prop="name">
          <Input v-model="userForm.name" autocomplete="off"/>
        </FormItem>
        <FormItem label="密码" prop="password" >
          <Input type="password" v-model="userForm.password" autocomplete="off"/>
        </FormItem>
        <!--<FormItem label="邮箱" prop="email">-->
          <!--<Input v-model="userForm.email"/>-->
        <!--</FormItem>-->
        <FormItem label="手机号" prop="mobile">
          <Input v-model="userForm.mobile"/>
        </FormItem>
        <!--<FormItem label="性别" prop="sex">-->
          <!--<RadioGroup v-model="userForm.sex">-->
            <!--<Radio v-for="(item, i) in dictSex" :key="i" :label="Number(item.value)">{{item.title}}</Radio>-->
          <!--</RadioGroup>-->
        <!--</FormItem>-->
        <Form-item label="头像" prop="avatar">
          <upload-pic-input @on-change="handleUpload" width="285px" ref="upload"></upload-pic-input>
        </Form-item>
        <!--<Form-item label="所属部门">-->
          <!--<department-tree-choose width="285px" @on-change="handleSelectDepTree" ref="depTree"></department-tree-choose>-->
        <!--</Form-item>-->
        <!--<FormItem label="用户类型" prop="type">-->
          <!--<Select v-model="userForm.type" placeholder="请选择">-->
            <!--<Option :value="0">普通用户</Option>-->
            <!--<Option :value="1">管理员</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <FormItem label="角色分配" prop="role_id">
          <Select v-model="userForm.role_id">
            <Option v-for="item in roleList" :value="item.role_id" :key="item.role_id" :label="item.role_name">
              <!-- <div style="display:flex;flex-direction:column"> -->
              <span style="margin-right:10px;">{{ item.role_name }}</span>
              <!--<span style="color:#ccc;">{{ item.description }}</span>-->
              <!-- </div> -->
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
    <!-- 自定义导出数据 -->
    <Modal
      v-model="exportModalVisible"
      :title="exportTitle"
      :loading="loadingExport"
      @on-ok="exportCustomData"
    >
      <Form ref="exportForm" :label-width="85">
        <FormItem label="导出文件名">
          <Input v-model="filename"/>
        </FormItem>
        <FormItem label="自定义导出列">
          <CheckboxGroup v-model="chooseColumns">
            <Checkbox
              v-for="(item, i) in exportColumns"
              :label="item.title"
              :key="i"
              :value="item.checked"
              :disabled="item.disabled"
            ></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
    <Drawer title="导入数据" closable v-model="importModalVisible" width="1000">
      <Upload action :before-upload="beforeUploadImport" accept=".xls, .xlsx">
        <Button icon="ios-cloud-upload-outline" style="margin-right:10px">上传Excel文件</Button>
        <span v-if="uploadfile.name!=''">当前选择文件：{{ uploadfile.name }}</span>
      </Upload>
      <Alert type="warning" show-icon>导入前请下载查看导入模版数据文件，确保数据格式正确，不得修改列英文名称。必需数据字段：用户名(唯一)、密码(明文)</Alert>
      <Table :columns="importColumns" border height="510" :data="importTableData" ref="importTable"></Table>
      <div class="drawer-footer">
        <Button @click="downloadTemple" type="info" style="position:absolute;left:15px;">下载导入模板</Button>
        <Button @click="importModalVisible=false">关闭</Button>
        <Button
          :loading="importLoading"
          :disabled="importTableData.length<=0"
          @click="importData"
          style="margin-left:5px"
          type="primary"
        >
          确认导入
          <span v-if="importTableData.length>0">{{importTableData.length}} 条数据</span>
        </Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  getUserListData,
  getAllRoleList,
  addUser,
  editUser,
  enableUser,
  disableUser,
  deleteUser,
  getAllUserData,
  importUserData,
  uploadFile,
  getDictDataByType
} from "@/api/index";
import expandRow from "./expand.vue";
import departmentChoose from "@/views/my-components/xboot/department-choose";
import departmentTreeChoose from "@/views/my-components/xboot/department-tree-choose";
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
import circleLoading from "@/views/my-components/circle-loading.vue";
// 模版导入文件表数据
import { userColumns, userData } from "@/libs/importTemplate";
// 指定导出列数据
import { exportColumn } from "./exportColumn";
import excel from "@/libs/excel";
export default {
  name: "user-manage",
  components: {
    circleLoading,
    expandRow,
    departmentChoose,
    departmentTreeChoose,
    uploadPicInput
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
        add_flag:false,
      loading: true,
      operationLoading: false,
      importLoading: false,
      loadingExport: true,
      exportModalVisible: false,
      importModalVisible: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      selectCount: 0,
      selectList: [],
      searchForm: {
        username: "",
        departmentId: "",
        mobile: "",
        email: "",
        sex: "",
        type: "",
        status: "",
        page: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        startDate: "",
        endDate: ""
      },
      selectDate: null,
      modalType: 0,
      userModalVisible: false,
      modalTitle: "",
      userForm: {
        sex: 1,
        type: 0,
        role_id: '',
          avatar:'',
          name:'',
          mobile:'',

          password:'',
        departmentId: "",
        departmentTitle: ""
      },
      userRoles: [],
      roleList: [],
      errorPass: "",
      userFormValidate: {
        name: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
          password: [
              { required: true, message: "密码不能为空", trigger: "blur" }
          ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ],
        // email: [
        //   { required: true, message: "请输入邮箱地址" },
        //   { type: "email", message: "邮箱格式不正确" }
        // ]
      },
      submitLoading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          type: "expand",
          width: 50,
          fixed: "left",
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            });
          }
        },
        // {
        //   type: "index",
        //   width: 60,
        //   align: "center",
        //   fixed: "left"
        // },
          {
              title: "ID",
              key: "id",
              width: 80,
              sortable: true,
              fixed: "left"
          },
        {
          title: "用户名",
          key: "name",
       //   minWidth: 145,
            width: 120,
          sortable: true,
          fixed: "left"
        },
          {
              title: "所属角色",
              key: "role_name",
              //   minWidth: 145,
              width: 120,
              sortable: true,
              fixed: "left"
          },
        {
          title: "头像",
          key: "avatar",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("Avatar", {
              props: {
                src: params.row.avatar
              }
            });
          }
        },
        // {
        //   title: "所属部门",
        //   key: "departmentTitle",
        //   width: 120
        // },
        {
          title: "手机",
          key: "mobile",
          width: 130,
          sortable: true,
          // render: (h, params) => {
          //   if (this.getStore("roles").includes("ROLE_ADMIN")) {
          //     return h("span", params.row.mobile);
          //   } else {
          //     return h("span", "您无权查看该数据");
          //   }
          // }
        },
        // {
        //   title: "邮箱",
        //   key: "email",
        //   width: 180,
        //   sortable: true
        // },
        // {
        //   title: "性别",
        //   key: "sex",
        //   width: 70,
        //   align: "center",
        //   render: (h, params) => {
        //     let re = "";
        //     this.dictSex.forEach(e => {
        //       if (e.value == params.row.sex) {
        //         re = e.title;
        //       }
        //     });
        //     return h("div", re);
        //   }
        // },
        // {
        //   title: "用户类型",
        //   key: "type",
        //   align: "center",
        //   width: 100,
        //   render: (h, params) => {
        //     let re = "";
        //     if (params.row.type === 1) {
        //       re = "管理员";
        //     } else if (params.row.type === 0) {
        //       re = "普通用户";
        //     }
        //     return h("div", re);
        //   }
        // },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 140,
          render: (h, params) => {
            let re = "";
            if (params.row.status === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "success"
                    }
                  },
                  "正常"
                )
              ]);
            } else if (params.row.status === 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "error"
                    }
                  },
                  "禁用"
                )
              ]);
            }
          },
          filters: [
            {
              label: "正常",
              value: 1
            },
            {
              label: "禁用",
              value: 0
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.status === 0;
            } else if (value === 1) {
              return row.status === 1;
            }
          }
        },
        {
          title: "创建时间",
          key: "create_time",
        //  sortable: true,
        //  sortType: "desc",
          width: 180
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let enableOrDisable = "";
            let edit="";
            let del ="";
              if(this.$route.meta.permTypes.includes("delete")){
                  del= h(
                      "Button",
                      {
                          props: {
                              type: "error",
                              size: "small"
                          },
                          style: {
                              marginRight: "5px"
                          },
                          on: {
                              click: () => {
                                  this.remove(params.row);
                              }
                          }
                      },
                      "删除"
                  );
              }
            if(this.$route.meta.permTypes.includes("disable")){
                edit= h(
                            "Button",
                            {
                                props: {
                                    type: "primary",
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

            if (params.row.status == 1 && this.$route.meta.permTypes.includes("disable")) {
              enableOrDisable = h(
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
                      this.disable(params.row,0);
                    }
                  }
                },
                "禁用"
              );
            } else {
                if(this.$route.meta.permTypes.includes("enable")){
                    enableOrDisable = h(
                        "Button",
                        {
                            props: {
                                type: "success",
                                size: "small"
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                    this.disable(params.row,1);
                                }
                            }
                        },
                        "启用"
                    );
                }

            }


                return h("div", [
                    edit,
                    enableOrDisable,
                    del
                ]);


          }
        }
      ],
      exportColumns: exportColumn,
      chooseColumns: [],
      filename: "用户数据",
      exportTitle: "确认导出",
      exportType: "",
      importTableData: [],
      importColumns: [],
      uploadfile: {
        name: ""
      },
      tempColumns: userColumns,
      tempData: userData,
      data: [],
      exportData: [],
      total: 0,
      dictSex: []
    };
  },
  methods: {
    init() {
      this.getUserList();
      //this.getDictSexData();
      // 初始化导出列数据
        let that=this;
        if(this.$route.meta.permTypes.includes("add")){
          that.add_flag=true;
        }
      let array = [];
      // this.exportColumns.forEach(e => {
      //   // 指定列限制权限
      //   if (
      //     !this.getStore("roles").includes("ROLE_ADMIN") &&
      //     e.key === "mobile"
      //   ) {
      //     e.title = "[无权导出] " + e.title;
      //     e.disabled = true;
      //   } else {
      //     e.disabled = false;
      //   }
      //   array.push(e.title);
      // });
      // this.chooseColumns = array;
    },
    getDictSexData() {
      // 获取性别字典数据
      getDictDataByType("sex").then(res => {
        if (res.success) {
          this.dictSex = res.result;
        }
      });
    },
    handleSelectDepTree(v) {
      this.userForm.departmentId = v[0];
    },
    handleSelectDep(v) {
      this.searchForm.departmentId = v;
    },
    changePage(v) {
      this.searchForm.page = v;
      this.getUserList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getUserList() {
      // 多条件搜索用户列表
      this.loading = true;
      // 避免后台默认值
      if (!this.searchForm.type) {
        this.searchForm.type = "";
      }
      if (!this.searchForm.status) {
        this.searchForm.status = "";
      }
      getUserListData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success === true) {
          this.data = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handleSearch() {
      this.searchForm.page = 1;
      this.searchForm.pageSize = 10;
      this.getUserList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.page = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.$refs.dep.clearSelect();
      this.searchForm.departmentId = "";
      // 重新加载数据
      this.getUserList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getUserList();
    },
    getRoleList() {
      getAllRoleList().then(res => {
        if (res.success === true) {
          this.roleList = res.data;
        }
      });
    },
    handleDropdown(name) {
      if (name === "refresh") {
        this.getUserList();
      } else if (name === "exportData") {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未选择要导出的数据");
          return;
        }
        this.exportType = "part";
        this.exportModalVisible = true;
        this.exportTitle = "确认导出 " + this.selectCount + " 条数据(付费)";
      } else if (name === "exportAll") {
        this.exportType = "all";
        this.exportModalVisible = true;
        this.exportTitle = "确认导出全部 " + this.total + " 条数据(付费)";
        getAllUserData(this.searchForm).then(res => {
          if (res.success) {
            this.exportData = res.result;
          }
        });
      } else if (name === "importData") {
        this.importModalVisible = true;
      }
    },
    exportCustomData() {
      if (this.filename == "") {
        this.filename = "用户数据";
      }
      // 判断勾选导出列
      let array = [];
      this.exportColumns.forEach(e => {
        this.chooseColumns.forEach(c => {
          if (e.title === c && !e.disabled) {
            array.push(e);
          }
        });
      });
      this.exportColumns = array;
      this.exportModalVisible = false;
      let title = [];
      let key = [];
      this.exportColumns.forEach(e => {
        title.push(e.title);
        key.push(e.key);
      });
      const params = {
        title: title,
        key: key,
        data: this.exportData,
        autoWidth: true,
        filename: this.filename
      };
      excel.export_array_to_excel(params);
    },
    beforeUploadImport(file) {
      this.uploadfile = file;
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file);
        this.file = file;
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc:
            "所选文件‘ " +
            file.name +
            " ’不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。"
        });
      }
      return false;
    },
    // 读取文件
    readFile(file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = e => {
        this.$Message.error("文件读取出错");
      };
      reader.onload = e => {
        this.$Message.success("读取数据成功");
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map(item => {
          return { title: item, key: item };
        });
        this.importTableData = results;
        this.importColumns = tableTitle;
      };
    },
    downloadTemple() {
      let title = [];
      let key = [];
      userColumns.forEach(e => {
        title.push(e.title);
        key.push(e.key);
      });
      const params = {
        title: title,
        key: key,
        data: userData,
        autoWidth: true,
        filename: "导入用户数据模版"
      };
      excel.export_array_to_excel(params);
    },
    importData() {
      this.importLoading = true;
      importUserData(this.importTableData).then(res => {
        this.importLoading = false;
        if (res.success) {
          this.importModalVisible = false;
          this.getUserList();
          this.$Modal.info({
            title: "导入结果",
            content: res.message
          });
        }
      });
    },
    cancelUser() {
      this.userModalVisible = false;
    },
    submitUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加用户 避免编辑后传入id
            delete this.userForm.id;
            delete this.userForm.status;
            if (
              this.userForm.password == "" ||
              this.userForm.password == undefined
            ) {
              this.errorPass = "密码不能为空";
              return;
            }
            if (this.userForm.password.length < 6) {
              this.errorPass = "密码长度不得少于6位";
              return;
            }
            this.submitLoading = true;
            addUser(this.userForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.getUserList();
                this.userModalVisible = false;
              }else{
                  this.$Message.error(res.message);
              }
            });
          } else {
            // 编辑
            this.submitLoading = true;
            editUser(this.userForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.getUserList();
                this.userModalVisible = false;
              }else{
                  this.$Message.error(res.message);
              }
            });
          }
        }
      });
    },
    handleUpload(v) {
      this.userForm.avatar = v;
    },
    add() {
      this.modalType = 0;
        this.userForm.id='';
      this.modalTitle = "添加用户";
      this.$refs.userForm.resetFields();
      this.userModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;

      this.modalTitle = "编辑用户";
      this.$refs.userForm.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      this.userForm = data;
    //  this.$refs.depTree.setSelectDep([data.departmentId], data.departmentTitle);
      this.$refs.upload.setPicUrl(data.avatar);
      let selectRolesId = [];
      // this.userForm.roles.forEach(function(e) {
      //   selectRolesId.push(e.id);
      // });
      // this.userForm.roles = selectRolesId;
      this.userModalVisible = true;
    },
    enable(v) {
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用用户 " + v.username + " ?",
        onOk: () => {
          this.operationLoading = true;
          enableUser(v.id).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.getUserList();
            }
          });
        }
      });
    },
    disable(v,status) {
      this.$Modal.confirm({
        title: "确认禁用",
        content: "您确认要禁用用户 " + v.name + " ?",
        onOk: () => {
          this.operationLoading = true;
          let data={
              admin_id:v.id,
              status:status,
          }
          disableUser(data).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.getUserList();
            }else{
                this.$Message.error(res.message);
            }
          });
        }
      });
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除用户 " + v.name + " ?",
        onOk: () => {
          this.operationLoading = true;
          deleteUser({ids:v.id},{ids:v.id}).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.getUserList();
            }
          });
        }
      });
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },
    showSelect(e) {
      this.exportData = e;
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
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
          deleteUser({ids:ids},{ids:ids}).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getUserList();
            }else{
                this.$Message.error(res.message);
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
    this.getRoleList();
  }
};
</script>