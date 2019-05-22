<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
			<el-input v-model="form.username"></el-input>
		</el-form-item>
		<el-form-item label="用户密码" prop="psw" :rules="[
      { required: true, message: '请输入用户密码', trigger: 'blur' }
    ]">
			<el-input v-model="form.psw" show-password type='password'></el-input>
		</el-form-item>

		<el-form-item label="用户邮箱"  prop="email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }]">
			<el-input v-model="form.email"  type='email'></el-input>
		</el-form-item>
			<el-form-item label="头像地址"  prop="avatar">
			<el-input v-model="form.avatar"></el-input>
		</el-form-item>
		<el-form-item label="用户权限">
			<el-select v-model="form.roleType" placeholder="请选择用户权限">
				<el-option label="普通用户" value="0"></el-option>
				<el-option label="管理员" value="1"></el-option>
			</el-select>
		</el-form-item>
		<!-- <el-form-item label="活动时间">
			<el-col :span="11">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
			</el-col>
			<el-col class="line" :span="2">-</el-col>
			<el-col :span="11">
				<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="即时配送">
			<el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>
		</el-form-item>
		<el-form-item label="活动性质">
			<el-checkbox-group v-model="form.type">
				<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
				<el-checkbox label="地推活动" name="type"></el-checkbox>
				<el-checkbox label="线下主题活动" name="type"></el-checkbox>
				<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="特殊资源">
			<el-radio-group v-model="form.resource">
				<el-radio label="线上品牌商赞助"></el-radio>
				<el-radio label="线下场地免费"></el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="活动形式">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item> -->
		<el-form-item>
			<el-button type="primary" v-on:click="onSubmit">立即创建</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import { adminAddUser } from '../../api/api';
	import NProgress from 'nprogress';
	let Base64 = require('js-base64').Base64;
	export default {
		data() {
			return {
				form: {
					username: '',
					psw: '',
					email: '',
					roleType: '',
					avatar:'',
				}
			}
		},
		methods: {
			onSubmit() {
				let para = Object.assign({}, this.form);
				para.psw = Base64.encode("jax-way"+this.form.username+this.form.psw);
				if(para.avatar == ''){
					para.avatar = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4057717590,86878552&fm=27&gp=0.jpg';
				}
				NProgress.start();
				adminAddUser(para).then((data) => {
								let { status, code, body } = data;
								console.log(data);
								NProgress.done();
								if(code == 200){
									this.$message({
									message: '用户添加成功',
									type: 'success'
									});
								}else{
									  this.$message({
										  message: body,
										  type: 'error'
										  });
								}
								this.$refs['form'].resetFields();
								
							});
				console.log('submit!');
			}
		}
	}

</script>