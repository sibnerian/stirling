
function stirling(n, k){
	//return 0 if no partitions can be made
	if(invalidPartition(n,k)){
		return 0
	}
	if(n===k || k===1 ){
		return 1
	}
	return stirling(n-1, k-1) + k*stirling(n-1, k)
}

function invalidPartition(n, k){
	return !n || !k || n<=0 || k<=0 || k>n
}

function stirlingJSON(n, k){
	var result = {}
	if(invalidPartition(n,k)) return result
	var stir = stirling(n,k)
	result.txt = stir + ' ' + k +'-part partitions of a ' + n + '-set'
	result.size = stir
	var children = []
	if(!(n===k) && !(k===1)){
		children.push(stirlingJSON(n-1, k-1))
		for(var i = 0; i<k; i++){
			children.push(stirlingJSON(n-1, k))
		}
		result.children = children
	}
	return result

}