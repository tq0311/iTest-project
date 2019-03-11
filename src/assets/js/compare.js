const ob = function compare (start, end) {
		var num = end - start
		if (num <= 0) {
			return false
		} else if (num < 86400000 || num > 604800000) {
			return true
		}
	}

export default ob
