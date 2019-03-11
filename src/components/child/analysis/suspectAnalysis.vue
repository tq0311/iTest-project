<template>
	<div class="suspect-analysis">
		<div class="conditions">
			<div class="card-top">条件</div>
			<div class="card-content">
				<table style="width: 100%;">
					<tr>
						<th>案发时间：</th>
						<td>
							<el-date-picker
								v-model="crimeTime"
								type="date"
								placeholder="选择日期时间"
								value-format="timestamp"
								v-Tooltip="tip"
								clearable>
							</el-date-picker>
						</td>
						<th>案发地点（卡口）：</th>
						<td>
							<el-select v-model="scene1" placeholder=" ">
								<el-option-group
									v-for="group in sceneData"
									:key="group.label"
									:label="group.label">
									<el-option
										v-for="item in group.swans"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
								</el-option-group>
							</el-select>
						</td>
						<th>筛选地点：</th>
						<td>
							<el-select v-model="screeningPlace" multiple placeholder=" " :collapse-tags="true">
								<el-option-group
									v-for="group in screeningPlaceData"
									:key="group.label"
									:label="group.label">
									<el-option
										v-for="item in group.swans"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
								</el-option-group>
							</el-select>
						</td>
					</tr>
					<tr>
						<th>筛查案发前（天）：</th>
						<td>
							<NumberBox inputId="before" v-model="before" :min="1" :value="3" :spinners="true"></NumberBox>
						</td>
						<th>筛查案发后（天）：</th>
						<td>
							<NumberBox inputId="after" v-model="after" :min="1" :value="7" :spinners="true"></NumberBox>
						</td>
						<td colspan="2">
							<el-button type="success" id="search" plain @click="search">查询</el-button>
							<el-button type="success" id="reset" plain @click="reset">重置</el-button>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="suspect-screening">
			<div class="card-top">嫌疑人筛选</div>
			<div class="content">
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
							width="30"
							type="index"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="imsi"
							label="ISMI"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							sortable
							min-width='17%'>
						</el-table-column>
						<el-table-column
							prop="befortimes"
							label="案发前统计次数"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							sortable
							min-width='26%'>
						</el-table-column>
						<el-table-column
							prop="aftertimes"
							label="案发后统计次数"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							sortable
							min-width='26%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="event"
							label="操作"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='26%'>
							<template slot-scope="scope">
								<a href="#">查看</a>
							</template>
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
						@size-change="handleChangeSize"
						:total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'suspectAnalysis',
		data () {
			return {
				tip: {
					content: '此项为必输项',
					position: 'right'
				},
				crimeTime: new Date('2014-04-28').getTime(),
				scene: null,
				scene1: null,
				screeningPlace: [],
				before: 1,
				after: 1,
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				sceneData: [
					{
						label: '测试区域',
						swans: [
							{
								value: '1',
								label: 'iTest卡口'
							},
							{
								value: '2',
								label: 'testGate'
							}
						]
					}
				],
				screeningPlaceData: [
					{
						label: '测试区域',
						swans: [
							{
								value: '1',
								label: 'iTest卡口'
							},
							{
								value: '2',
								label: 'testGate'
							}
						]
					}
				]
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			selectionChange (node) {
				this.scene = node.value
			},
			search () {
				var that = this
				that.tableData = []
				if (that.crimeTime === null) {
					that.$notify({
						title: '提示',
						message: '案发时间不能为空',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.scene1 === null) {
					that.$notify({
						title: '提示',
						message: '案发地点(卡口)不能为空',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.screeningPlace.length === 0) {
					that.$notify({
						title: '提示',
						message: '筛选地点不能为空',
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
					this.axios.post(`${this.url}/analysis/suspect`, {
						tCur: this.crimeTime ? this.crimeTime : '',
						nbaddr: this.scene1 ? this.scene1 : '',
						nbaddrList: this.screeningPlace ? this.screeningPlace : [],
						tBefore: this.before ? this.before : '',
						tAfter: this.after ? this.after : ''
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
		}
	}
</script>

<style>
.suspect-analysis .conditions table{
	margin-top: 10px;
	margin-bottom: 20px;
}
.suspect-analysis .conditions table tr td, table tr th{
	height: 34px;
}
.suspect-analysis .conditions table tr th{
	text-align: right;
}
.suspect-analysis .select-time{
	margin-left: 10px;
}
.suspect-analysis .export{
	height: 31px;
	padding-left: 5px;
	border-bottom: 1px solid #ddd;
	background-color: #f4f4f4;
}
.suspect-analysis .icon{
	padding-left: 2px;
	float: left;
	width: 78px;
	height: 26px;
	margin-top: 2px;
}
.suspect-analysis .add{
	border: 1px solid #ffa8a8;
}
.suspect-analysis table a{
	color: green;
	text-decoration: none;
}
</style>
