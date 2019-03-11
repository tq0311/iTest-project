<template>
	<div class="time-space">
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
							<th>特定人员</th>
							<td>
								<div class="person">
									<ComboBox inputId="specialperson" v-model="specialperson" :data="specificPersonData" :editable="false"></ComboBox>
								</div>
							</td>
							<th>检索范围</th>
							<td>
								<div class="isinclude">
									<ComboBox inputId="isinclude" v-model="isinclude" :data="isIncludeData" :editable="false"></ComboBox>
								</div>
								<div class="person-type">
									<ComboBox inputId="persontype" v-model="persontype" :data="personTypeData" :editable="false"></ComboBox>
								</div>
							</td>
							<th>最少满足条件个数</th>
							<td>
								<div class="min">
									<ComboBox inputId="minnumber" v-model="minnumber" :data="minNumberData" :editable="false"></ComboBox>
								</div>
							</td>
							<td></td>
						</tr>
						<tr v-for="(conditoin, index) in conditionData" :key="index">
							<th>条件{{index+1}}：起始时间</th>
							<td>
								<div class="select-time">
									<el-date-picker
										v-model="conditionData[index].starttime"
										type="date"
										value-format="timestamp"
										placeholder="选择日期时间">
									</el-date-picker>
									至
									<el-date-picker
										v-model="conditionData[index].endtime"
										type="date"
										value-format="timestamp"
										placeholder="选择日期时间">
									</el-date-picker>
								</div>
							</td>
							<th>卡口</th>
							<td class="style">
								<el-select v-model="conditionData[index].swanList" multiple placeholder=" " :collapse-tags="true">
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
								<div class="min">
									<ComboBox inputId="minnumber" v-model="conditoin.t" :data="minNumberData" :editable="false"></ComboBox>
								</div>
							</td>
							<td>
								<LinkButton v-if="index == 1" iconCls="icon-add" @click="insert">&nbsp;</LinkButton>
								<LinkButton v-if="index == conditionData.length-1 && index != 1" iconCls="icon-remove" @click="remove(index)">&nbsp;</LinkButton>
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
		<div class="result-card">
			<div class="card-top">时空碰撞结果</div>
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
							:show-overflow-tooltip="true"
							:resizable="false"
							type="index"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="imsi"
							label="ISMI"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='11%'>
						</el-table-column>
						<el-table-column
							prop="is_specific"
							label="是否特定人员"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='11%'>
							<template slot-scope="scope">
								<span v-if="scope.row.is_specific === 'yes'">是</span>
								<span v-if="scope.row.is_specific === 'no'">否</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="belong"
							label="归属地"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='6%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件1"
							align="center"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('1', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 0 && typeof findSwan('1', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件2"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('2', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 1 && typeof findSwan('2', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件3"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('3', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 2 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件4"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('4', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 3 && typeof findSwan('4', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件5"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('5', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 4 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件6"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('6', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 5 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件7"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('7', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 6 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件8"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('8', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 7 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件9"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('9', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="conditionData.length > 8 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							label="条件10"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<span v-if="findSwan('10', scope.row.exist_condition)">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<!-- <span v-if="conditionData.length > 9 && scope.row.condition !== '10'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span> -->
							</template>
						</el-table-column>
						<el-table-column
							prop="operation"
							label="操作"
							:show-overflow-tooltip="true"
							:resizable="false"
							align="center"
							min-width='6%'>
							<template slot-scope="scope">
								<a href="#">查看</a>
							</template>
						</el-table-column>
						<template slot="empty">
							<img src="../../../../static/nodata_icon.png" width="108" height="70">
							<p :style="{'marginTop': '23px'}">抱歉，暂无数据</p>
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
		name: 'timeSpace',
		data () {
			return {
				tip: {
					content: '此项为必输项',
					position: 'right'
				},
				conditionData: [
					{
						starttime: new Date().getTime() - 157680000000,
						endtime: new Date().getTime(),
						swanList: [],
						t: 1,
						condition: '1'
					},
					{
						starttime: new Date().getTime() - 157680000000,
						endtime: new Date().getTime(),
						swanList: [],
						t: 1,
						condition: '2'
					}
				],
				isNull: [],
				isTimeNull: true,
				isinclude: null,
				persontype: 1,
				minnumber: 3,
				specialperson: 1,
				selectTemplate: null,
				isIncludeData: [
					{value: 1, text: '不包含'},
					{value: 2, text: '只包含'}
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
					{value: 5, text: '5'},
					{value: 6, text: '6'},
					{value: 7, text: '7'},
					{value: 8, text: '8'},
					{value: 9, text: '9'},
					{value: 10, text: '10'}
				],
				selectTemplateData: [
					{value: 1, text: ''}
				],
				specificPersonData: [
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
			findSwan (num, arr) {
				var s = arr.find(function (n) {
					if (n === num) {
						return true
					} else {
						return false
					}
				})
				return s
			},
			getisinclude () {
				if (this.isinclude === 1) {
					return '只包含'
				} else {
					return '不包含'
				}
			},
			getspecialperson () {
				if (this.specialperson === 1) {
					return 'no'
				} else {
					return 'yes'
				}
			},
			getisIncludeData () {
				if (this.isIncludeData === 1) {
					return '不包含'
				} else {
					return '不包含'
				}
			},
			checkChange (nodes) {
				let list = []
				nodes.forEach((node, index) => {
					if (typeof node.value !== 'undefined') {
						list.push(node.value)
					}
				})
				return list
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
			insert: function (num) {
				let len = this.conditionData.length
				if (len < 10) {
					this.conditionData.push({
						starttime: new Date().getTime() - 157680000000,
						endtime: new Date().getTime(),
						swanList: [],
						t: 1,
						condition: String(len + 1)
					})
				}
			},
			remove: function (index) {
				this.conditionData.splice(index, 1)
			},
			search () {
				this.isNull = []
				this.isTimeNull = true
				this.conditionData.forEach((item, index) => {
					if (item.swanList.length === 0) {
						this.isNull.push(index + 1)
					} else if (item.starttime === null || item.endtime === null) {
						this.isTimeNull = false
					}
				})
				if (this.isTimeNull === false) {
					this.$notify({
						title: '提示',
						message: '请选择时间',
						position: 'bottom-right',
						showClose: true,
						duration: 2000
					})
				} else if (this.isNull.length !== 0) {
					this.$notify({
						title: '提示',
						message: '请选择卡口' + this.isNull[0],
						position: 'bottom-right',
						showClose: true,
						duration: 2000
					})
				} else {
					var that = this
					that.tableData = []
					const loading = that.$loading({
						target: document.querySelector('.table-list'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
					this.axios.post(`${this.url}/collision/spacetime`, {
						isinclude: '', // this.getisinclude()
						ptype: this.persontype ? this.persontype : '',
						is_specific: this.getspecialperson(),
						conditions: this.conditionData,
						times: this.minnumber ? this.minnumber : ''
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
	*{
		font-size: 12px;
	}
	.time-space .card-content{
		height: 100%;
		width: 100%;
		height: 315px;
		overflow-y: scroll;
		overflow-x: hidden;
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
	.time-space .condition-card table tr th{
		text-align: right;
	}
	.time-space .condition-card table tr td{
		padding: 2px 0;
		text-align: left;
	}
	.time-space .condition-card table tr td:nth-child(8){
		text-align: left;
	}
	.IMSI{
		border: 1px solid #b6b4b6;
		border-radius: 3px;
	}
	.event-btn{
		text-align: center;
		margin-top: 15px;
		margin-bottom: 15px;
	}
	.time-space .select-time{
		margin-left: 10px;
	}
	.time-space .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.time-space .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.time-space .isinclude{
		float: left;
	}
	.time-space .person-type{
		float: left;
	}
	.time-space .add{
		border: 1px solid #ffa8a8;
	}
	.time-space table a{
		color: green;
		text-decoration: none;
	}
</style>
