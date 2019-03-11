<template>
	<div class="regiona-collision">
		<div class="condition-card">
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
							<th>检索范围</th>
							<td>
								<div class="isinclude">
									<ComboBox inputId="isinclude" v-model="isinclude" :data="isIncludeData" :editable="false" placeholder="请选择"></ComboBox>
								</div>
								<div class="person-type">
									<ComboBox inputId="persontype" v-model="persontype" :data="personTypeData" :editable="false" placeholder="请选择"></ComboBox>
								</div>
							</td>
							<th>起始时间</th>
							<td>
								<div class="select-time">
									<el-date-picker
										v-model="starttime"
										type="date"
										value-format="timestamp"
										placeholder="选择日期时间">
									</el-date-picker>
									<el-date-picker
										class="end"
										v-model="endtime"
										type="date"
										value-format="timestamp"
										placeholder="选择日期时间">
									</el-date-picker>
								</div>
							</td>
						</tr>
						<tr>
							<th>卡口</th>
							<td class="addstyle">
								<el-select v-model="swan" multiple placeholder=" ">
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
							<th>最小出现卡口个数</th>
							<td>
								<ComboBox inputId="minnumber" v-model="minnumber" :data="minNumberData" :editable="false"></ComboBox>
							</td>
						</tr>
						<tr>
							<th>特定人员</th>
							<td>
								<ComboBox inputId="specialperson" v-model="specialperson" :data="specialPersonData" :editable="false"></ComboBox>
							</td>
							<th></th>
							<td></td>
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
		<div class="result-card">
			<div class="card-top">伴随分析结果</div>
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
						> <!-- empty-text="空数据" -->
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
							label="ISMI"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='14%'>
						</el-table-column>
						<el-table-column
							prop="is_specific"
							label="是否特定人员"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							align="center"
							min-width='10%'>
							<template slot-scope="scope">
								<span v-if="scope.row.is_specific === 'yes'">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="belong"
							label="归属地"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='14%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="swan"
							label="卡口A"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='10%'>
							<template slot-scope="scope">
								<span v-if="scope.row.swan === '1'">{{scope.row.swan}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="swan"
							label="卡口B"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='10%'>
							<template slot-scope="scope">
								<span v-if="scope.row.swan === '2'">{{scope.row.swan}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="swan"
							label="卡口C"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='10%'>
							<template slot-scope="scope">
								<span v-if="scope.row.swan === '3'">{{scope.row.swan}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="swan"
							label="卡口D"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='10%'>
							<template slot-scope="scope">
								<span v-if="scope.row.swan === '4'">{{scope.row.swan}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="swan"
							label="卡口E"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							min-width='10%'>
							<template slot-scope="scope">
								<span v-if="scope.row.swan === '5'">{{scope.row.swan}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="event"
							label="操作"
							:show-overflow-tooltip="true"
							:resizable="false"
							sortable
							align="center"
							min-width='10%'>
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
						layout="sizes, jumper, prev, pager, next, total"
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
		name: 'regionCollision',
		data () {
			return {
				tip: {
					content: '此项为必输项',
					position: 'right'
				},
				isinclude: 1,
				persontype: 1,
				minnumber: 2,
				starttime: new Date().getTime() - 157680000000,
				endtime: new Date().getTime(),
				swan: [],
				specialperson: 1,
				selectTemplate: null,
				isIncludeData: [
					{value: 1, text: '只包含'},
					{value: 2, text: '不包含'}
				],
				personTypeData: [
					{value: 1, text: '常驻人口'},
					{value: 2, text: '本地人口'},
					{value: 3, text: '流动人口'}
				],
				minNumberData: [
					{value: 1, text: '1'},
					{value: 2, text: '2'},
					{value: 3, text: '3'},
					{value: 4, text: '4'},
					{value: 5, text: '5'}
				],
				selectTemplateData: [
					{value: 1, text: ''}
				],
				specialPersonData: [
					{value: 1, text: '否'},
					{value: 2, text: '是'}
				],
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
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
				]
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			getisIncludeData () {
				if (this.isIncludeData === 1) {
					return '只包含'
				} else {
					return '不包含'
				}
			},
			getspecialPersonData () {
				if (this.specialperson === 1) {
					return 'no'
				} else {
					return 'yes'
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
				if (that.swan.length === 0) {
					that.$notify({
						title: '提示',
						message: '抱歉，请选择卡口！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.starttime === null) {
					that.$notify({
						title: '提示',
						message: '抱歉，开始时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.endtime === null) {
					that.$notify({
						title: '提示',
						message: '抱歉，结束时间不能为空！',
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
					this.axios.post(`${this.url}/collision/area`, {
						isinclude: '' /* this.isinclude */,
						starttime: this.starttime,
						endtime: this.endtime,
						swanList: this.swan.sort(),
						ptype: this.persontype,
						t: this.minnumber,
						is_specific: this.getspecialPersonData()
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
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			}
		}
	}
</script>

<style>
	*{
		font-size: 12px;
	}
	.regiona-collision .card-content{
		height: 100%;
		width: 100%;
		padding: 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.select-template{
		height: 45px;
		padding:  10px 0 10px 10px;
		margin-bottom: 10px;
		background: #F4F4F4;
	}
	.regiona-collision .condition-card table tr th{
		text-align: right;
	}
	.regiona-collision .condition-card table tr td{
		padding: 6px 0;
		text-align: left;
	}
	.IMSI{
		border: 1px solid #b6b4b6;
		border-radius: 3px;
	}
	.event-btn{
		text-align: center;
		margin-bottom: 15px;
	}
	.regiona-collision .select-time{
		margin-left: 10px;
	}
	.regiona-collision .export{
	height: 31px;
	padding-left: 5px;
	border-bottom: 1px solid #ddd;
	background-color: #f4f4f4;
	}
	.regiona-collision .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.regiona-collision .isinclude{
		float: left;
	}
	.regiona-collision .person-type{
		float: left;
	}
	.regiona-collision .end{
		margin-left: 5px;
	}
	.regiona-collision .add{
		border: 1px solid #ffa8a8;
	}
	.regiona-collisioin table a{
		color: green;
		text-decoration: none;
	}
</style>
