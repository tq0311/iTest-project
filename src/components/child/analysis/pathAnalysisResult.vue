<template>
	<div class="path-analysis-result">
		<!-- <div class="card-top">伴随分析查询结果</div> -->
		<div class="card-content">
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
					label="手机卡码(ISMI)"
					:show-overflow-tooltip="true"
					:resizable="false"
					min-width='35%'>
				</el-table-column>
				<el-table-column
					prop="phone"
					label="电话号码"
					:show-overflow-tooltip="true"
					:resizable="false"
					min-width='30%'>
				</el-table-column>
				<el-table-column
					prop="timestamp"
					label="时间"
					:show-overflow-tooltip="true"
					:resizable="false"
					min-width='30%'>
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
</template>
<script>
	export default{
		name: 'pathAnalysisResult',
		props: {
			tableData: {
				type: Array
			}
		},
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50]
			}
		},
		methods: {
			current_change (currentPage) {
				this.currentPage = currentPage
				this.total = this.tableData.length
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			}
		},
		updated () {
			this.total = this.tableData.length
		}
	}
</script>
<style>
.path-analysis-result {
	height: 100%;
	width: 100%;
}
</style>
