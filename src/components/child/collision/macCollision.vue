<template>
	<div class="mac-collision">
		<div class="search-card">
			<div class="card-top">
				碰撞条件
			</div>
			<div class="card-content">
				<div class="select-template">
					<ComboBox inputId="selectTemplate" v-model="selectTemplate" :data="selectTemplateData" placeholder="选择模板"></ComboBox>
				</div>
				<form id="queryForm">
					<table width="100%" cellpadding="0" cellspacing="0" border="0">
						<tr>
							<th>开始时间</th>
							<td>
								<el-date-picker
									v-model="starttime"
									type="date"
									value-format="timestamp"
									placeholder="选择日期时间">
								</el-date-picker>
							</td>
							<th>结束时间</th>
							<td>
								<el-date-picker
									v-model="endtime"
									type="date"
									value-format="timestamp"
									placeholder="选择日期时间">
								</el-date-picker>
							</td>
						</tr>
						<tr>
							<th>查询类型</th>
							<td>
								<ComboBox inputId="searchType" v-model="searchType" :data="searchTypeData" :editable="false"></ComboBox>
							</td>
							<th>IMSI</th>
							<td>
								<TextBox inputId="imsi" v-model="imsi" v-tooltip="tip" class="add"></TextBox>
							</td>
						</tr>
					</table>
					<div class="event-btn">
						<el-button type="success" id="search" plain @click="search">查询</el-button>
						<el-button type="success" id="reset"  plain @click="reset">重置</el-button>
						<el-button type="success" id="save" plain>保存为模板</el-button>
					</div>
				</form>
			</div>
		</div>
		<div class="results-card">
			<div class="card-top">
				碰撞人员查询结果
			</div>
			<div class="card-content-list">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
						</div>
					</div>
					<el-table
						:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
						height="300"
						stripe
						border
						class="tab"
						>
						<el-table-column
							label=" "
							:show-overflow-tooltip="true"
							:resizable="false"
							width="30"
							type="index"
							:index="indexMethod"> <!-- :show-overflow-tooltip="true" -->
						</el-table-column>
						<el-table-column
							prop="imsi"
							label="IMSI"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='32%'>
						</el-table-column>
						<el-table-column
							prop="mac"
							label="MAC"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='32%'>
						</el-table-column>
						<el-table-column
							prop="number"
							label="MAC出现次数"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='20%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="operation"
							label="操作"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='14%'>
						</el-table-column>
						<template slot="empty">
							<img src="../../../../static/nodata_icon.png" width="108" height="70">
							<p :style="{'marginTop': '23px'}">暂无数据</p>
						</template>
					</el-table>
					<el-pagination
						layout=" sizes, jumper, prev, pager, next, total"
						@current-change="current_change"
						:page-sizes="pageSizes"
						:page-size="pagesize"
						:total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'macCollision',
		data () {
			return {
				tip: {
					content: '此项为必输项',
					position: 'right'
				},
				starttime: new Date().getTime() - 86400000,
				endtime: new Date().getTime(),
				searchType: 1,
				imsi: null,
				selectTemplate: null,
				selectTemplateData: [
					{value: 1, text: ''}
				],
				searchTypeData: [
					{value: 1, text: 'IMSI'},
					{value: 2, text: 'MAC'}
				],
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: []
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			getsearchType () {
				if (this.searchType === 1) {
					return 'IMSI'
				} else {
					return 'MAC'
				}
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			},
			search () {
				var that = this
				that.tableData = []
				if (that.imsi === null || that.imsi === '') {
					that.$notify({
						title: '提示',
						message: 'IMSI不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					const loading = that.$loading({
						target: document.querySelector('.table-list'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
					this.axios.post(`${this.url}/collision/mac`, {
						imsi: this.imsi,
						starttime: this.starttime,
						endtime: this.endtime
					})
					.then(function (response) {
						console.log(response)
						loading.close()
						that.tableData = response.data.res
						that.total = that.tableData.length
					})
					.catch(function (error) {
						console.log(error)
					})
				}
			},
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			}
		}
	}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
		border: 0;
	}
	.mac-collision .card-content{
		height: 100%;
		width: 100%;
		padding: 1px 1px 3px 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.mac-collision .card-content-list{
		height: 100%;
		width: 100%;
		padding: 1px 1px 3px 1px;
	}
	.mac-collision .event-btn{
		text-align: center;
		margin: 15px 0;
	}
	.mac-collision .select-template{
		height: 45px;
		padding:  10px 0 10px 10px;
		margin-bottom: 10px;
		background: #F4F4F4;
	}
	.site{
		width: 300px;
		height: 32px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}
	.mac-collision .card-content table tr th{
		width: 100px;
		height: 34px;
		line-height: 34px;
		text-align: right;
	}
	.mac-collision .card-content table tr td{
		text-align: left;
		height: 34px;
		padding-left: 5px;
		line-height: 34px;
	}
	.mac-collision .card-content table tr td span{
		font-weight: bold;
	}
	.mac-collision .to {
		margin: 0 3px;
	}
	.mac-collision .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.mac-collision .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.mac-collision .add{
		border: 1px solid #ffa8a8;
	}
</style>
