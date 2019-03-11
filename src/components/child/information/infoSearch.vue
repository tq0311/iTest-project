<template>
	<div class="info-search">
		<div class="search-card">
			<div class="card-top">
				查询条件
			</div>
			<div class="card-content">
				<div class="select-template">
					<ComboBox inputId="selectTemplate" v-model="selectTemplate" :data="selectTemplateData" :editable="false" placeholder="选择模板"></ComboBox>
				</div>
				<form id="queryForm">
					<table width="100%" cellpadding="0" cellspacing="0" border="0">
						<tr>
							<th>手机卡码(IMSI)</th>
							<td>
								<el-input v-model="imsi" ></el-input>
							</td>
							<th>电话号码</th>
							<td><el-input v-model="phone"></el-input></td>
						</tr>
						<tr>
							<th>采集地点</th>
							<td>
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
							<th>手机归属地</th>
							<td class="phone-place">
								<div class="include">
									<ComboBox inputId="whether" v-model="whether" :data="whetherData" :editable="false" ></ComboBox>
								</div>
								<div class="phone">
									<ComboTree inputId="belong" :data="belongData">
										<Tree slot="tree" @selectionChange="selectionChange"></Tree>
									</ComboTree>
								</div>
							</td>
						</tr>
						<tr>
							<th>采集开始时间</th>
							<td>
								<span class="infosearch">
									<el-date-picker
										v-model="starttime"
										type="date"
										value-format="timestamp"
										placeholder="请输入开始时间"
										>
									</el-date-picker>
								</span>
							</td>
							<th>采集结束时间</th>
							<td>
								<span class="infosearch">
									<el-date-picker
										v-model="endtime"
										type="date"
										value-format="timestamp"
										placeholder="请输入结束时间"
										>
									</el-date-picker>
								</span>
							</td>
						</tr>
						<tr>
							<th>运营商类型</th>
							<td>
								<ComboBox
									:editable="false"
									inputId="operatortype"
									v-model="operatortype"
									:data="operatorTypeData"
									:multiple="true"
									:textFormatter="formatText"
									>
								</ComboBox>
							</td>
							<th>人员筛选</th>
							<td>
								<ComboBox
									inputId="persontype"
									v-model="persontype"
									:data="personSelectData"
									:editable="false"
									>
								</ComboBox>
							</td>
						</tr>
						<tr>
							<th>特定人员类型</th>
							<td>
								<ComboBox
									inputId="particular"
									v-model="particular"
									:data="particularData"
									:editable="false"
									>
								</ComboBox>
							</td>
							<th></th>
							<td>
							</td>
						</tr>
					</table>
					<div class="event-btn">
						<el-button type="success" id="search" plain @click="addTabInfo('infoSearchResult', '综合信息查询结果')">查询</el-button>
						<el-button type="success" id="reset" plain @click="reset">重置</el-button>
						<el-button type="success" id="save" plain>保存为模板</el-button>
					</div>
				</form>
			</div>
		</div>
		<div class="state">
			<div class="state-top">
				<span>功能说明</span>
			</div>
			<div class="state-content">
				<blockquote>
					<p>&nbsp;</p>
					<p>按照IMSI、电话号码、时间、采集地点组合查询，获得机主信息的相关信息。</p>
					<h3>参数含义：</h3>
					<p><b>手机卡码（IMSI）：</b>国际移动用户识别码，国际上为唯一识别一个移动用户所分配的号码，储存在SIM卡中，可以为空，不超过15个数字，支持多个IMSI查询（最多5个），每个IMSI中间以逗号间隔。</p>
					<p><b>电话号码：</b>可以为空，不超过15个数字。</p>
					<p><b>归属地：</b>有效的电话所在地市名称，可以为空，用户根据需要，选择归属地名称。</p>
					<p><b>采集地点：</b>支持多选（最多可以选择10个采集地点），可以为空。</p>
					<p><b>采集起始时间：</b>不能为空，合法时间格式。</p>
					<p><b>运用商类型：</b>主要包含中国移动、中国联通、中国电信及国际用户。</p>
				</blockquote>
			</div>
		</div>
	</div>
</template>
<script>
	import '@/assets/js/jquery.easyui.min.js'
	import '@/assets/js/jquery-1.4.4.min.js'
	export default{
		name: 'infoSearch',
		data () {
			return {
				selection: [],
				imsi: '',
				phone: '',
				whether: 1,
				operatortype: [],
				belong: null,
				swan: [],
				starttime: new Date().getTime() - 157680000000,
				endtime: new Date().getTime(),
				persontype: 1,
				particular: '',
				operator: [],
				selectTemplate: null,
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
				belongData: [
					{
						id: 1,
						text: '全部',
						children: [
							{
								id: 11,
								text: '北京',
								state: 'closed',
								children: [
									{
										id: 111,
										text: 'Friend'
									},
									{
										id: 112,
										text: 'Wife'
									},
									{
										id: 113,
										text: 'Company'
									}
								]
							},
							{
								id: 12,
								text: '广东',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							},
							{
								id: 13,
								text: '上海',
								state: 'closed',
								children: [
									{
										id: 131,
										text: 'Intel'
									},
									{
										id: 132,
										text: 'Java'
									},
									{
										id: 133,
										text: 'Microsoft Office'
									},
									{
										id: 134,
										text: 'Games'
									}
								]
							},
							{
								id: 14,
								text: '天津',
								state: 'closed',
								children: [
									{
										id: 141,
										text: 'Intel'
									},
									{
										id: 142,
										text: 'Java'
									},
									{
										id: 143,
										text: 'Microsoft Office'
									},
									{
										id: 144,
										text: 'Games'
									}
								]
							},
							{
								id: 15,
								text: '重庆',
								state: 'closed',
								children: [
									{
										id: 151,
										text: 'Intel'
									},
									{
										id: 152,
										text: 'Java'
									},
									{
										id: 153,
										text: 'Microsoft Office'
									},
									{
										id: 154,
										text: 'Games'
									}
								]
							},
							{
								id: 16,
								text: '辽宁',
								state: 'closed',
								children: [
									{
										id: 161,
										text: 'Intel'
									},
									{
										id: 162,
										text: 'Java'
									},
									{
										id: 163,
										text: 'Microsoft Office'
									},
									{
										id: 164,
										text: 'Games'
									}
								]
							},
							{
								id: 17,
								text: '江苏',
								state: 'closed',
								children: [
									{
										id: 171,
										text: 'Intel'
									},
									{
										id: 172,
										text: 'Java'
									},
									{
										id: 173,
										text: 'Microsoft Office'
									},
									{
										id: 174,
										text: 'Games'
									}
								]
							}
						]
					}
				],
				whetherData: [
					{value: 1, text: '包含'},
					{value: 2, text: '不包含'}
				],
				operatorTypeData: [
					{value: 1, text: '中国移动'},
					{value: 2, text: '中国联通'},
					{value: 3, text: '中国电信'},
					{value: 4, text: '国际用户'}
				],
				personSelectData: [
					{value: 1, text: '全部'},
					{value: 2, text: '特定人员'},
					{value: 3, text: '非特定人员'}
				],
				particularData: [
					{value: 1, text: '是'},
					{value: 2, text: '否'}
				],
				selectTemplateData: [
					{value: 1, text: ''}
				]
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			},
			isSearch () {
				return this.$store.state.isSearch
			}
		},
		methods: {
			handleNodeClick(data) {
			},
			getwhetherData () {
				if (this.whether === 1) {
					return '包含'
				} else if (this.whether === 2) {
					return '不包含'
				}
			},
			getparticularData () {
				if (this.particular === 1) {
					return 'yes'
				} else if (this.particular === 2) {
					return 'no'
				} else {
					return ''
				}
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			},
			// 获取imsi并拆分
			isImsi (imsi) {
				if (imsi) {
					var list = imsi.replace(/，/ig, ',')
					var imsiList = list.split(',')
					return imsiList
				} else {
					return []
				}
			},
			addTabInfo (targetName, title) {
				var len = this.isImsi(this.imsi).length
				if (len > 5) {
					this.$notify({
						title: '提示',
						message: `当前输入IMSI为${len},最多支持5条查询`,
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.phone !== null && this.phone !== '' && this.phone.length > 15) {
					this.$notify({
						title: '提示',
						message: '请输入有效的电话号码',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.starttime === null) {
					this.$notify({
						title: '提示',
						message: '采集开始时间不能为空',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.endtime === null) {
					this.$notify({
						title: '提示',
						message: `采集结束时间不能为空`,
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					var that = this
					that.$store.commit('changeisSearch', true)
					this.axios.post(`${this.url}/information/comprehensive`, {
						imsi: this.isImsi(this.imsi)[0] ? this.isImsi(this.imsi)[0] : '',
						swan: this.swan ? this.swan.sort() : [],
						operator: this.operatortype[0] ? String(this.operatortype[0]) : '', // 多选 数组 // this.operator
						particular: this.getparticularData() ? this.getparticularData() : '', // 'yes' 'no'
						phone: this.phone ? this.phone : '',
						starttime: this.starttime,
						belong: '', // this.postData.belong
						endtime: this.endtime,
						persontype: '' // this.postData.persontype
					})
					.then(function (response) {
						var list = {
							tableData: response.data.res
						}
						that.$store.commit('changeData', list)
						that.$store.commit('changeisSearch', false)
					})
					.catch(function (error) {
						console.log(error)
					})
					var obj = {
						comp: targetName,
						title: title,
						phone: that.phone,
						imsi: that.imsi,
						starttime: that.starttime,
						endtime: that.endtime,
						belong: that.belong, // 归属地 中文地名
						swan: that.swan, // 卡口 数组
						persontype: that.persontype, // 人员筛选 数字
						particular: that.getparticularData(), // 特定人员类型 'yes' 'no'
						whether: that.whether,
						operator: that.operatortype, // 运营商 多选 数组
						isSearch: that.isSearch
					}
					this.$emit('addTabInfo', obj)
				}
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			selectionChange (event) {
				this.belong = event.text
			},
			destroy () {
				this.$destroy()
			}
		},
		updated () {
			this.isImsi(this.imsi)
		}
	}
</script>

<style>
	*{
		font-size: 12px;
	}
	.infosearch{
		width: 285px;
	}
	.info-search .card-content{
		height: 100%;
		width: 100%;
		padding: 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.select-template{
		height: 6vh;
		padding:  10px 0 10px 10px;
		margin-bottom: 10px;
		background: #F4F4F4;
	}
	.info-search table tr th{
		white-space: nowrap;
		text-align: right;
	}
	.info-search table tr td{
		padding: 1vh 0;
		white-space: nowrap;
		text-align: left;
	}
	.IMSI{
		border: 1px solid #b6b4b6;
		border-radius: 3px;
	}
/*	.info-search input{
		width: 285px;
		height: 32px;
		padding-left: 5px;
		border: 1px solid #b6b4b6;
		border-radius: 5px;
		margin-left: 10px;
	}*/
	.include{
		width: 80px;
		height: 32px;
		float: left;
	}
	.phone{
		height: 32px;
		float: left;
	}
	.event-btn{
		text-align: center;
		margin-top: 15px;
		margin-bottom: 20px;
	}
	.state{
		margin-top: 15px;
	}
	.state-top{
		width: 100%;
		padding: 4px 0;
		height: 25px;
		border-bottom: 1px solid #b6b4b6;
	}
	.state-top span{
		font-size: 14px;
		width: 70px;
		border-bottom: 2px solid #00b327;
		display: block;
	}
	.state-content h3{
		font-size: 14px;
		font-weight: bold;
		line-height: 35px;
	}
	.state p{
		line-height: 30px;
	}
	.state b{
		font-size: 12px;
	}
</style>
