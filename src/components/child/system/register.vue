<template>
	<div class="register">
		<div class="main">
			<form>
				<table border="0" cellpadding="0" cellspacing="1">
					<tr>
						<td>状态：</td>
						<td>已注册：注册节点数为：50</td>
					</tr>
					<tr>
						<td>有效期：</td>
						<td>2019-07-27</td>
					</tr>
					<tr>
						<td>注册码：</td>
						<td>2aee532bd148bdf85a3867979d5e1c39</td>
					</tr>
					<tr>
						<td>上传许可文件：</td>
						<td>
							<input type="file" name="img" multiple>
							<input type="submit" name="" value="点击上传">
							<!-- <el-upload
								class="upload-demo"
								action="https://jsonplaceholder.typicode.com/posts/"
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								:before-remove="beforeRemove"
								multiple
								:limit="3"
								:on-exceed="handleExceed"
								:file-list="fileList">
								<el-button size="small" type="primary">点击上传</el-button>
							</el-upload> -->
						</td>
					</tr>
				</table>
			</form>
			<div class="remind">
				注：如果未获得许可文件或者许可文件无效，请向供应商索取许可文件！
			</div>
		</div>
	</div>
</template>

<script>
	import 'vx-easyui'
	export default{
		name: 'register',
		data () {
			return {
				fileList: [
					{
						name: 'food.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
					}
				]
			}
		},
		methods: {
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
			},
			handleRemove(file, fileList) {
				console.log(file, fileList)
			},
			handlePreview(file) {
				console.log(file)
			},
			handleExceed(files, fileList) {
				this.$message.warning('当前限制选择 3 个文件，本次选择了' + files.length + '个文件，共选择了' + files.length + fileList.length + '个文件')
			},
			beforeRemove(file, fileList) {
				return this.$confirm('确定移除' + file.name + '？')
			}
		}
	}
</script>

<style>
	.register{
		width: 100%;
		height: 100%;
	}
	.register .main{
		margin: auto;
	}
	.register table{
		margin: auto;
		width: 600px;
		background: #ddd;
	}
	.register table td{
		height: 50px;
		background: #fff;
		padding-left: 5px;
		/*border: 1px solid #ddd;*/
	}
	.register .remind{
		width: 600px;
		margin: auto;
		margin-top: 16px;
		height: 30px;
		line-height: 30px;
		padding-left: 5px;
	}
	.register #upload{
		margin-left: 20px;
	}
</style>
