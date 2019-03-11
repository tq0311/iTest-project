<template>
	<div class="mac-search">
		<div class="search-card">
			<div class="card-top">
				条件过滤
			</div>
			<div class="card-content">
				<table width="100%">
					<tr>
						<th>MAC地址：</th>
						<td><input type="text" name="" id="macaddr" v-model="macaddr" class="site"></td>
						<th>采集时间：</th>
						<td>
							<el-date-picker
								v-model="starttime"
								type="date"
								placeholder="选择日期时间"
								value-format="timestamp">
							</el-date-picker>
							<span class="to">至</span>
							<el-date-picker
								v-model="endtime"
								type="date"
								placeholder="选择日期时间"
								value-format="timestamp">
							</el-date-picker>
						</td>
					</tr>
					<tr>
						<th>卡口：</th>
						<td>
							<!-- <ComboTree
								inputId="swan1"
								:data="swanData"
								v-model="swan1"
								:multiple="true">
								<Tree slot="tree" @checkChange="checkChange"></Tree>
							</ComboTree> -->
							<el-select v-model="swan1" multiple placeholder=" " collapse-tags :multiple-limit="10">
								<el-option-group
									v-for="group in swanData"
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
						<th></th>
						<td></td>
					</tr>
				</table>
				<div class="event-btn">
						<el-button type="success" plain @click="searchInfo">查询</el-button>
						<el-button type="success" plain @click="reset">重置</el-button>
					</div>
			</div>
		</div>
		<div class="results-card">
			<div class="card-top">
				MAC地址列表
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
							type="index"
							width="30"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="macaddr"
							label="MAC地址"
							sortable
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='22%'>
						</el-table-column>
						<el-table-column
							prop="name"
							label="Name"
							sortable
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='32%'>
						</el-table-column>
						<el-table-column
							prop="id"
							label="AP ID"
							sortable
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='17%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="swan"
							label="卡口名称"
							sortable
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='23%'>
						</el-table-column>
						<el-table-column
							prop="timestamp"
							label="采集时间"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='23%'>
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
	export default{
		name: 'macSearch',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				macaddr: null,
				starttime: new Date().getTime() - 86400000,
				endtime: new Date().getTime(),
				swan1: [],
				swanData: [
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
				swan: []
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			searchInfo () {
				var that = this
				that.tableData = []
				if (that.macaddr === null || that.macaddr === '') {
					that.$notify({
						title: '提示',
						message: '抱歉，手机卡码（IMSI）不能为空!',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.macaddr.length !== 11) {
					that.$notify({
						title: '提示',
						message: '请输入有效的MAC地址',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.starttime === null) {
					that.$notify({
						title: '提示',
						message: '采集开始时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.endtime === null) {
					that.$notify({
						title: '提示',
						message: '采集结束时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					this.axios.post(`${this.url}/information/mac`, {
						macaddr: this.macaddr,
						starttime: this.starttime,
						endtime: this.endtime,
						swan: this.swan1.sort() ? this.swan1.sort() : []
					})
					.then(function (response) {
						const loading = that.$loading({
							target: document.querySelector('.table-list'),
							lock: true,
							text: '正在加载...',
							spinner: 'el-icon-loading',
							background: 'rgba(255, 255, 255, 0.5)'
						})
						setTimeout(() => {
							loading.close()
							that.tableData = response.data.res
							that.total = that.tableData.length
						}, 1000)
					})
					.catch(function (error) {
						console.log(error)
					})
				}
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			checkChange (nodes) {
				var list = []
				nodes.forEach((node, index) => {
					if (typeof node.value !== 'undefined') {
						list.push(node.value)
					}
				})
				this.swan = list
			}
		}
	}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 12px;
	}
	.mac-search .card-content{
		height: 100%;
		width: 100%;
		padding: 10px 1px 3px 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.mac-search .card-content-list{
		height: 100%;
		width: 100%;
		padding: 1px 1px 3px 1px;
	}
	.mac-search .event-btn{
		text-align: center;
		margin: 15px 0;
	}
	.site{
		width: 300px;
		height: 32px;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding-left: 5px;
	}
	.mac-search .card-content table tr th{
		white-space: nowrap;
		width: 7.1vw;
		height: 34px;
		line-height: 34px;
		text-align: right;
	}
	.mac-search .card-content table tr td{
		white-space: nowrap;
		text-align: left;
		height: 34px;
		width: 501px;
		padding-left: 5px;
		line-height: 34px;
	}
	.mac-search .card-content table tr td span{
		white-space: nowrap;
		font-weight: bold;
	}
	.mac-search .to {
		margin: 0 3px;
	}
	.mac-search .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.mac-search .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
</style>
