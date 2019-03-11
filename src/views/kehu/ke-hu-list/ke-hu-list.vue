<style lang="less">
@import "ke-hu-list.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>     
                    <Form inline :label-width="70" class="search-form">
                      <Form-item label="昵称">
                        <Input type="text" v-model="searchKey" clearable placeholder="请输入搜索昵称" style="width: 200px"/>
                      </Form-item>
                        <Form-item label="联系电话">
                            <Input type="text" v-model="mobile" clearable placeholder="请输入搜索联系电话" style="width: 200px"/>
                        </Form-item>
                        <Form-item label="起止时间">
                            <DatePicker type="datetimerange"  @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                        </Form-item>
                      <!--<Form-item label="创建时间">-->
                        <!--<DatePicker type="daterange" v-model="selectDate" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>-->
                      <!--</Form-item>-->
                      <Form-item style="margin-left:-35px;" class="br">
                        <Button @click="handleSearch"  type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handleReset" >重置</Button>
                      </Form-item>
                    </Form>
                    <Row class="operation">
                        <Button type="primary" size="large" @click="exportData_a(1)"><Icon type="ios-download-outline"></Icon>导出所有数据</Button>

                        <!--<Button @click="clearAll" type="error" icon="md-trash">清空全部</Button>-->
                      <Button @click="delAll" v-if="flag_delAll" icon="md-trash">批量删除</Button>
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
        <!--//代售-->
        <Modal :title="modal_weiTitle" v-model="user_weiModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_wei" :data="data_wei" sortable="custom" @on-sort-change="changeSort_dai" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_dai" :total="total_dai" :page-size="pageSize_dai" @on-change="changePage_dai" @on-page-size-change="changePageSize_dai" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
<!--银行卡-->
        <Modal :title="modal_bankTitle" v-model="user_bankModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_bank" :data="data_bank" sortable="custom" @on-sort-change="changeSort_bank" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_bank" :total="total_bank" :page-size="pageSize_bank" @on-change="changePage_bank" @on-page-size-change="changePageSize_bank" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
        <!--!&#45;&#45;提币&ndash;&gt;-->
        <Modal :title="modal_tibiTitle" v-model="user_tibiModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_tibi" :data="data_tibi" sortable="custom" @on-sort-change="changeSort_tibi" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_tibi" :total="total_tibi" :page-size="pageSize_tibi" @on-change="changePage_tibi" @on-page-size-change="changePageSize_tibi" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
        <!--!&#45;&#45;提现&ndash;&gt;-->
        <Modal :title="modal_tixianTitle" v-model="user_tixianModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_tixian" :data="data_tixian" sortable="custom" @on-sort-change="changeSort_tixian" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_tixian" :total="total_tixian" :page-size="pageSize_tixian" @on-change="changePage_tixian" @on-page-size-change="changePageSize_tixian" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
        <!--!&#45;&#45;收益&ndash;&gt;-->
        <Modal :title="modal_shouTitle" v-model="user_shouModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_shou" :data="data_shou" sortable="custom" @on-sort-change="changeSort_shou" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_shou" :total="total_shou" :page-size="pageSize_shou" @on-change="changePage_shou" @on-page-size-change="changePageSize_shou" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
        <!--!&#45;&#45;充值&ndash;&gt;-->
        <Modal :title="modal_czTitle" v-model="user_czModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_cz" :data="data_cz" sortable="custom" @on-sort-change="changeSort_cz" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_cz" :total="total_cz" :page-size="pageSize_cz" @on-change="changePage_cz" @on-page-size-change="changePageSize_cz" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
        <!--!&#45;&#45;产品&ndash;&gt;-->
        <Modal :title="modal_gouTitle" v-model="user_gouModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_gou" :data="data_gou" sortable="custom" @on-sort-change="changeSort_gou" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_gou" :total="total_gou" :page-size="pageSize_gou" @on-change="changePage_gou" @on-page-size-change="changePageSize_gou" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>
<!--优惠券-->
        <Modal :title="modal_couponTitle" v-model="user_couponModalVisible" :mask-closable="false" :width="1200" :style="{top: '30px'}">
            <Row >

                <Table size="small" :loading="loading" border  :columns="columns_coupon" :data="data_coupon" sortable="custom" @on-sort-change="changeSort_coupon" @on-selection-change="showSelect" ref="table6"></Table>
                <!--<Table :columns="columns_wei" :data="exportData_wei" ref="exportTable_1" style="display:none"></Table>-->
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="pageNumber_coupon" :total="total_coupon" :page-size="pageSize_coupon" @on-change="changePage_coupon" @on-page-size-change="changePageSize_coupon" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Modal>

        <!--用户充值-->
        <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="900" :styles="{top: '30px'}">
            <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">

                <!--<FormItem label="类型" prop="type">-->
                    <!--<Select v-model="userForm.type" placeholder="请选择">-->
                        <!--<Option   :value="0" >减少冻结金额</Option>-->
                        <!--<Option :value="1">增加冻结金额</Option>-->
                        <!--<Option   :value="2" >减少可提现金额</Option>-->
                        <!--<Option :value="3">增加可提现金额</Option>-->
                        <!--<Option :value="4">增加用户总金额</Option>-->
                        <!--<Option :value="5">减少用户总金额</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->



                <FormItem label="金额" prop="money">
                    <InputNumber style="width: 200px" v-model="userForm.money"/>
                </FormItem>

                <FormItem label="描述" prop="desc">
                    <Input style="width: 200px" type="textarea" v-model="userForm.desc"/>
                </FormItem>
                <Button   type="text" >订单列表</Button>

                <!--<Row class="margin-top-10 searchable-table-con1">-->
                    <!--<Table highlight-row @on-current-change="handleRowChange" :loading="loading" border :columns="columns_goods"  :data="order_list" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect2" ref="table_2"></Table>-->
                    <!--<Table :columns="columns_goods" :data="exportData_goods" ref="exportTable_goods" style="display:none"></Table>-->
                <!--</Row>-->
                <!--<Button v-if="order_list.length>0" @click="handleClearCurrentRow">Clear</Button>-->

                <Row class="margin-top-10 searchable-table-con1">
                    <Table  :loading="loading" border :columns="columns_goods"  :data="order_list" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect2" ref="table_2"></Table>
                    <Table :columns="columns_goods" :data="exportData_goods" ref="exportTable_goods" style="display:none"></Table>
                </Row>

                <!--<FormItem label="确认登陆电话" prop="repassword">-->
                <!--<Input type="password" v-model="userForm.repassword"/>-->
                <!--</FormItem>-->
                <!--<FormItem label="" prop="repassword">-->
                <!--<Input type="password" v-model="userForm.repassword"/>-->
                <!--</FormItem>-->
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelUser">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import { setStore } from "@/libs/storage";
import {
  getOrderListData,
  getSearchLogData,
  deleteLog,
  deleteAllLog
} from "@/api/index";
import circleLoading from "../../my-components/circle-loading.vue";
export default {
  name: "ke-hu-list",
  components: {
    circleLoading
  },
  data() {
    return {
        currentid:null,
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
                render:(h,params)=>{
                    let id=params.row.order_id;
                    let defaults=false;
                    if(this.currentid===id){
                        defaults=true;
                    }else{
                        defaults=false;
                    }
                    let self=this;
                    return h("div",[
                        h(
                            "Radio",{
                                props:{
                                    value:defaults
                                },
                                on:{
                                    input:function () {
                                        self.currentid=id;

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
                render:(h,params)=>{
                    return h('div',[
                        h('Input',{
                            props:{
                                type:'text',
                                autofocus:true,
                                value:this.price.price[params.row.id]?this.price.price[params.row.id]:'',

                            },
                            style:{

                            },
                            on:{
                                // 'on-change' (value){
                                //   console.log(value)
                                //   params.row.purchase_price = value.data;
                                //   this.editShop(params.row)
                                // },
                                'on-blur' : (event) =>{
                                    console.log(event);
                                    if(event.target._value){
                                        this.price.price[params.row.id]=event.target._value;
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
        goods:[],
        exportData_select_goods: [],
        total_select_goods: 0,

        data_goods: [

        ],
        exportData_goods: [],
        total_goods: 0,


        show_bi:false,
        show_xian:false,
        show_product:false,
        show_dai:false,
        show_shou:false,
        show_coupon:false,
        show_user_cong:false,
        show_bank:false,
        show_chong:false,
        edit_a:false,
        del:false,
order_list:[],

        //用户充值
        modalType: 0,
        userModalVisible: false,
        modalTitle: "",
        userForm: {
desc:'',
            type: 0,
            avatar: "https://s1.ax1x.com/2018/05/19/CcdVQP.png",
            roles: [],
            money:1,
            user_id: ''
        },
        userRoles: [],
        roleList: [],
        errorPass: "",
        userFormValidate: {
            type: [
                { required: true,type:'number' ,message: "请选择类型", trigger: "blur" }
            ],
            money: [
                { required: true,type:'number', message: "金额不能为空", trigger: "blur" }
            ],
            // mobile: [
            //   { required: true, message: "手机号不能为空", trigger: "blur" },
            //   { validator: validateMobile, trigger: "blur" }
            // ],
            desc: [
                { required: true, message: "请填写操作说明描述" },

            ]
        },
        submitLoading: false,

        //优惠券
        modal_couponType: 0,
        user_couponModalVisible: false,
        modal_couponTitle: "",
        columns_coupon: [
            {
                type: "selection",
                width: 60,
                align: "center"
            },
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
                title: "优惠券来源",
                key: "type_name",
                width: 180,
                sortable: true
            },
            {
                title: "优惠券来自订单id",
                key: "get_order_id",
                width: 180,
                sortable: true
            },
            {
                title: "优惠券使用订单id",
                key: "order_id",
                width: 180,
                sortable: true
            },
            {
                title: "所属用户",
                key: "nickname",
                width: 180,
                sortable: true
            },
            {
                title: "使用时间",
                key: "use_time",
                width: 180,
                sortable: true
            },
            {
                title: "发放时间",
                key: "addtime",
                width: 180,
                sortable: true
            },






            // {
            //     title: "操作",
            //     key: "action",
            //     width: 240,
            //     align: "center",
            //     render: (h, params) => {
            //
            //         return h("div", [
            //
            //
            //             h(
            //                 "Button",
            //                 {
            //                     props: {
            //                         type: "error",
            //                         size: "small",
            //                         disabled: (params.row.del_name==2)?false:true,
            //                     },
            //                     on: {
            //                         click: () => {
            //                             this.remove(params.row);
            //                         }
            //                     }
            //                 },
            //                 "删除"
            //             )
            //         ]);
            //
            //     }
            // }
        ],
        exportData_coupon: [],
        data_coupon: [],
        total_coupon: 0,
        sortColumn_coupon: "createTime",
        sortType_coupon: "desc",
        pageNumber_coupon: 1,
        pageSize_coupon: 10,
        //充值
        modal_czType: 0,
        user_czModalVisible: false,
        modal_czTitle: "",
        columns_cz: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
            //   },
            {
                title: "订单ID",
                key: "order_id",
                width: 145,
                sortable: true
            },
            {
                title: "订单编号",
                key: "order_sn",
                width: 145,
                sortable: true
            },
            {
                title: "昵称",
                key: "nickname",
                width: 145,
                sortable: true
            },
            {
                title: "手机号",
                key: "mobile",
                width: 145,
                sortable: true
            },

            {
                title: "金额",
                key: "account",
                width: 180,
                sortable: true
            },
            {
                title: "操作员",
                key: "admin_name",
                width: 180,
                sortable: true
           },
            {
                title: "操作描述",
                key: "admin_desc",
                width: 180,
                sortable: true
            },
            {
                title: "描述",
                key: "desc",
                width: 180,
                sortable: true
            },


            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            {
                title: "充值时间",
                key: "ctime",
                width: 180,
                sortable: true
            },
            {
                title: "支付时间",
                key: "pay_time",
                width: 180,
                sortable: true
            },
            {
                title: "支付方式",
                key: "pay_name",
                width: 180,
                sortable: true
            },

        ],
        exportData_cz: [],
        data_cz: [],
        total_cz: 0,
        sortColumn_cz: "createTime",
        sortType_cz: "desc",
        pageNumber_cz: 1,
        pageSize_cz: 10,
        //代售
        modal_weiType: 0,
        user_weiModalVisible: false,
        modal_weiTitle: "",
        columns_wei: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
         //   },
            {
                title: "用户ID",
                key: "user_id",
                width: 145,
                sortable: true
            },
            {
                title: "代售类型",
                key: "onsale_count",
                width: 155,
                sortable: true
            },
            {
                title: "代售数量",
                key: "onsale_count",
                width: 155,
                sortable: true
            },
            {
                title: "代售价格",
                key: "onsale_price",
                width: 180,
                sortable: true
            },
            {
                title: "代售总额",
                key: "onsale_price",
                width: 180,
                sortable: true
            },
            {
                title: "产品名称",
                key: "product_name",
                width: 180,
                sortable: true
            },
            {
                title: "已售数量",
                key: "shou_count",
                width: 180,
                sortable: true
            },
            {
                title: "操作员",
                key: "admin_name",
                width: 180,
            },
            {
                title: "操作描述",
                key: "admin_desc",
                width: 180,
            },
            // {
            //     title: "描述",
            //     key: "desc",
            //     width: 180,
            // },

            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            {
                title: "发起时间",
                key: "create_time",
                width: 180,
                sortable: true
            },


        ],
        exportData_wei: [],
        data_wei: [],
        total_wei: 0,
        sortColumn_dai: "createTime",
        sortType_dai: "desc",
        pageNumber_dai: 1,
        pageSize_dai: 10,
      //银行卡
        modal_bankType: 0,
        user_bankModalVisible: false,
        modal_bankTitle: "",
        columns_bank: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
            //   },
            {
                title: "用户ID",
                key: "user_id",
                width: 145,
                sortable: true
            },

            {
                title: "银行卡名称",
                key: "bank_name",
                width: 155,
                sortable: true
            },
            {
                title: "卡号",
                key: "bank_card",
                width: 180,
                sortable: true
            },
            {
                title: "开户行",
                key: "ka_hu_hing",
                width: 180,
                sortable: true
            },
            {
                title: "手机号",
                key: "mobile",
                width: 180,
                sortable: true
            },

            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            {
                title: "添加时间",
                key: "create_time",
                width: 180,
                sortable: true
            },


        ],
        exportData_bank: [],
        data_bank: [],
        total_bank: 0,
        sortColumn_bank: "createTime",
        sortType_bank: "desc",
        pageNumber_bank: 1,
        pageSize_bank: 10,
        //提币
        modal_tibi: 0,
        user_tibiModalVisible: false,
        modal_tibiTitle: "",
        columns_tibi: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
            //   },
            {
                title: "用户ID",
                key: "user_id",
                width: 145,
                sortable: true
            },

            {
                title: "数量",
                key: "num",
                width: 155,
                sortable: true
            },
            {
                title: "地址",
                key: "address",
                width: 180,
                sortable: true
            },

            {
                title: "状态",
                key: "status_name",
                width: 180,
                sortable: true
            },
            {
                title: "操作员",
                key: "admin_name",
                width: 180,
            },
            {
                title: "操作描述",
                key: "admin_desc",
                width: 180,
            },
            {
                title: "描述",
                key: "desc",
                width: 180,
            },
            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            {
                title: "添加时间",
                key: "addtime",
                width: 180,
                sortable: true
            },


        ],
        exportData_tibi: [],
        data_tibi: [],
        total_tibi: 0,
        sortColumn_tibi: "createTime",
        sortType_tibi: "desc",
        pageNumber_tibi: 1,
        pageSize_tibi: 10,
        //购买产品
        modal_gou: 0,
        user_gouModalVisible: false,
        modal_gouTitle: "",
        columns_gou: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
            //   },
            {
                title: "id",
                key: "id",
                width: 145,
                sortable: true
            },
            {
                title: "产品名称",
                key: "goods_name",
                width: 145,
                sortable: true
            },
            {
                title: "优惠金额",
                key: "coupon_money",
                width: 155,
                sortable: true
            },
            {
                title: "总金额",
                key: "unit_price",
                width: 180,
                sortable: true
            },
            {
                title: "状态",
                key: "status_name",
                width: 180,
                sortable: true
            },
            {
                title: "支付时间",
                key: "paytime",
                width: 180,
                sortable: true
            },
            {
                title: "到期时间",
                key: "expiration_time",
                width: 180,
                sortable: true
            },
            // {
            //     title: "状态",
            //     key: "status_name",
            //     width: 180,
            //     sortable: true
            // },

            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            {
                title: "添加时间",
                key: "create_time",
                width: 180,
                sortable: true
            },


        ],
        exportData_gou: [],
        data_gou: [],
        total_gou: 0,
        sortColumn_gou: "createTime",
        sortType_gou: "desc",
        pageNumber_gou: 1,
        pageSize_gou: 10,
        //提现
        modal_tixian: 0,
        user_tixianModalVisible: false,
        modal_tixianTitle: "",
        columns_tixian: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
            //   },
            {
                title: "用户ID",
                key: "user_id",
                width: 145,
                sortable: true
            },
            {
                title: "订单ID",
                key: "order_id",
                width: 145,
                sortable: true
            },
            {
                title: "银行卡名称",
                key: "bank_name",
                width: 155,
                sortable: true
            },
            {
                title: "金额",
                key: "money",
                width: 180,
                sortable: true
            },

            {
                title: "状态",
                key: "status_name",
                width: 180,
                sortable: true
            },
            {
                title: "操作者",
                key: "admin_name",
                width: 180,
                sortable: true
            },
            {
                title: "操作描述",
                key: "admin_desc",
                width: 180,
                sortable: true
            },
            {
                title: "描述",
                key: "desc",
                width: 180,
                sortable: true
            },
            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            {
                title: "添加时间",
                key: "create_time",
                width: 180,
                sortable: true
            },


        ],
        exportData_tixian: [],
        data_tixian: [],
        total_tixian: 0,
        sortColumn_tixian: "createTime",
        sortType_tixian: "desc",
        pageNumber_tixian: 1,
        pageSize_tixian: 10,
        //收益
        modal_shou: 0,
        user_shouModalVisible: false,
        modal_shouTitle: "",
        columns_shou: [
            // {
            //     type: "selection",
            //     width: 60,
            //     align: "center"
            //   },
            {
                title: "日期",
                key: "date",
                width: 155,
                sortable: true
            },
            {
                title: "产品名称",
                key: "goods_name",
                width: 145,
                sortable: true
            },
            {
                title: "手续费",
                key: "day",
                width: 155,
                sortable: true
            },
            {
                title: "数量",
                key: "num",
                width: 180,
                sortable: true
            },
            {
                title: "金额",
                key: "cny",
                width: 180,
                sortable: true
            },
            {
                title: "收益",
                key: "earnings",
                width: 180,
                sortable: true
            },
            // {
            //     title: "状态",
            //     key: "status_name",
            //     width: 180,
            //     sortable: true
            // },

            // {
            //   title: "支付方式",
            //   key: "pay_name",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //   title: "配送方式",
            //   key: "status",
            //   align: "center",
            //   width: 100,
            //   render: (h, params) => {
            //     let re = "";
            //     if (params.row.status === 1) {
            //       re = "开启";
            //     } else if (params.row.status === 0) {
            //       re = "关闭";
            //     }
            //     return h("div", re);
            //   }
            // },
            // {
            //     title: "添加时间",
            //     key: "create_time",
            //     width: 180,
            //     sortable: true
            // },


        ],
        exportData_shou: [],
        data_shou: [],
        total_shou: 0,
        sortColumn_shou: "createTime",
        sortType_shou: "desc",
        pageNumber_shou: 1,
        pageSize_shou: 10,

      loading: true,
      operationLoading: false,
      selectList: [],
      selectCount: 0,
      selectDate: null,
      searchKey: "",
        mobile:'',
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
            key: "user_id",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "昵称",
          key: "nickname",
          width: 120,
          sortable: true,
          fixed: "left"
        },
        {
          title: "联系电话",
          key: "mobile",
          width: 120,
          align: "center",
          sortable: true,

        },
          {
            title: "实名认证",
            key: "status",
            align: "center",
            width: 140,
            render: (h, params) => {

              if (params.row.real_name !== null) {

                return h("div", [
                  h(
                    "Tag",
                    {
                      props: {
                        type: "dot",
                        color: "success"
                      }
                    },
                    "已认证"
                  )
                ]);
              } else{

                return h("div", [
                  h(
                    "Tag",
                    {
                      props: {
                        type: "dot",
                        color: "error"
                      }
                    },
                    "未认证"
                  )
                ]);
              }
            },

          },
          {
              title: "真实姓名",
              key: "real_name",
              width: 110,
              sortable: true,
              fixed: "left"
          },
          {
              title: "身份证号",
              key: "idcard",
              width: 160,
              sortable: true,
              fixed: "left"
          },
          {
              title: "BTC数量",
              key: "btb_nums",
              width: 120,
              align: "center",
              sortable: true,

          },
          {
              title: "余额",
              key: "user_money",
              width: 120,
              align: "center",
              sortable: true,

          },

        {
          title: "注册时间",
          key: "reg_time",
          width: 150,
          sortable: true
        },
          {
              title: "最近登录时间",
              key: "last_login",
              width: 150,
              sortable: true
          },
          {
              title: "状态",
              key: "is_lock",
              width: 160,
              align: "center",
              sortable: true,
              render: (h, params) => {
                  return h('RadioGroup',{
                          props:{
                              //   vModel: 'is_recommend',
                              autofocus:true,
                              value:params.row.is_lock,
                          },

                          on:{
                              'on-change':(status)=>{
                                  //备注：  不要用params。row来修改数据
                                  //table根据data来变更。当前行数据的修改不会反馈到后台script里的数据
                                  //使用$set能够动态监测
                                  if(status ===1){
                                      //  alert(status)
                                      params.row.is_lock = 1;
                                      //   this.$set(this.pagerData.data[params.row._index], '_expanded', true)
                                  }else{
                                      // alert(status)
                                      params.row.is_lock =0;
                                      //   this.$set(this.pagerData.data[params.row._index], '_expanded', false)
                                  }
                                  this.editShop(params.row,'is_lock')
                              }
                          }
                      },[
                          h('Radio',{
                              props:{
                                  label: 1
                              }
                          },'禁用'),
                          h('Radio',{
                              props:{
                                  label: 0
                              }
                          },'正常')
                      ]
                  );
              }
          },
        {
          title: "操作",
          key: "action",
          width: 600,
          align: "center",
        //  fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                    style: {
                        marginRight: "5px",
                        display:(this.del===true)?"inline-block":"none",
                    },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
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
                            display:(this.show_bank===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.bank(params.row);
                            }
                        }
                    },
                    "银行卡"
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
                            display:(this.show_chong===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.chong(params.row);
                            }
                        }
                    },
                    "充值"
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
                            display:(this.show_bi===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.tibi(params.row);
                            }
                        }
                    },
                    "提币"
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
                            display:(this.show_dai===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.daishou(params.row);
                            }
                        }
                    },
                    "代售"
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
                            display:(this.show_xian===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.tixian(params.row);
                            }
                        }
                    },
                    "提现"
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
                            display:(this.show_shou===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.shou(params.row);
                            }
                        }
                    },
                    "收益"
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
                            display:(this.show_product===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.gou(params.row);
                            }
                        }
                    },
                    "购买产品"
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
                            display:(this.show_coupon===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.coupon(params.row);
                            }
                        }
                    },
                    "优惠券"
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
                            display:(this.show_user_cong===true)?"inline-block":"none",
                        },
                        on: {
                            click: () => {
                                this.addUser(params.row);
                            }
                        }
                    },
                    "用户充值"
                ),
            ]);
          }
        }
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      startDate: "",
      endDate: "",
        user_id:0,
        flag_add:false,
        flag_delAll:false,
    };
  },
  methods: {
    init() {
      this.getOrderList();
      this.getBtns();
    },
      //单选
      handleRowChange(currentRow, oldCurrentRow){
       alert(1)
          console.log(currentRow);
       console.log(oldCurrentRow)
      },
      //取消单选
      handleClearCurrentRow () {
          this.$refs.table_2.clearCurrentRow();
      },
      cancelUser() {
          this.userModalVisible = false;
      },

      submitUser() {
          this.$refs.userForm.validate(valid => {
              if (valid) {
                  let url = "/user/setUserRecharge";
                  if (this.modalType === 1) {
                      // 编辑用户
                      url = "/shop/detail";
                  }
                  if (this.modalType === 0) {
                      // if (
                      //   this.userForm.password == "" ||
                      //   this.userForm.password == undefined
                      // ) {
                      //   this.errorPass = "密码不能为空";
                      //   return;
                      // }
                      // if (this.userForm.password.length < 6) {
                      //   this.errorPass = "密码长度不得少于6位";
                      //   return;
                      // }
                  }
                  if(this.currentid==null){
                      this.$Message.error('请选择订单');
                      return ;
                  }
                  this.userForm.order_id=this.currentid;
                  this.submitLoading = true;
                  this.postRequest(url, this.userForm).then(res => {
                      this.submitLoading = false;
                      if (res.success === true) {
                          this.$Message.success("操作成功");
                          this.init();
                          this.userModalVisible = false;
                      }else{
                          this.$Message.error(res.msg)
                      }
                  });
              }
          });
      },

      addUser(v) {
          this.modalType = 0;
          this.modalTitle = "用户充值";
         this.order_list=v.order_list;
          this.$refs.userForm.resetFields();
          this.userModalVisible = true;
      },

      //优惠券
      changePage_coupon(v) {
          // console.log(v)
          this.pageNumber_coupon = v;
          //   pageNumber
          this.getShopList_coupon(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_coupon(v) {

          this.pageSize_coupon= v;
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
      coupon(v){
          this.modal_couponType = 0;
          this.user_id=v.user_id;
          this.getShopList_coupon(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_couponTitle = "优惠券";
          //  this.$refs.userForm.resetFields();
          this.user_couponModalVisible = true;
      },

      getShopList_coupon(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_coupon,
              pageSize:this.pageSize_coupon,
          }
          this.getRequest("/coupon/getUserCoupon", data).then(res => {
              this.loading = false;
              if (res.success === true) {
                  this.data_coupon = res.result;
                  this.total_coupon= res.count;
                  // this.current_total=res.current_total;
                  // this.all_total=res.all_total;

              }
          });
      },


      //充值
      changePage_cz(v) {
          // console.log(v)
          this.pageNumber_cz = v;
          //   pageNumber
          this.getShopList_cz(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_cz(v) {

          this.pageSize_cz= v;
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
      chong(v){
          this.modal_czType = 0;
          this.user_id=v.user_id;
          this.getShopList_cz(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_czTitle = "充值";
          //  this.$refs.userForm.resetFields();
          this.user_czModalVisible = true;
      },

      getShopList_cz(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_cz,
              pageSize:this.pageSize_cz,
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
          this.pageNumber_tixian = v;
          //   pageNumber
          this.getShopList_tixian(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_tixian(v) {

          this.pageSize_tixian= v;
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
      tixian(v){
          this.modal_tixianType = 0;
          this.user_id=v.user_id;
          this.getShopList_tixian(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_tixianTitle = "提现";
          //  this.$refs.userForm.resetFields();
          this.user_tixianModalVisible = true;
      },
      getShopList_tixian(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_tixian,
              pageSize:this.pageSize_tixian,
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
          this.pageNumber_shou = v;
          //   pageNumber
          this.getShopList_shou(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_shou(v) {

          this.pageSize_shou= v;
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
      shou(v){
          this.modal_shouType = 0;
          this.user_id=v.user_id;
          this.getShopList_shou(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_shouTitle = "收益";
          //  this.$refs.userForm.resetFields();
          this.user_shouModalVisible = true;
      },
      getShopList_shou(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_shou,
              pageSize:this.pageSize_shou,
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
          this.pageNumber_tibi = v;
          //   pageNumber
          this.getShopList_tibi(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_tibi(v) {

          this.pageSize_tibi= v;
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
      tibi(v){
          this.modal_tibikType = 0;
          this.user_id=v.user_id;
          this.getShopList_tibi(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_tibiTitle = "提币";
          //  this.$refs.userForm.resetFields();
          this.user_tibiModalVisible = true;
      },
      getShopList_tibi(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_tibi,
              pageSize:this.pageSize_tibi,
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
          this.pageNumber_gou = v;
          //   pageNumber
          this.getShopList_gou(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_gou(v) {

          this.pageSize_gou= v;
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
      gou(v){
          this.modal_gouType = 0;
          this.user_id=v.user_id;
          this.getShopList_gou(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_gouTitle = "购买产品";
          //  this.$refs.userForm.resetFields();
          this.user_gouModalVisible = true;
      },
      getShopList_gou(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_gou,
              pageSize:this.pageSize_gou,
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
          this.pageNumber_bank = v;
          //   pageNumber
          this.getShopList_bank(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_bank(v) {

          this.pageSize_bank= v;
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
bank(v){
    this.modal_bankType = 0;
    this.user_id=v.user_id;
    this.getShopList_bank(v.user_id);
    //  this.searchForm.order_id=v.order_id;
    this.modal_bankTitle = "银行卡";
    //  this.$refs.userForm.resetFields();
    this.user_bankModalVisible = true;
},
      getShopList_bank(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
             pageNumber:this.pageNumber_bank,
             pageSize:this.pageSize_bank,
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
      //     this.pageNumber_tibi = v;
      //     //   pageNumber
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
      //         pageNumber:this.pageNumber_tibi,
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
          this.pageNumber_dai = v;
          //   pageNumber
          this.getShopList_wei(this.user_id);
          this.clearSelectAll();
      },
      changePageSize_dai(v) {

          this.pageSize_dai= v;
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
      daishou(v){
          this.modal_weiType = 0;
          this.user_id=v.user_id;
          this.getShopList_wei(v.user_id);
          //  this.searchForm.order_id=v.order_id;
          this.modal_weiTitle = "代售";
          //  this.$refs.userForm.resetFields();
          this.user_weiModalVisible = true;
      },

      getShopList_wei(id) {
          // 多条件搜索用户列表
          this.loading = true;
          let data={
              user_id:id ,
              pageNumber:this.pageNumber_dai,
              pageSize:this.pageSize_dai,
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
      editShop(v,filed) {


          let  data={
              user_id:v.user_id,
              sort:v[filed],
              filed:filed
              // purchase_num:v.purchase_num
          };
          //console.log(v)
// console.log(v.sg_id);
// console.log(v.purchase_num)
//        console.log(v.purchase_price)
          this.postRequest('/user/editSort',data).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                  this.$Message.success("操作成功");
                  this.init();
                  this.userModalVisible = false;
              }else{
                  this.$Message.error(res.msg);
              }
          });
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
        let that=this;
      this.loading = true;
      let params = "";
      // 后端可配置使用数据库或Elasticsearch搜索 这里分开了2个请求
      if (this.searchKey === "" && this.startDate === "" && this.mobile ==="") {
        params = {
            root_name:this.$route.name,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          // sort: this.sortColumn,
          // order: this.sortType
        };
        this.postRequest('/user/index',params).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result;
            this.total = res.count;
              res.rule.forEach(function (v,k) {

                  if(v==4){

                      that.del=true
                  }
                  if(v==41){

                      that.show_shou=true
                  }
                  if(v==40){

                      that.show_dai=true
                  }
                  if(v==39){

                      that.show_xian=true
                  }
                  if(v==38){

                      that.show_bi=true
                  }
                  if(v==37){

                      that.show_chong=true
                  }
                  if(v==36){

                      that.show_bank=true
                  }
                  if(v==42){

                      that.show_product=true
                  }
                  if(v==43){

                      that.show_user_cong=true
                  }
                  if(v==44){

                      that.show_coupon=true
                  }
              })
          }else{
              let that=this;
              this.$Message.error(res.msg);
              that.$store.commit("logout", that);

              that.$store.commit("clearOpenedSubmenu");
              setStore("accessToken", '');
              // 强制刷新页面 重新加载router
              location.reload();
          }
        });
      } else {
        params = {
            root_name:this.$route.name,
            mobile:this.mobile,
            nickname: this.searchKey,
      pageNumber: this.pageNumber,
         pageSize: this.pageSize,
          sort: this.sortColumn,
          order: this.sortType,
            start_time: this.startDate,
            end_time: this.endDate
        };
          this.postRequest('/user/index',params).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result;
            this.total = res.count;
              res.rule.forEach(function (v,k) {

                  if(v==4){

                      that.del=true
                  }
                  if(v==41){

                      that.show_shou=true
                  }

                  if(v==40){

                      that.show_dai=true
                  }
                  if(v==39){

                      that.show_xian=true
                  }
                  if(v==38){

                      that.show_bi=true
                  }
                  if(v==37){

                      that.show_chong=true
                  }
                  if(v==36){

                      that.show_bank=true
                  }
                  if(v==42){

                      that.show_product=true
                  }
                  if(v==43){

                      that.show_user_cong=true
                  }
                  if(v==44){

                      that.show_coupon=true
                  }
              })
          }else{
              let that=this;
              this.$Message.error(res.msg);
              that.$store.commit("logout", that);

              that.$store.commit("clearOpenedSubmenu");
              setStore("accessToken", '');
              // 强制刷新页面 重新加载router
              location.reload();
          }
        });
      }
    },
      handleSearch() {
          this.pageNumber = 1;
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
          this.deleteRequest('/user/delAll',{ids:v.user_id}).then(res => {
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
      exportData_a (type) {
          // alert(type)
          if (type === 1) {
              this.getRequest("/order/getRechargeAllList",this.searchForm).then(res => {
                  if (res.success === true) {
                      this.expor_data=res.result;
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
          this.selectList.forEach(function(e) {
            ids += e.user_id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.operationLoading = true;
          this.deleteRequest('/user/delAll',{ids:ids}).then(res => {
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
    },
      getBtns(){
          //  console.log(this.$route)
          let name=this.$route.name;
          this.postRequest('/admin/getBtns',{name:name}).then(res=>{
              this.btns=res.data;
              let that=this;
              this.btns.forEach(function (v) {
                  if(v==1){
                      //  $('#add').show();
                      that.flag_add=true;
                      // $('#add_yi').show();
                  }
                  //  if(v==2){
                  //   this.del='inline-block'
                  //
                  //  }
                  //  if(v==3){
                  // this.edi='inline-block'
                  //
                  //  }
                  if(v==2){
                      // $('#del_all').show();
                      that.flag_delAll=true;
                  }
              })
          })
      }
  },
  mounted() {
    this.init();
  }
};
</script>