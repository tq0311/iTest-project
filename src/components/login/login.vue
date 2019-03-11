<template>
	<div class="login">
		<div class="box">
			<div class="main">
				<div class="logo">
					<img src="../../assets/images/logo.png">
				</div>
				<div class="main-content">
					<div class="username">
						<TextBox v-model="username" placeholder="Username" iconCls="icon-man"></TextBox>
					</div>
					<div class="password">
						<PasswordBox v-model="password" placeholder="Password" iconCls="icon-lock" :showEye="false"></PasswordBox>
					</div>
					<div class="enter">
						<LinkButton :disabled="false" @click="submit"></LinkButton>
					</div>
				</div>
			</div>
			<el-dialog v-dialogDrag ref="dialog__wrapper" title="用户名不正确" :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
				用户名为字母、数字组成的4~16个字符！
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible1 = false">OK</el-button>
				</div>
			</el-dialog>
			<el-dialog v-dialogDrag ref="dialog__wrapper" title="密码不正确" :visible.sync="dialogFormVisible2" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
				密码为6~16个字符！
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible2 = false">OK</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	export default{
		data () {
			return {
				username: '',
				password: '',
				dialogFormVisible1: false,
				dialogFormVisible2: false
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			submit () {
				if (this.username === '') {
					this.dialogFormVisible1 = true
				} else {
					var that = this
					this.axios.post(`${this.url}/login`, {
						username: this.username,
						password: this.password
					})
					.then(function (response) {
						console.log(response)
						var res = response.data.stat
						if (res === false) {
							that.dialogFormVisible2 = true
						} else {
							that.$router.replace('/index')
						}
					})
					.catch(function (error) {
						console.log(error)
					})
				}
			}
		},
		created () {
			var _self = this
			document.onkeydown = function (e) {
				var key = null
				if (window.event === undefined) {
					key = e.keyCode
				} else {
					key = window.event.keyCode
				}
				if (key === 13) {
					_self.submit()
				}
			}
		}
	}
</script>

<style>
	*{
		margin: 0;
		border: 0;
		padding: 0;
	}
	.login{
		background: url(../../assets/images/lg02.png) repeat-x;
	}
	.login .box{
		background: url(../../assets/images/lg01.png) no-repeat;
		width: 100%;
		height: 100vh;
		background-size: 100% 100%;
	}
	.login .main{
		width: 1000px;
		height: 465px;
		margin: auto;
		padding-top: 175px;
	}
	.login .logo{
		width: 404px;
		height: 79px;
		margin: 0 auto;
	}
	.login .main-content{
		width: 650px;
		height: 180px;
		padding: 90px 0 0 60px;
		margin: 0 auto;
		background: url(../../assets/images/lg03.png) no-repeat;
		background-position: center bottom;
		background-size: 100% auto;
	}
	.login .username, .login .password, .login .enter{
		float: left;
		padding-right: 16px;
		overflow: hidden;
	}
	.login .l-btn-left{
		width: 92px;
		height: 33px;
		background-image: url(../../assets/images/lg04.png);
	}
	.login .l-btn{
		border: none;
	}
	.login .textbox .textbox-text{
		width: 155px;
		height: 30px;
		line-height: 20px;
		padding-top: 5px;
		padding-bottom: 5px;
		margin-left: 0;
	}
	.login .textbox-addon{
		width: 38px;
	}
	.login .textbox-addon .textbox-icon{
		margin: auto;
	}
	.login .el-dialog{
		width: 300px;
		height: 150px;
		padding: 6px;
		background-color: #393f4d;
		border-radius: 5px;
		margin-top: calc(50vh - 100px) !important;
	}
	.login .el-dialog__header{
		background-color: #393f4d;
		height: 28px;
		padding: 0;
		padding-bottom: 6px;
	}
	.login .el-dialog__title{
		font-size: 12px;
		color: #fff;
		font-weight: bold;
		line-height: 22px;
	}
	.login .el-dialog__body{
		background-color: #fff;
		color: #333;
		padding: 10px;
		border: 1px solid #ccc;
		border-top: none;
		font-size: 12px;
		line-height: 22px;
		height: 71px;
	}
	.login .el-dialog__footer{
		padding: 0;
		color: #333;
		background-color: #fff;
		text-align: center;
		height: 37px;
		padding: 5px;
	}
	.login .el-button{
		width: 72px;
		height: 26px;
		border: 1px solid #4ac865;
		line-height: 26px;
		font-size: 12px;
		padding: 0;
	}
	.login .el-button:active{
		color: #fff;
		border-color: #4ac865;
	}
	.login .el-button:focus, .el-button:hover{
		border-color: #fff;
		background-color: #4ac865;
		color: #fff;
	}
	.login .el-tabs--card>.el-tabs__header .el-tabs__item .el-icon-close{
		width: 14px;
	}
	.login .el-dialog__headerbtn{
		top: 8px;
		right: 10px;
	}
	.login .el-icon-close:before{
		color: #fff;
		font-weight: bolder;
		font-weight: 20px;
	}
</style>
