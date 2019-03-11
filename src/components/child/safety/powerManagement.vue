<template>
	<div class="power-mangement">
		<TreeGrid
			:data="data" idField="id" treeField="name">
			<GridColumn field="name" title="权限名称"></GridColumn>
			<GridColumn field="instruction" title="权限说明"></GridColumn>
			<GridColumn field="type" title="权限类型"></GridColumn>
		</TreeGrid>
	</div>
</template>

<script>
export default {
	name: 'powerManagement',
	data() {
		return {
				data: [
				{
					id: 1,
					name: '全部',
					instruction: '',
					type: '0',
					children: [
						{
							id: 2,
							name: '信息查询',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 21,
									name: '综合信息查询',
									instruction: '',
									type: '0',
									children: [
										{
											id: 211,
											name: '查询-综合信息查询',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 22,
									name: '归属地查询',
									instruction: '',
									type: '0',
									children: [
										{
											id: 221,
											name: '查询-归属地查询',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 23,
									name: 'MAC地址地查询',
									instruction: '',
									type: '0',
									children: [
										{
											id: 231,
											name: '查看-MAC地址地查询',
											instruction: '',
											type: '0'
										},
										{
											id: 232,
											name: '导出-MAC地址地查询',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 24,
									name: '人像查询',
									instruction: '',
									type: '0',
									children: [
										{
											id: 241,
											name: '查看-人像查询',
											instruction: '',
											type: '0'
										},
										{
											id: 242,
											name: '导出-人像查询',
											instruction: '',
											type: '0'
										},
										{
											id: 243,
											name: '人像查看-人像查询',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 3,
							name: '综合分析',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 31,
									name: '轨迹分析',
									instruction: '',
									type: '0',
									children: [
										{
											id: 311,
											name: '查询-轨迹分析',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 32,
									name: '伴随分析',
									instruction: '',
									type: '0',
									children: [
										{
											id: 321,
											name: '查询-伴随分析',
											instruction: '',
											type: '0'
										},
										{
											id: 322,
											name: '导出-伴随分析',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 33,
									name: '嫌疑人分析',
									instruction: '',
									type: '0',
									children: [
										{
											id: 331,
											name: '查询-嫌疑人',
											instruction: '',
											type: '0'
										},
										{
											id: 332,
											name: '查询-嫌疑人详细信息',
											instruction: '',
											type: '0'
										},
										{
											id: 333,
											name: '导出-嫌疑人',
											instruction: '',
											type: '0'
										},
										{
											id: 334,
											name: '导出-嫌疑人详细信息',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 4,
							name: '碰撞分析',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 41,
									name: '区域碰撞',
									instruction: '',
									type: '0',
									children: [
										{
											id: 411,
											name: '查询-区域碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 412,
											name: '列表导出-区域碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 413,
											name: '详情列表-区域碰撞',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 42,
									name: '时空碰撞',
									instruction: '',
									type: '0',
									children: [
										{
											id: 421,
											name: '查看-时空碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 422,
											name: '导出-时空碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 423,
											name: '查看-时空碰撞详情',
											instruction: '',
											type: '0'
										},
										{
											id: 424,
											name: '导出-时空碰撞详情',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 43,
									name: '精准碰撞',
									instruction: '',
									type: '0',
									children: [
										{
											id: 431,
											name: '查询-精准碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 432,
											name: '导出列表-精准碰撞',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 44,
									name: 'MAC碰撞',
									instruction: '',
									type: '0',
									children: [
										{
											id: 441,
											name: '查看-MAC碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 442,
											name: '导出-MAC碰撞',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 45,
									name: '人像碰撞',
									instruction: '',
									type: '0',
									children: [
										{
											id: 451,
											name: '查看-人像碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 452,
											name: '导出列表-人像碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 453,
											name: '查看详情列表-人像碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 454,
											name: '导出详情列表-人像碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 455,
											name: '查看人像-人像碰撞',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 46,
									name: '人脸碰撞',
									instruction: '',
									type: '0',
									children: [
										{
											id: 461,
											name: '查看-人脸碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 462,
											name: '导出列表-人脸碰撞',
											instruction: '',
											type: '0'
										},
										{
											id: 463,
											name: '查看-人脸碰撞详情',
											instruction: '',
											type: '0'
										},
										{
											id: 464,
											name: '导出-人脸碰撞详情',
											instruction: '',
											type: '0'
										},
										{
											id: 465,
											name: '查看人像-人脸碰撞详情',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 5,
							name: '统计监控',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 51,
									name: '实时监控',
									instruction: '',
									type: '0',
									children: [
										{
											id: 511,
											name: '查看-实时监控',
											instruction: '',
											type: '0'
										},
										{
											id: 512,
											name: '设置-实时监控',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 52,
									name: '轨迹监控',
									instruction: '',
									type: '0',
									children: [
										{
											id: 521,
											name: '设置-轨迹监控',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 53,
									name: '目标行为统计',
									instruction: '',
									type: '0',
									children: [
										{
											id: 531,
											name: '查询-目标行为统计',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 54,
									name: '目标人群统计',
									instruction: '',
									type: '0',
									children: [
										{
											id: 541,
											name: '查询-目标人群统计',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 55,
									name: '目标人流量统计',
									instruction: '',
									type: '0',
									children: [
										{
											id: 551,
											name: '查询-目标人流量统计',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 56,
									name: '卡口流量统计',
									instruction: '',
									type: '0',
									children: [
										{
											id: 561,
											name: '查询-卡口流量统计',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 57,
									name: '综合监控',
									instruction: '',
									type: '0',
									children: [
										{
											id: 571,
											name: '查看-综合监控',
											instruction: '',
											type: '0'
										},
										{
											id: 572,
											name: '设置-综合监控',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 6,
							name: '布控预警',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 61,
									name: '目标对象动态预警',
									instruction: '',
									type: '0',
									state: 'closed',
									children: [
										{
											id: 611,
											name: '查看-目标对象动态预警',
											instruction: '',
											type: '0'
										},
										{
											id: 612,
											name: '添加-目标对象动态预警',
											instruction: '',
											type: '0'
										},
										{
											id: 613,
											name: '编辑-目标对象动态预警',
											instruction: '',
											type: '0'
										},
										{
											id: 614,
											name: '删除-目标对象动态预警',
											instruction: '',
											type: '0'
										},
										{
											id: 615,
											name: '添详情加-目标对象动态预警',
											instruction: '',
											type: '0'
										},
										{
											id: 616,
											name: '导出-目标对象动态预警',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 62,
									name: '目标对象集结预警',
									instruction: '',
									type: '0',
									state: 'closed',
									children: [
										{
											id: 621,
											name: '查看-目标对象集结预警',
											instruction: '',
											type: '0'
										},
										{
											id: 622,
											name: '添加-目标对象集结预警',
											instruction: '',
											type: '0'
										},
										{
											id: 623,
											name: '编辑-目标对象集结预警',
											instruction: '',
											type: '0'
										},
										{
											id: 624,
											name: '删除-目标对象集结预警',
											instruction: '',
											type: '0'
										},
										{
											id: 625,
											name: '添详情加-目标对象集结预警',
											instruction: '',
											type: '0'
										},
										{
											id: 626,
											name: '导出-目标对象动态预警',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 63,
									name: '目标对象首现预警',
									instruction: '',
									type: '0',
									state: 'closed',
									children: [
										{
											id: 631,
											name: '查看-目标对象首现预警',
											instruction: '',
											type: '0'
										},
										{
											id: 632,
											name: '添加-目标对象首现预警',
											instruction: '',
											type: '0'
										},
										{
											id: 633,
											name: '编辑-目标对象首现预警',
											instruction: '',
											type: '0'
										},
										{
											id: 634,
											name: '删除-目标对象首现预警',
											instruction: '',
											type: '0'
										},
										{
											id: 635,
											name: '添详情加-目标对象首现预警',
											instruction: '',
											type: '0'
										},
										{
											id: 636,
											name: '导出-目标对象首现预警',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 64,
									name: '目标人群统计',
									instruction: '',
									type: '0',
									state: 'closed',
									children: [
										{
											id: 641,
											name: '查询-目标人群统计',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 65,
									name: '目标对象流量预警',
									instruction: '',
									type: '0',
									state: 'closed',
									children: [
										{
											id: 651,
											name: '查看-目标对象流量预警',
											instruction: '',
											type: '0'
										},
										{
											id: 652,
											name: '添加-目标对象流量预警',
											instruction: '',
											type: '0'
										},
										{
											id: 653,
											name: '编辑-目标对象流量预警',
											instruction: '',
											type: '0'
										},
										{
											id: 654,
											name: '删除-目标对象流量预警',
											instruction: '',
											type: '0'
										},
										{
											id: 655,
											name: '添详情加-目标对象流量预警',
											instruction: '',
											type: '0'
										},
										{
											id: 656,
											name: '导出-目标对象流量预警',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 7,
							name: '告警管理',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 71,
									name: '告警管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 711,
											name: '查看-活跃告警',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 72,
									name: '历史告警',
									instruction: '',
									type: '0',
									children: [
										{
											id: 721,
											name: '查看-历史告警',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 73,
									name: '告警短信设置',
									instruction: '',
									type: '0',
									children: [
										{
											id: 731,
											name: '编辑-告警短信设置',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 8,
							name: '中间库',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 81,
									name: '常驻人口库',
									instruction: '',
									type: '0',
									children: [
										{
											id: 811,
											name: '查看-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 812,
											name: '查询-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 813,
											name: '查询-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 814,
											name: '添加-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 815,
											name: '设置-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 816,
											name: '删除-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 817,
											name: '转人工/自助-常驻人口',
											instruction: '',
											type: '0'
										},
										{
											id: 818,
											name: '导出-本地人口',
											instruction: '',
											type: '0'
										},
										{
											id: 819,
											name: '导出-流动人口',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 82,
									name: '案件库管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 821,
											name: '进入-案件库管理',
											instruction: '',
											type: '0'
										},
										{
											id: 822,
											name: '查看-案件库管理',
											instruction: '',
											type: '0'
										},
										{
											id: 823,
											name: '修改-案件库管理',
											instruction: '',
											type: '0'
										},
										{
											id: 824,
											name: '删除-案件库管理',
											instruction: '',
											type: '0'
										},
										{
											id: 825,
											name: '保存案件库-案件库管理',
											instruction: '',
											type: '0'
										},
										{
											id: 826,
											name: '列表-案件库管理',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 83,
									name: '特定人员管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 831,
											name: '列表-特定人员管理',
											instruction: '',
											type: '0'
										},
										{
											id: 832,
											name: '添加-特定人员管理',
											instruction: '',
											type: '0'
										},
										{
											id: 833,
											name: '删除-特定人员管理',
											instruction: '',
											type: '0'
										},
										{
											id: 834,
											name: '批量删除-特定人员管理',
											instruction: '',
											type: '0'
										},
										{
											id: 835,
											name: '导入-特定人员管理',
											instruction: '',
											type: '0'
										},
										{
											id: 836,
											name: '导出-特定人员管理',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 84,
									name: '特定人员类型管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 841,
											name: '查看-特定人员类型管理',
											instruction: '',
											type: '0'
										},
										{
											id: 842,
											name: '添加-特定人员类型管理',
											instruction: '',
											type: '0'
										},
										{
											id: 843,
											name: '编辑-特定人员类型管理',
											instruction: '',
											type: '0'
										},
										{
											id: 844,
											name: '删除-特定人员类型管理',
											instruction: '',
											type: '0'
										},
										{
											id: 845,
											name: '详情-特定人员类型管理',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 9,
							name: '安全管理',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 91,
									name: '用户管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 911,
											name: '查看-用户管理',
											instruction: '',
											type: '0'
										},
										{
											id: 912,
											name: '添加-用户管理',
											instruction: '',
											type: '0'
										},
										{
											id: 913,
											name: '修改-用户管理',
											instruction: '',
											type: '0'
										},
										{
											id: 914,
											name: '删除-用户管理',
											instruction: '',
											type: '0'
										},
										{
											id: 915,
											name: '导出-用户管理',
											instruction: '',
											type: '0'
										},
										{
											id: 916,
											name: '删除-常驻人口',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 92,
									name: '角色管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 921,
											name: '查看-角色管理',
											instruction: '',
											type: '0'
										},
										{
											id: 922,
											name: '添加-角色管理',
											instruction: '',
											type: '0'
										},
										{
											id: 923,
											name: '修改-角色管理',
											instruction: '',
											type: '0'
										},
										{
											id: 924,
											name: '删除-角色管理',
											instruction: '',
											type: '0'
										},
										{
											id: 925,
											name: '导出-角色管理',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 93,
									name: '权限管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 931,
											name: '查看-权限管理',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 94,
									name: '机构管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 941,
											name: '查看-机构管理',
											instruction: '',
											type: '0'
										},
										{
											id: 942,
											name: '添加-机构管理',
											instruction: '',
											type: '0'
										},
										{
											id: 943,
											name: '修改-机构管理',
											instruction: '',
											type: '0'
										},
										{
											id: 944,
											name: '删除-机构管理',
											instruction: '',
											type: '0'
										},
										{
											id: 945,
											name: '导出-机构管理',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 10,
							name: '日志管理',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 101,
									name: '操作日志',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1011,
											name: '查看-操作日志',
											instruction: '',
											type: '0'
										},
										{
											id: 1012,
											name: '导出-操作日志',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 102,
									name: '安全日志',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1021,
											name: '查看-安全日志',
											instruction: '',
											type: '0'
										},
										{
											id: 1022,
											name: '导出-安全日志',
											instruction: '',
											type: '0'
										}
									]
								}
							]
						},
						{
							id: 11,
							name: '系统管理',
							instruction: '',
							type: '0',
							state: 'closed',
							children: [
								{
									id: 111,
									name: '区域管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1111,
											name: '查看-区域管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1112,
											name: '添加-区域',
											instruction: '',
											type: '0'
										},
										{
											id: 1113,
											name: '修改-区域',
											instruction: '',
											type: '0'
										},
										{
											id: 1114,
											name: '删除-区域',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 112,
									name: '卡口管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1121,
											name: '查看-热点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1122,
											name: '添加-热点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1123,
											name: '修改-热点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1124,
											name: '删除-热点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1125,
											name: '导出-热点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1126,
											name: '导入-热点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1127,
											name: '复位-基站',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 113,
									name: '版本升级',
									instruction: '',
									type: '0'
								},
								{
									id: 114,
									name: '短信通知',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1141,
											name: '查看-短信通知',
											instruction: '',
											type: '0'
										},
										{
											id: 1142,
											name: '新增-短信通知',
											instruction: '',
											type: '0'
										},
										{
											id: 1143,
											name: '编辑-短信通知',
											instruction: '',
											type: '0'
										},
										{
											id: 1144,
											name: '删除-短信通知',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 115,
									name: '短信管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1151,
											name: '查看-短信管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1152,
											name: '新增-短信管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1153,
											name: '编辑-短信管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1154,
											name: '删除-短信管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1155,
											name: '切换状态-短信管理',
											instruction: '',
											type: '0'
										}
									]
								},
								{
									id: 116,
									name: '频点管理',
									instruction: '',
									type: '0'
								},
								{
									id: 117,
									name: '站点管理',
									instruction: '',
									type: '0',
									children: [
										{
											id: 1171,
											name: '查看-站点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1172,
											name: '新增-站点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1173,
											name: '修改-站点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1174,
											name: '删除-站点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1175,
											name: '导出-站点管理',
											instruction: '',
											type: '0'
										},
										{
											id: 1176,
											name: '设定时间-站点管理',
											instruction: '',
											type: '0'
										}
									]
								}
							]
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
		loadData () {
			var that = this
			that.data = []
			const loading = that.$loading({
				target: document.querySelector('.table-list'),
				lock: true,
				text: '正在加载...',
				spinner: 'el-icon-loading',
				background: 'rgba(255, 255, 255, 0.6)'
			})
			this.axios.post(`${this.url}/safety/permission`)
			.then(function (response) {
				loading.close()
			})
			.catch(function (error) {
				console.log(error)
			})
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
