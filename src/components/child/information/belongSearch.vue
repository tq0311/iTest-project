<template>
	<div class="belong-search">
		<div class="search-card">
			<div class="card-top">查询条件</div>
			<div class="card-content">
				<div class="search-box">
					<SearchBox
							style="width:300px"
							placeholder='请输入需要查询的手机信息'
							v-model="imsi"
							@search="onSearch($event)">
						<Addon>
								<span v-if="imsi" class="textbox-icon icon-clear" title="Clear value" @click="imsi=null"></span>
						</Addon>
						<Menu>
							<MenuItem value="imsinumber" text="IMSI号码"></MenuItem>
							<MenuItem value="phonenumber" text="电话号码"></MenuItem>
						</Menu>
					</SearchBox>
				</div>
			</div>
		</div>
		<div class="results-card">
			<div class="card-top">结果</div>
			<div class="card-content">
				<table>
					<tbody>
						<tr>
							<th>您输入的查询条件</th>
							<td><input id="condition" v-model="condition" type="text" name=""></td>
						</tr>
						<tr>
							<th>卡号归属地</th>
							<td><input id="belong" v-model="belong" type="text" name=""></td>
						</tr>
						<tr>
							<th>区号</th>
							<td><input id="areaNumber" v-model="areaNumber" type="text" name=""></td>
						</tr>
						<tr>
							<th>运营商</th>
							<td><input id="operator" v-model="operator" type="text" name=""></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'belongSearch',
		data() {
			return {
				imsi: null,
				searchingInfo: null,
				condition: null,
				belong: null,
				areaNumber: null,
				operator: null
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			onSearch (event) {
				this.searchingInfo = event
				var that = this
				if (that.imsi === null || that.imsi === '') {
					that.$notify({
						title: '提示',
						message: '请输入搜索信息！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					if (event.category === 'imsinumber') {
						if (event.value.length !== 15) {
							that.$notify({
								title: '提示',
								message: '请输入15位有效的IMSI号码！',
								position: 'bottom-right',
								duration: 2000
							})
						} else if (event.value.length === 15) {
							this.axios.get(`${this.url}/information/belonging`, {
								params: {
									number: this.imsi,
									type: 'imsi'
								}
							})
							.then(function (response) {
								var r = response.data.res[0]
								that.condition = r.imsi
								that.belong = r.belong
								that.operator = r.operator
								that.areaNumber = r.belong
								})
							.catch(function (error) {
								console.log(error)
							})
						}
					} else if (event.category === 'phonenumber') {
						if (event.value.length !== 11) {
							that.$notify({
								title: '提示',
								message: '请输入11位有效的电话号码！',
								position: 'bottom-right',
								duration: 2000
							})
						} else if (event.value.length === 11) {
							that.condition = ''
							that.belong = ''
							that.operator = ''
							that.areaNumber = ''
							this.axios.get(`${this.url}/information/belonging`, {
								params: {
									number: this.imsi,
									type: 'phone'
								}
							})
							.then(function (response) {
								var r = response.data.res[0]
								that.condition = r.phone
								that.belong = r.belong
								that.operator = r.operator
								that.areaNumber = r.belong
								})
						}
					}
				}
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
	.belong-search .card-content{
		height: 100%;
		width: 100%;
		padding: 1px 1px 3px 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.search-box{
		margin:auto;
		margin-top: 29px;
		margin-bottom: 29px;
		width: 297px;
		height: 30px;
		border-radius: 5px;
	}
	.telephone{
		text-align: center;
		float: left;
		width: 93px;
		height: 28px;
		border-right: 1px solid #95b8e7;
		background: linear-gradient(to bottom,#ffffff 0,#eeeeee 100%);
	}
	.search-text{
		height: 30px;
		width: 200px;
		padding-left: 4px;
		float: left;
		border: none;
		margin: 0;
	}
	.results-card{
		margin-top: 1px;
	}
	.belong-search input{
		width: 205px;
		height: 32px;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 4px 8px;
		line-height: 30px;
	}
	.belong-search table{
		width: 90%;
		margin: 30px 0;
		line-height: 30px;
	}
	.belong-search table tr th{
		height: 32px;
		line-height: 32px;
		text-align: right;
		padding: 5px 10px 5px 0;
		width: 50%;
	}
	.belong-search table tr td{
		padding: 5px 0;
		text-align: left;
		width: 50%;
	}
</style>
