<template>
	<div class="active-alarm">
		<div class="search-card">
			<div class="card-top">
				搜索条件
			</div>
			<div class="card-content">
				<table>
					<tr>
						<th>告警起始时间</th>
						<td>
							<el-date-picker
								v-model="starttime"
								type="date"
								value-format="timestamp"
								placeholder="选择日期">
							</el-date-picker>
							<span class="to">-</span>
							<el-date-picker
								v-model="endtime"
								type="date"
								value-format="timestamp"
								placeholder="选择日期">
							</el-date-picker>
						</td>
						<td>
							<el-button type="success" plain @click="activeSearch">查询</el-button>
							<el-button type="success" plain @click="reset">重置</el-button>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="result-card">
			<div class="card-top">活跃告警</div>
			<div class="content">
				<div class="table-list">
					<el-table
						:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
						border
						class="tab"
						highlight-current-row
						@current-change="handleCurrentChange"
						@sort-change="sortChange"
						>
						<el-table-column
							label=" "
							:resizable="false"
							:show-overflow-tooltip="true"
							width="30"
							type="index"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="swan"
							label="上报卡口/上报基站"
							:resizable="false"
							:show-overflow-tooltip="true"
							sortable
							align="left"
							min-width='15%'>
						</el-table-column>
						<el-table-column
							prop="number"
							sortable
							align="left"
							label="告警编号"
							:resizable="false"
							:show-overflow-tooltip="true"
							min-width='11%'>
						</el-table-column>
						<el-table-column
							prop="type"
							align="left"
							sortable
							label="告警类型"
							:resizable="false"
							:show-overflow-tooltip="true"
							min-width='11%'> <!-- :formatter="formatter" -->
							<template slot-scope="scope">
								<span v-if="scope.row.type === 'transfer'">转移告警</span>
								<span v-if="scope.row.type === 'powerdown'">掉电告警</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="timestamp"
							label="告警时间"
							:resizable="false"
							:show-overflow-tooltip="true"
							align="left"
							sortable
							min-width='16%'>
						</el-table-column>
						<el-table-column
							prop="reason"
							label="告警原因"
							:resizable="false"
							:show-overflow-tooltip="true"
							align="left"
							sortable
							min-width='22%'>
							<template slot-scope="scope">
								<span v-if="scope.row.reason === 'transfer'">转移告警</span>
								<span v-if="scope.row.reason === 'power down'">掉电告警</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="level"
							label="告警级别"
							:resizable="false"
							:show-overflow-tooltip="true"
							align="left"
							sortable
							min-width='11%'>
						</el-table-column>
						<el-table-column
							prop="id"
							label="操作"
							:resizable="false"
							:show-overflow-tooltip="true"
							align="center"
							min-width='10%'>
						</el-table-column>
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
	</div>
</template>

<script>
	export default {
		name: 'activeAlarm',
		data () {
			return {
				starttime: '',
				endtime: '',
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
			sortChange () {
				const loading = this.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				loading.close()
			},
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			activeSearch () {
				if (this.starttime === '' || this.starttime === null) {
					this.$notify({
						title: '提示',
						message: '开始时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.endtime === '' || this.endtime === null) {
					this.$notify({
						title: '提示',
						message: '结束时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					var that = this
					that.tableData = []
					const loading = that.$loading({
						target: document.querySelector('.table-list'),
						lock: true,
						text: '正在加载...',
						duration: 1000,
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.6)'
					})
					this.axios.post(`${this.url}/alarm/active`, {
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
			getDateTime (time) {
				var d = new Date(time)
				var year = d.getFullYear()
				var month = d.getMonth() + 1
				var day = d.getDate()
				month = this.checkTime(month)
				day = this.checkTime(day)
				return year + '-' + month + '-' + day
			},
			checkTime (i) {
				if (i < 10) {
					i = '0' + i
				}
				return i
			}
		},
		updated () {
			this.tableData.forEach((val) => {
				val.timestamp = this.getDateTime(val.timestamp)
			})
			this.total = this.tableData.length
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
					_self.activeSearch()
				}
			}
		}
	}
</script>

<style>
	.active-alarm .card-content{
		height: 100%;
		width: 100%;
		padding:1px;
		height: 66px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.active-alarm .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.active-alarm .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.active-alarm .card-content table tr th{
		width: 220px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.active-alarm .card-content table tr td{
		width: 40%;
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
</style>
