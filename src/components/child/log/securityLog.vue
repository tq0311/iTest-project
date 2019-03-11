<template>
	<div class="security-log">
		<div class="search-condition">
			<div class="card-top">搜索条件</div>
			<div class="content">
				<table>
					<tr>
						<th>操作人</th>
						<td>
							<ComboBox
								inputId="operationOf"
								v-model="operationOf"
								:data="operationOfData"
								:editable="false">
							</ComboBox>
						</td>
						<th>起始时间</th>
						<td>
							<el-date-picker
								v-model="starttime"
								type="date"
								value-format="timestamp"
								placeholder="选择日期时间">
							</el-date-picker>
							<span>至</span>
							<el-date-picker
								v-model="endtime"
								type="date"
								value-format="timestamp"
								placeholder="选择日期时间">
							</el-date-picker>
						</td>
					</tr>
				</table>
				<div class="event-btn">
					<el-button type="success" id="search" plain @click="securitySearch">查询</el-button>
					<el-button type="success" id="reset" plain @click="reset">重置</el-button>
				</div>
			</div>
		</div>
		<div class="log-card">
			<div class="card-top">操作日志列表</div>
			<div class="log-content">
				<div class="export">
					<div class="icon">
						<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
					</div>
				</div>
				<el-table
					:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
					v-loading=""
					border
					class="tab"
					highlight-current-row
					@current-change="handleCurrentChange"
					@row-click="clickRow"
					:row-class-name="tableRowClassName"
					>
					<el-table-column
						label=" "
						type="index"
						width="35"
						:show-overflow-tooltip="true"
						:index="indexMethod">
					</el-table-column>
					<el-table-column
						prop="content"
						label="内容"
						align="left"
						:show-overflow-tooltip="true"
						min-width='53%'>
					</el-table-column>
					<el-table-column
						prop="operation"
						align="center"
						:show-overflow-tooltip="true"
						label="操作人"
						min-width='13%'>
					</el-table-column>
					<el-table-column
						prop="IP"
						align="left"
						:show-overflow-tooltip="true"
						label="操作人IP"
						min-width='13%'> <!-- :formatter="formatter" -->
					</el-table-column>
					<el-table-column
						prop="time"
						label="操作时间"
						:show-overflow-tooltip="true"
						align="center"
						min-width='20%'>
					</el-table-column>
					<template slot="empty">
						<img src="../../../../static/nodata_icon.png" width="108" height="70">
						<p :style="{'marginTop': '23px'}">暂无数据</p>
					</template>
				</el-table>
				<el-pagination
					layout=" sizes, jumper, prev, pager, next, total"
					@current-change="current_change"
					@size-change="handleChangeSize"
					:page-sizes="pageSizes"
					:page-size="pagesize"
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'securityLog',
		data () {
			return {
				operationOf: null,
				operationOfData: [
					{value: '1', text: ''}
				],
				starttime: null,
				endtime: null,
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
			sevenDay () {
				var now = new Date()
				now.setDate(now.getDate() - 7)
				return now
			},
			handleCurrentChange(val) {
				this.currentRow = val
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			tableRowClassName ({row, rowIndex}) {
				// 把每一行的索引放进row
				row.index = rowIndex
			},
			clickRow (row) {
				this.num = row.index + (this.currentPage - 1) * this.pagesize
			},
			securitySearch () {
				if (this.starttime === null) {
					this.$notify({
						title: '提示',
						message: `请选择开始时间！`,
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.endtime === null) {
					this.$notify({
						title: '提示',
						message: `请选择结束时间！`,
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					var that = this
					const loading = that.$loading({
						target: document.querySelector('.log-content'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.6)'
					})
					this.axios.post(`${this.url}/log/safety`, {
						starttime: this.starttime,
						endtime: this.endtime
					})
					.then(function (response) {
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
		},
		update () {
			this.total = this.tableData.length
		},
		created () {
			this.startTime = this.sevenDay()
			this.endTime = new Date()
			var _self = this
			document.onkeydown = function (e) {
				var key = null
				if (window.event === undefined) {
					key = e.keyCode
				} else {
					key = window.event.keyCode
				}
				if (key === 13) {
					_self.securitySearch()
				}
			}
			/* this.tableData = [
				{
					content: 'Rose',
					operation: '李雷',
					IP: '192.168.1.111',
					time: '2018-12-28 17:20:00'
				},
				{
					content: 'Jack',
					operation: '李雷',
					IP: '192.168.1.111',
					time: '2018-12-28 17:22:00'
				},
				{
					content: 'Rose',
					operation: '李雷',
					IP: '192.168.1.111',
					time: '2018-12-28 17:20:00'
				},
				{
					content: 'Jack',
					operation: '李雷',
					IP: '192.168.1.111',
					time: '2018-12-28 17:22:00'
				},
				{
					content: 'Rose',
					operation: '李雷',
					IP: '192.168.1.111',
					time: '2018-12-28 17:20:00'
				},
				{
					content: 'Jack',
					operation: '李雷',
					IP: '192.168.1.111',
					time: '2018-12-28 17:22:00'
				}
			] */
		}
	}
</script>
<style>
	.security-log .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.security-log .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.security-log .search-condition table{
		width: 100%;
		margin-top: 15px;
	}
	.security-log .search-condition table tr td{
		height: 34px;
		padding: 1px 0;
	}
	.security-log .event-btn{
		width: 100%;
		height: 100%;
		text-align: center;
		margin: 20px 0;
	}
	.security-log .search-condition table span{
		font-weight: bold;
	}
	.security-log table a{
		text-decoration: none;
		color: green;
	}
</style>
