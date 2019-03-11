<style lang="less">
    @import "shop-list.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Form inline :label-width="70" class="search-form">
                        <Form-item label="昵称">
                            <Input type="text" v-model="searchKey" clearable placeholder="请输入搜索昵称"
                                   style="width: 200px"/>
                        </Form-item>
                        <Form-item label="联系电话">
                            <Input type="text" v-model="mobile" clearable placeholder="请输入搜索联系电话" style="width: 200px"/>
                        </Form-item>
                        <!--<Form-item label="起止时间">-->
                        <!--<DatePicker type="datetimerange"  @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>-->
                        <!--</Form-item>-->
                        <!--<Form-item label="创建时间">-->
                        <!--<DatePicker type="daterange" v-model="selectDate" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>-->
                        <!--</Form-item>-->
                        <Form-item style="margin-left:-35px;" class="br">
                            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            <Button @click="handleReset">重置</Button>
                        </Form-item>
                    </Form>
                    <Row class="operation">
                        <!--<Button type="primary" size="large" @click="exportData_a(1)"><Icon type="ios-download-outline"></Icon>导出所有数据</Button>-->
                        <Button @click="add" v-show="add_flag" type="primary" icon="md-add">添加商户</Button>

                        <!--<Button @click="clearAll" type="error" icon="md-trash">清空全部</Button>-->
                        <!--<Button @click="delAll" v-if="flag_delAll" icon="md-trash">批量删除</Button>-->
                        <Button @click="getShopAdminList" icon="md-refresh">刷新</Button>
                        <circleLoading v-if="operationLoading"/>
                    </Row>
                    <Row>
                        <Alert show-icon>
                            已选择 <span class="select-count">{{selectCount}}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                        </Alert>
                    </Row>
                    <Row>
                        <Table :loading="loading" size="small" border :columns="columns" :data="data" ref="table"
                               sortable="custom" @on-sort-change="changeSort"
                               @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="page" :total="total" :page-size="pageSize" @on-change="changePage"
                              @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total
                              show-elevator show-sizer></Page>
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

                <FormItem label="名称" prop="name">
                <Input v-model="userForm.name"/>
                </FormItem>

                <FormItem label="手机号" prop="mobile">
                    <Input v-model="userForm.mobile"/>
                </FormItem>


            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelUser">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
            </div>
        </Modal>


    </div>
</template>

<script>
    import {validateMobile, validateIDCard, validatePassword} from "../../../libs/validate";
    import {setStore} from "@/libs/storage";
    import {
        getOrderListData,
        getSearchLogData,
        deleteLog,
        deleteAllLog
    } from "@/api/index";
    import circleLoading from "@/views/my-components/circle-loading.vue";

    export default {
        name: "shop-admin",
        components: {
            circleLoading
        },
        data() {
            return {
shop_id:"",

                currentid: null,
                columns_goods: [
                    // {
                    //   type: "selection",
                    //   width: 60,
                    //   align: "center",
                    //   _checked:true
                    // },
                    {
                        title: "选择",
                        //  key: "goods_id",
                        width: 145,
                        //  sortable: true,
                        render: (h, params) => {
                            let id = params.row.order_id;
                            let defaults = false;
                            if (this.currentid === id) {
                                defaults = true;
                            } else {
                                defaults = false;
                            }
                            let self = this;
                            return h("div", [
                                h(
                                    "Radio", {
                                        props: {
                                            value: defaults
                                        },
                                        on: {
                                            input: function () {
                                                self.currentid = id;

                                            }
                                        }
                                    }
                                )
                            ])
                        }
                    },
                    {
                        title: "订单ID",
                        key: "order_id",
                        width: 145,
                        sortable: true,

                    },

                    {
                        title: "金额",
                        key: "account",
                        width: 115,
                        sortable: true
                    },
                    {
                        title: "创建时间",
                        key: "ctime",
                        width: 115,
                        sortable: true
                    },
                    // {
                    //   title: "采购价",
                    //   key: "purchase_price",
                    //   width: 115,
                    //   sortable: true
                    // },
                    {
                        title: "充值方式",
                        key: "pay_name",
                        width: 115,
                        sortable: true
                    },
                    {
                        title: "订单编号",
                        key: "order_sn",
                        width: 115,
                        sortable: true
                    },
                    //         {
                    //           title: "发放数量",
                    //           key: "shop_price",
                    //           width: 180,
                    //           render:(h,params)=>{
                    //             return h('div',[
                    //               h('Input',{
                    //                 props:{
                    //                   type:'text',
                    //                   autofocus:true,
                    //                   value:params.row.ship_price,
                    //
                    //                 },
                    //                 style:{
                    //
                    //                 },
                    //                 on:{
                    //                   // 'on-change' (value){
                    //                   //   console.log(value)
                    //                   //   params.row.purchase_price = value.data;
                    //                   //   this.editShop(params.row)
                    //                   // },
                    //                   'on-blur' : (event) =>{
                    //                    console.log(event);
                    //
                    // this.price.price[params.row.id]=event.target._value;
                    //                     params.row.ship_price = event.target._value;
                    //                     console.log(this.price);
                    //                     console.log(params.row)
                    //                     // this.userForm.ship_price= event.target._value;
                    //                   //  this.editShop(params.row);
                    //                   }
                    //                 }
                    //               })
                    //             ])
                    //           }
                    //         },


                ],
                columns_select_goods: [
                    // {
                    //   type: "selection",
                    //   width: 60,
                    //   align: "center"
                    // },
                    {
                        title: "ID",
                        key: "id",
                        width: 145,
                        sortable: true
                    },

                    {
                        title: "优惠券名称",
                        key: "name",
                        width: 115,
                        sortable: true
                    },
                    {
                        title: "发放数量",
                        key: "shop_price",
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        autofocus: true,
                                        value: this.price.price[params.row.id] ? this.price.price[params.row.id] : '',

                                    },
                                    style: {},
                                    on: {
                                        // 'on-change' (value){
                                        //   console.log(value)
                                        //   params.row.purchase_price = value.data;
                                        //   this.editShop(params.row)
                                        // },
                                        'on-blur': (event) => {
                                            console.log(event);
                                            if (event.target._value) {
                                                this.price.price[params.row.id] = event.target._value;
                                                // this.prices.push(event.target._value)
                                            }

                                            // params.row.ship_price = event.target._value;
                                            // console.log(this.price);
                                            // console.log(params.row)
                                            // this.userForm.ship_price= event.target._value;
                                            //  this.editShop(params.row);
                                        }
                                    }
                                })
                            ])
                        }
                    },

                    // {
                    //   title: "操作",
                    //   key: "action",
                    //   width: 240,
                    //   align: "center",
                    //   render: (h, params) => {
                    //     if (params.row.status === 0) {
                    //       return h("div", [
                    //
                    //
                    //         h(
                    //           "Button",
                    //           {
                    //             props: {
                    //               type: "error",
                    //               size: "small"
                    //             },
                    //             on: {
                    //               click: () => {
                    //                 this.remove(params.row);
                    //               }
                    //             }
                    //           },
                    //           "删除"
                    //         )
                    //       ]);
                    //     } else {
                    //       return h("div", [
                    //
                    //         h(
                    //           "Button",
                    //           {
                    //             props: {
                    //               type: "error",
                    //               size: "small"
                    //             },
                    //             on: {
                    //               click: () => {
                    //                 this.remove(params.row);
                    //               }
                    //             }
                    //           },
                    //           "删除"
                    //         )
                    //       ]);
                    //     }
                    //   }
                    // }
                    // {
                    //   title: "区域零售价",
                    //   key: "city",
                    //   width: 180,
                    //   sortable: true
                    // },
                    // {
                    //   title: "采购采购价",
                    //   key: "city",
                    //   width: 180,
                    //   sortable: true
                    // },
                ],
                goods: [],
                exportData_select_goods: [],
                total_select_goods: 0,

                data_goods: [],
                exportData_goods: [],
                total_goods: 0,


                show_bi: false,
                show_xian: false,
                show_product: false,
                show_dai: false,
                show_shou: false,
                show_coupon: false,
                show_user_cong: false,
                show_bank: false,
                show_chong: false,
                edit_a: false,
                del: false,
                order_list: [],

                //用户充值
                modalType: 0,
                userModalVisible: false,
                modalTitle: "",
                userForm: {
                    mobile: '',
                    'name': '',
                    desc: '',
                    type: 0,
                    avatar: "https://s1.ax1x.com/2018/05/19/CcdVQP.png",
                    roles: [],
                    money: 1,
                    user_id: ''
                },
                userRoles: [],
                roleList: [],
                errorPass: "",
                userFormValidate: {
                    name: [
                        {required: true, message: "名称不能为空", trigger: "blur"},
                    ],
                    mobile: [
                        {required: true, message: "手机号不能为空", trigger: "blur"},
                        {validator: validateMobile, trigger: "blur"}
                    ],

                },
                submitLoading: false,



                loading: true,
                operationLoading: false,
                selectList: [],
                selectCount: 0,
                selectDate: null,
                searchKey: "",
                mobile: '',
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
                        title: "ID",
                        key: "id",
                        width: 60,
                        align: "center",
                        fixed: "left"
                    },
                    {
                        title: "名称",
                        key: "name",
                        width: 120,
                        sortable: true,
                        fixed: "left"
                    },
                    {
                        title: "商户号",
                        key: "merchant_id",
                        width: 160,
                        sortable: true,
                        fixed: "left"
                    },
                    {
                        title: "联系电话",
                        key: "mobile",
                        width: 160,
                        align: "center",
                        sortable: true,

                    },
                    {
                        title: "注册时间",
                        key: "created_at",
                        width: 170,
                        sortable: true
                    },

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
                        title: "操作",
                        key: "action",
                        width: 600,
                        align: "center",
                        //  fixed: "right",
                        render: (h, params) => {
                            let enableOrDisable = "";
                            if (this.$route.meta.permTypes){
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
                                                    this.disable(params.row, 0);
                                                }
                                            }
                                        },
                                        "禁用"
                                    );
                                }

                            if (params.row.status == 0 && this.$route.meta.permTypes.includes("enable")) {
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
                                                this.disable(params.row, 1);
                                            }
                                        }
                                    },
                                    "启用"
                                );
                            }
                        }



                            return  h("div", [
                                // h(
                                //   "Button",
                                //   {
                                //     props: {
                                //       type: "error",
                                //       size: "small"
                                //     },
                                //       style: {
                                //           marginRight: "5px",
                                //           display:(this.del===true)?"inline-block":"none",
                                //       },
                                //     on: {
                                //       click: () => {
                                //         this.remove(params.row);
                                //       }
                                //     }
                                //   },
                                //   "删除"
                                // ),
                                enableOrDisable,
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px",
                                            //   display:(this.show_bank===true)?"inline-block":"none",
                                        },
                                        on: {
                                            click: () => {
                                                this.bank(params.row);
                                            }
                                        }
                                    },
                                    "会员"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px",
                                            //     display:(this.show_chong===true)?"inline-block":"none",
                                        },
                                        on: {
                                            click: () => {
                                                this.shop_dian(params.row);
                                            }
                                        }
                                    },
                                    "店铺"
                                ),

                            ]);
                        }
                    }
                ],
                data: [],
                page: 1,
                pageSize: 10,
                total: 0,
                startDate: "",
                endDate: "",
                user_id: 0,
                add_flag: false,
                flag_delAll: false,
            };
        },
        methods: {
            init() {
                this.shop_id = this.$route.query.id;

                this.getShopAdminList();
               // this.getBtns();

            },
            add() {
                this.modalType = 0;
                this.userForm.id = '';
                this.modalTitle = "添加商户";
                this.$refs.userForm.resetFields();
                this.userModalVisible = true;
            },
            disable(v,status) {
                this.$Modal.confirm({
                    title: "确认禁用",
                    content: "您确认要禁用用户 " + v.name + " ?",
                    onOk: () => {
                        this.operationLoading = true;
                        let data={
                            id:v.id,
                            status:status,
                        }
                        this.postRequest('/shop/editStatus',data).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("操作成功");
                                this.getShopAdminList();
                            }else{
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            //单选
            handleRowChange(currentRow, oldCurrentRow) {
                // alert(1)
                //   console.log(currentRow);
                //console.log(oldCurrentRow)
            },
            //取消单选
            handleClearCurrentRow() {
                this.$refs.table_2.clearCurrentRow();
            },
            cancelUser() {
                this.userModalVisible = false;
            },

            submitUser() {
                this.$refs.userForm.validate(valid => {
                    if (valid) {
                        let url = "/shop/shopAdd";
                        if (this.modalType === 1) {
                            // 编辑用户
                            url = "/shop/shopEdit";
                        }
                        if (this.modalType === 0) {

                        }
                        this.submitLoading = true;
                        this.postRequest(url, this.userForm).then(res => {
                            this.submitLoading = false;
                            if (res.success === true) {
                                this.$Message.success("操作成功");
                                this.init();
                                this.userModalVisible = false;
                            } else {
                                this.$Message.error(res.msg)
                            }
                        });
                    }
                });
            },

            addUser(v) {
                this.modalType = 0;
                this.modalTitle = "用户充值";
                this.order_list = v.order_list;
                this.$refs.userForm.resetFields();
                this.userModalVisible = true;
            },

            //优惠券
            changePage_coupon(v) {
                // console.log(v)
                this.page_coupon = v;
                //   page
                this.getShopList_coupon(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_coupon(v) {

                this.pageSize_coupon = v;
                this.getShopList_coupon(this.user_id);
            },
            changeSort_coupon(e) {
                this.sortColumn_coupon = e.key;
                this.sortType_coupon = e.order;
                if (e.order === "normal") {
                    this.sortType_coupon = "";
                }
                this.getShopList_coupon(this.user_id);
            },
            coupon(v) {
                this.modal_couponType = 0;
                this.user_id = v.user_id;
                this.getShopList_coupon(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_couponTitle = "优惠券";
                //  this.$refs.userForm.resetFields();
                this.user_couponModalVisible = true;
            },

            getShopList_coupon(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_coupon,
                    pageSize: this.pageSize_coupon,
                }
                this.getRequest("/coupon/getUserCoupon", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_coupon = res.result;
                        this.total_coupon = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },


            //充值
            changePage_cz(v) {
                // console.log(v)
                this.page_cz = v;
                //   page
                this.getShopList_cz(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_cz(v) {

                this.pageSize_cz = v;
                this.getShopList_cz(this.user_id);
            },
            changeSort_cz(e) {
                this.sortColumn_cz = e.key;
                this.sortType_cz = e.order;
                if (e.order === "normal") {
                    this.sortType_cz = "";
                }
                this.getShopList_cz(this.user_id);
            },
            shop_dian(v) {
                let query = { id: v.id };
                this.$router.push({
                    name: "shop-dian",
                    query: query
                });
            },

            getShopList_cz(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_cz,
                    pageSize: this.pageSize_cz,
                }
                this.getRequest("/user/getUserRecharge", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_cz = res.result;
                        this.total_cz = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },
            //提现
            changePage_tixian(v) {
                // console.log(v)
                this.page_tixian = v;
                //   page
                this.getShopList_tixian(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_tixian(v) {

                this.pageSize_tixian = v;
                this.getShopList_tixian(this.user_id);
            },
            changeSort_tixian(e) {
                this.sortColumn_tixian = e.key;
                this.sortType_tixian = e.order;
                if (e.order === "normal") {
                    this.sortType_tixian = "";
                }
                this.getShopList_tixian(this.user_id);
            },
            tixian(v) {
                this.modal_tixianType = 0;
                this.user_id = v.user_id;
                this.getShopList_tixian(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_tixianTitle = "提现";
                //  this.$refs.userForm.resetFields();
                this.user_tixianModalVisible = true;
            },
            getShopList_tixian(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_tixian,
                    pageSize: this.pageSize_tixian,
                }
                this.getRequest("/user/getUserTx", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_tixian = res.result;
                        this.total_tixian = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },
            //收益
            changePage_shou(v) {
                // console.log(v)
                this.page_shou = v;
                //   page
                this.getShopList_shou(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_shou(v) {

                this.pageSize_shou = v;
                this.getShopList_shou(this.user_id);
            },
            changeSort_shou(e) {
                this.sortColumn_shou = e.key;
                this.sortType_shou = e.order;
                if (e.order === "normal") {
                    this.sortType_shou = "";
                }
                this.getShopList_shou(this.user_id);
            },
            shou(v) {
                this.modal_shouType = 0;
                this.user_id = v.user_id;
                this.getShopList_shou(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_shouTitle = "收益";
                //  this.$refs.userForm.resetFields();
                this.user_shouModalVisible = true;
            },
            getShopList_shou(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_shou,
                    pageSize: this.pageSize_shou,
                }
                this.getRequest("/user/getEarningsList1", data).then(res => {
                    this.loading = false;
                    if (res.status == 1) {
                        //   alert(1)
                        this.data_shou = res.data;
                        this.total_shou = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },

            //提币列表
            changePage_tibi(v) {
                // console.log(v)
                this.page_tibi = v;
                //   page
                this.getShopList_tibi(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_tibi(v) {

                this.pageSize_tibi = v;
                this.getShopList_tibi(this.user_id);
            },
            changeSort_tibi(e) {
                this.sortColumn_tibi = e.key;
                this.sortType_tibi = e.order;
                if (e.order === "normal") {
                    this.sortType_tibi = "";
                }
                this.getShopList_tibi(this.user_id);
            },
            tibi(v) {
                this.modal_tibikType = 0;
                this.user_id = v.user_id;
                this.getShopList_tibi(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_tibiTitle = "提币";
                //  this.$refs.userForm.resetFields();
                this.user_tibiModalVisible = true;
            },
            getShopList_tibi(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_tibi,
                    pageSize: this.pageSize_tibi,
                }
                this.getRequest("/user/getUserTb", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_tibi = res.result;
                        this.total_tibi = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },
            //购买产品
            changePage_gou(v) {
                // console.log(v)
                this.page_gou = v;
                //   page
                this.getShopList_gou(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_gou(v) {

                this.pageSize_gou = v;
                this.getShopList_bank(this.user_id);
            },
            changeSort_gou(e) {
                this.sortColumn_gou = e.key;
                this.sortType_gou = e.order;
                if (e.order === "normal") {
                    this.sortType_gou = "";
                }
                this.getShopList_gou(this.user_id);
            },
            gou(v) {
                this.modal_gouType = 0;
                this.user_id = v.user_id;
                this.getShopList_gou(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_gouTitle = "购买产品";
                //  this.$refs.userForm.resetFields();
                this.user_gouModalVisible = true;
            },
            getShopList_gou(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_gou,
                    pageSize: this.pageSize_gou,
                }
                this.getRequest("/user/getUserProduct", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_gou = res.result;
                        this.total_gou = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },
            //银行卡
            changePage_bank(v) {
                // console.log(v)
                this.page_bank = v;
                //   page
                this.getShopList_bank(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_bank(v) {

                this.pageSize_bank = v;
                this.getShopList_bank(this.user_id);
            },
            changeSort_bank(e) {
                this.sortColumn_bank = e.key;
                this.sortType_bank = e.order;
                if (e.order === "normal") {
                    this.sortType_bank = "";
                }
                this.getShopList_bank(this.user_id);
            },
            bank(v) {
                this.modal_bankType = 0;
                this.user_id = v.user_id;
                this.getShopList_bank(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_bankTitle = "银行卡";
                //  this.$refs.userForm.resetFields();
                this.user_bankModalVisible = true;
            },
            getShopList_bank(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_bank,
                    pageSize: this.pageSize_bank,
                }
                this.getRequest("/user/getUserBank", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_bank = res.result;
                        this.total_bank = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },
            //提币列表
            // changePage_tibi(v) {
            //     // console.log(v)
            //     this.page_tibi = v;
            //     //   page
            //     this.getShopList_tibi(this.user_id);
            //     this.clearSelectAll();
            // },
            // changePageSize_tibi(v) {
            //
            //     this.pageSize_tibi= v;
            //     this.getShopList_tibi(this.user_id);
            // },
            // changeSort_tibi(e) {
            //     this.sortColumn_tibi = e.key;
            //     this.sortType_tibi = e.order;
            //     if (e.order === "normal") {
            //         this.sortType_tibi = "";
            //     }
            //     this.getShopList_tibi(this.user_id);
            // },
            // tibi(v){
            //     this.modal_tibikType = 0;
            //     this.user_id=v.user_id;
            //     this.getShopList_tibi(v.user_id);
            //     //  this.searchForm.order_id=v.order_id;
            //     this.modal_tibiTitle = "提币";
            //     //  this.$refs.userForm.resetFields();
            //     this.user_tibiModalVisible = true;
            // },
            // getShopList_tibi(id) {
            //     // 多条件搜索用户列表
            //     this.loading = true;
            //     let data={
            //         user_id:id ,
            //         page:this.page_tibi,
            //         pageSize:this.pageSize_tibi,
            //     }
            //     this.getRequest("/user/getUserTb", data).then(res => {
            //         this.loading = false;
            //         if (res.success === true) {
            //             this.data_tibi = res.result;
            //             this.total_tibi = res.count;
            //             // this.current_total=res.current_total;
            //             // this.all_total=res.all_total;
            //
            //         }
            //     });
            // },
            //代售
            changePage_dai(v) {
                // console.log(v)
                this.page_dai = v;
                //   page
                this.getShopList_wei(this.user_id);
                this.clearSelectAll();
            },
            changePageSize_dai(v) {

                this.pageSize_dai = v;
                this.getShopList_wei(this.user_id);
            },
            changeSort_dai(e) {
                this.sortColumn_dai = e.key;
                this.sortType_dai = e.order;
                if (e.order === "normal") {
                    this.sortType_dai = "";
                }
                this.getShopList_wei(this.user_id);
            },
            daishou(v) {
                this.modal_weiType = 0;
                this.user_id = v.user_id;
                this.getShopList_wei(v.user_id);
                //  this.searchForm.order_id=v.order_id;
                this.modal_weiTitle = "代售";
                //  this.$refs.userForm.resetFields();
                this.user_weiModalVisible = true;
            },

            getShopList_wei(id) {
                // 多条件搜索用户列表
                this.loading = true;
                let data = {
                    user_id: id,
                    page: this.page_dai,
                    pageSize: this.pageSize_dai,
                }
                this.getRequest("/user/getUserOnsale", data).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data_wei = res.result;
                        this.total_dai = res.count;
                        // this.current_total=res.current_total;
                        // this.all_total=res.all_total;

                    }
                });
            },
            editShop(v, filed) {


                let data = {
                    user_id: v.user_id,
                    sort: v[filed],
                    filed: filed
                    // purchase_num:v.purchase_num
                };
                //console.log(v)
// console.log(v.sg_id);
// console.log(v.purchase_num)
//        console.log(v.purchase_price)
                this.postRequest('/user/editSort', data).then(res => {
                    this.submitLoading = false;
                    if (res.success === true) {
                        this.$Message.success("操作成功");
                        this.init();
                        this.userModalVisible = false;
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            changePage(v) {
                this.page = v;
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
            getShopAdminList() {
                let that = this;
                this.loading = true;
                let params = "";
                // 后端可配置使用数据库或Elasticsearch搜索 这里分开了2个请求
                if (this.searchKey === "" && this.startDate === "" && this.mobile === "") {
                    params = {
                        shop_id: this.shop_id,
                        root_name: this.$route.name,
                        page: this.page,
                        pageSize: this.pageSize,
                        // sort: this.sortColumn,
                        // order: this.sortType
                    };
                    this.getRequest('/shop/index', params).then(res => {
                        this.loading = false;
                        if (res.success === true) {
                            this.data = res.data.data;
                            this.total = res.data.total;

                        } else {
                            let that = this;
                            this.$Message.error(res.message);

                            location.reload();
                        }
                    });
                } else {
                    params = {
                        shop_id: this.shop_id,
                        root_name: this.$route.name,
                        mobile: this.mobile,
                        name: this.searchKey,
                        page: this.page,
                        pageSize: this.pageSize,
                        sort: this.sortColumn,
                        order: this.sortType,
                        start_time: this.startDate,
                        end_time: this.endDate
                    };
                    this.getRequest('/shop/index', params).then(res => {
                        this.loading = false;
                        if (res.success === true) {
                            this.data = res.data.data;
                            this.total = res.data.total;

                        } else {
                            let that = this;
                            this.$Message.error(res.message);

                        }
                    });
                }
            },
            handleSearch() {
                this.page = 1;
                this.pageSize = 10;


                this.init();
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
                        this.deleteRequest('/user/delAll', {ids: v.user_id}).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.init();
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                });
            },
            exportData_a(type) {
                // alert(type)
                if (type === 1) {
                    this.getRequest("/order/getRechargeAllList", this.searchForm).then(res => {
                        if (res.success === true) {
                            this.expor_data = res.result;
                            this.$refs.table.exportCsv({
                                filename: '充值记录',
                                columns: this.columns,
                                data: this.expor_data
                            });
                            // this.$Message.success("操作成功");
                            // this.init();
                        }
                    });


                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: 'Custom data',
                        columns: this.columns8.filter((col, index) => index < 4),
                        data: this.data7.filter((data, index) => index < 4)
                    });
                }
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
                        this.selectList.forEach(function (e) {
                            ids += e.user_id + ",";
                        });
                        ids = ids.substring(0, ids.length - 1);
                        this.operationLoading = true;
                        this.deleteRequest('/user/delAll', {ids: ids}).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.clearSelectAll();
                                this.init();
                            } else {
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
                        this.selectList.forEach(function (e) {
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
            },

        },
        watch: {
            // 监听路由变化通过id获取数据
            $route(to, from) {

                if (to.name == "shop-admin") {
                    this.shop_id = this.$route.query.id;

                    this.getShopDianList();
                }
            }
        },
        mounted() {
            this.init();
        }
    };
</script>