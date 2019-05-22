<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item label="选择JaxwayServer">
					<el-select v-model="jaxwayServerId" placeholder="请选择 Jaxway Server" @change="selectjaxServerTrigger(jaxwayServerId)">
						<el-option
						v-for="(item,index) in jaxServerOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAddRoute">新建路由</el-button>
				</el-form-item>
			</el-form>

		
		</el-col>

		<!--列表-->
		<el-table :data="RouteInfo" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40">
			</el-table-column>
			<el-table-column type="index" width="40">
			</el-table-column>
			<el-table-column prop="url" label="Url" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="predicateType" label="predicate类型" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="predicateValue" label="predicete值" width="180" sortable>
			</el-table-column>
				<el-table-column prop="filterType" label="filter类型" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="filterValue" label="filter值" width="180" sortable>
			</el-table-column>
			<el-table-column prop="createUserId" label="创建用户Id" width="180" sortable>
			</el-table-column>
			<el-table-column prop="updateTime" label="更新时间" min-width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="danger" size="small" @click="handleDelRoute(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		<!--新增路由界面-->
		<el-dialog title="新增 Route" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addRouteForm" label-width="200px" :rules="addRouteFormRules" ref="addRouteForm">
				<el-form-item label="URL" prop="url">
					<el-input v-model="addRouteForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="ID" prop="routeId">
					<el-input v-model="addRouteForm.routeId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Gateway Predicates 类型" prop="predicateType">
					<el-select v-model="addRouteForm.predicateType" placeholder="请选择 Predicates 类型">
						<el-option
						v-for="(item,index) in predicateTypes"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						:title="item.descp">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Gateway Predicates value" prop="predicateValue">
					<el-input type="textarea" v-model="addRouteForm.predicateValue" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Gateway Filter 类型" prop="filterType">
					<el-select v-model="addRouteForm.filterType" placeholder="请选择 Filter 类型">
						<el-option
						v-for="(item,index) in filterTypes"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						:title="item.descp">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Gateway Filter value" prop="filterValue"> 
					<el-input type="textarea" v-model="addRouteForm.filterValue" auto-complete="off"></el-input>
				</el-form-item>
			
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addRouteSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { removeRouteDefinition, getPredicatesInfos,getFilterInfos,addRouteDefinition,getJaxwayServers,getJaxwayServersRoutesInfo } from '../../api/api';

	export default {
		data() {
			return {
				predicateTypes:[],
				jaxServerOptions:[],
				filterTypes:[],
				jaxwayServerId: '',
				RouteInfo: [],

				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列	

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addRouteFormRules: {
					routeId: [
						{ required: true, message: '请输入Route Id', trigger: 'blur' }
					],
					url: [
						{ required: true, message: '请输入url', trigger: 'blur' }
					],
					predicateType: [
						{ required: true, message: '请选择predicateType', trigger: 'blur' }
					],
					predicateValue: [
						{ required: true, message: '请输入predicateValue', trigger: 'blur' }
					],
					filterType: [
						{ required: true, message: '请选择filterType', trigger: 'blur' }
					],
					filterValue: [
						{ required: true, message: '请输入filterValue', trigger: 'blur' }
					]
				},
				//新增界面数据
				addRouteForm: {
				    url: '',
					routeId: '',
					predicateType: '',
					predicateValue: '/',
					filterType: '',
					filterValue: '',
					opType:5, // ADD_ROUTE
					jaxwayServerId: 2
				}

			}
		},
		methods: {
			
			//删除
			handleDelRoute: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = Object.assign({}, row);
					removeRouteDefinition(para).then((data) => {
						let { status, code, body } = data;

						this.listLoading = false;
						//NProgress.done();
						if(code == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						}else{
							this.$message({
							message: body,
							type: 'error'
						});
						}
						this.getJaxwayServersRoutesInfo(this.jaxwayServerId);
						//this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示新增界面
			handleAddRoute: function () {
				if(this.jaxwayServerId == null || this.jaxwayServerId == ''){
						this.$message({
							message: '请先选择Jaxway Server',
							type: 'error'
						});
						return;
				}
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//新增
			addRouteSubmit: function () {
				this.$refs.addRouteForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addRouteForm);
							para.jaxwayServerId = this.jaxwayServerId;
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addRouteDefinition(para).then((data) => {
								
								this.addLoading = false;
								let { status, code, body } = data;
								//NProgress.done();
								if(code == 200){
									this.$message({
										message: '新建路由成功',
										type: 'success'
									});
								this.$refs['addRouteForm'].resetFields();
								this.addFormVisible = false;
								this.getJaxwayServersRoutesInfo(this.jaxwayServerId);

								}else{
									this.$message({
										message: body,
										type: 'error'
									});
									this.addFormVisible = false;
								}
							
								
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				//var ids = this.sels;
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let paras = this.sels;

					paras.forEach(para=>{

						removeRouteDefinition(para);
					});
				    this.listLoading = false;
					this.getJaxwayServersRoutesInfo(this.jaxwayServerId);
				}).catch(() => {

				});
			},
			// 选中 JaxwayServer 事件
			selectjaxServerTrigger:function(id){
				console.log("选中id="+id)
				this.getJaxwayServersRoutesInfo(id);
				
			},
			// 查看 predicate 和filter信息
			getPredicatesAndFilterInfos: function(){
				getPredicatesInfos().then(data=>{
					let { status, code, body } = data;
					if(code == 200){
						body.forEach(element => {
							let option = {};
							option.label = element.name;
							option.value = element.name;
							this.predicateTypes.push(option);
						});
					}
				});
				getFilterInfos().then(data=>{
					let { status, code, body } = data;
					if(code == 200){
						body.forEach(element => {
							let option = {};
							option.label = element.name;
							option.value = element.name;
							this.filterTypes.push(option);
						});
					}
				});

			},
			// 查看用户所拥有的 Jaxway Server
			getJaxwayServers: function(){
				getJaxwayServers().then(data=>{
					let { status, code, body } = data;
					if(code == 200){
						body.forEach(element => {
							let option = {};
							option.label = element.jaxwayName;
							option.value = element.id;
							this.jaxServerOptions.push(option);
						});
					}
				});
			},
			// 获取Jaxway Server 对应的最终路由信息
			getJaxwayServersRoutesInfo:function(id){
				let params={"jaxwayServerId":id};
				this.listLoading = true;

				getJaxwayServersRoutesInfo(params).then(data=>{
					let { status, code, body } = data;
					if(code == 200){
						this.RouteInfo = body;
					}else{
						this.$message({
							message: body,
							type: 'error'
						});
					}
					this.listLoading = false;
					console.log("routeinfos"+data);
				})
			},
		},
		mounted() {
			this.getJaxwayServers();
			this.getPredicatesAndFilterInfos();
		}
	}

</script>

<style scoped>

</style>