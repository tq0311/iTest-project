<template>
	<div class="swan-statistical">
		<div class="time">
			<div class="time-group">
				<el-button type="primary" class="day addclass" plain id="day">日</el-button>
				<el-button type="primary" class="week" plain id="week">周</el-button>
				<el-button type="primary" class="month" plain id="month">月</el-button>
			</div>
			<div class="time-picker">
				<el-date-picker
					v-model="starttime"
					type="date"
					value-format="timestamp"
					placeholder="开始时间">
				</el-date-picker>
				<span>至</span>
				<el-date-picker
					v-model="endtime"
					type="date"
					value-format="timestamp"
					placeholder="结束时间">
				</el-date-picker>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'swanStatistical',
		data () {
			return {
				starttime: null,
				endtime: null
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		created () {
			this.axios.post(`${this.url}/statistical/bayonet`, {})
			.then(function (response) {
				console.log(response)
			})
			.catch(function (error) {
				console.log(error)
			})
		},
		mounted () {
			$('#week').click(function () {
				$(this).addClass('addclass')
				$('#day').removeClass('addclass')
				$('#month').removeClass('addclass')
			})
			$('#day').click(function () {
				$(this).addClass('addclass')
				$('#week').removeClass('addclass')
				$('#month').removeClass('addclass')
			})
			$('#month').click(function () {
				$(this).addClass('addclass')
				$('#day').removeClass('addclass')
				$('#week').removeClass('addclass')
			})
		},
		updated () {
			console.log(this.starttime)
		},
		methods: {
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
.swan-statistical .time{
	height: 58px;
	padding-left: 20px;
}
.swan-statistical .time-group{
	width: 154px;
	height: 38px;
	margin-right: 20px;
	float: left;
}
.swan-statistical .time-picker{
	float: left;
}
.swan-statistical .day{
	border: 1px solid #b6b4b6;
}
.swan-statistical .week{
	border-left: none;
	border-top: 1px solid #b6b4b6;
	border-right: 1px solid #b6b4b6;
	border-bottom: 1px solid #b6b4b6;
}
.swan-statistical .month{
	border-left: none;
	border-top: 1px solid #b6b4b6;
	border-right: 1px solid #b6b4b6;
	border-bottom: 1px solid #b6b4b6;
}
.swan-statistical .addclass{
	background: #1e9fff !important;
	color: #fff !important;
}
</style>
