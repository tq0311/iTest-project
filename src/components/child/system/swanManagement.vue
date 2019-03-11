<template>
	<div class="swan-management">
		<div class="card-top">卡口信息</div>
		<div class="card-content">
			<div class="export">
				<div class="icon">
					<LinkButton iconCls="icon-reload" :plain="true" @click="onPageChange">刷新</LinkButton>
				</div>
			</div>
			<TreeGrid
				:data="data" idField="id"
				:lazy="true"
				:loading="loading"
				:loadMsg="loadMsg"
				treeField="name">
				<GridColumn align="center" cellCss="datagrid-td-checkbox">
					<template slot="body" slot-scope="scope">
						<input id="isSelect" type="checkbox" name="isSelect">
					</template>
				</GridColumn>
				<GridColumn field="swanId" align="center" title="卡口ID"></GridColumn>
				<GridColumn field="name" title="卡口名称/站点名称"></GridColumn>
				<GridColumn field="area" title="卡口区域"></GridColumn>
				<GridColumn field="longitude" title="经度"></GridColumn>
				<GridColumn field="latitude" title="纬度"></GridColumn>
				<GridColumn field="descript" title="卡口描述"></GridColumn>
				<GridColumn field="baseId" align="center" title="基站ID"></GridColumn>
				<GridColumn field="IP" align="center" title="设备IP"></GridColumn>
				<GridColumn field="baseLogo" title="基站小区标识"></GridColumn>
				<GridColumn field="stationType" align="center" title="站类型"></GridColumn>
				<GridColumn field="baseState" align="center" title="基站状态"></GridColumn>
			</TreeGrid>
		</div>
	</div>
</template>

<script>
export default {
	name: 'swanManagement',
	data() {
		return {
			loading: false,
			loadMsg: '正在处理，请稍待。。。',
			selectionMode: 'multiple',
			data: [
				{
					id: 1,
					swanId: '9099',
					name: 'testGate',
					area: '测试区域',
					longitude: '108.34',
					latitude: '34.1587',
					descript: '',
					baseId: '',
					IP: '',
					baseLogo: '',
					stationType: '',
					baseState: '',
					children: [
						{
							id: 11,
							swanId: '',
							name: '测试TDD1',
							area: '',
							longitude: '',
							latitude: '',
							descript: '',
							baseId: '23',
							IP: '',
							baseLogo: '小区(68352)小区(68352)',
							stationType: 'V2',
							baseState: ''
						},
						{
							id: 12,
							swanId: '',
							name: 'test设备',
							area: '',
							longitude: '',
							latitude: '',
							descript: '',
							baseId: '778899',
							IP: '',
							baseLogo: '小区(77889901)',
							stationType: 'V2',
							baseState: ''
						}
					]
				},
				{
					id: 2,
					swanId: '9099',
					name: 'testGate',
					area: '测试区域',
					longitude: '108.9999',
					latitude: '34.8888',
					descript: 'ITest的测试卡口',
					baseId: '',
					IP: '',
					baseLogo: '',
					stationType: '',
					baseState: '',
					children: [
						{
							id: 21,
							swanId: '',
							name: 'iTest基站',
							area: '',
							longitude: '',
							latitude: '',
							descript: '',
							baseId: '100',
							IP: '223.98.167.236',
							baseLogo: '小区(25699)小区(25690)小区(25691)小区(25692)',
							stationType: 'V2',
							baseState: ''
						}
					]
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
		loadData () {
			var that = this
			this.axios.post('http://192.168.1.172/system/bayonet')
			.then(function (response) {
				that.data = response.data.res
			})
			.catch(function (error) {
				console.log(error)
			})
		}
	}
}
</script>
<style>
	.swan-management .export{
		width: 100%;
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background: #f4f4f4;
	}
	.swan-management .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
</style>
