export default function MapLoader() {
	return new Promise((resolve, reject) => {
		if (window.AMap) {
			resolve(window.AMap)
		} else {
			var script = document.createElement('script')
			script.type = 'text/javascript'
			script.async = true
			script.src = 'https://api.map.baidu.com/api?v=2.0&ak=QAykLBWNqSUjkEnSFGjsaHaq1G1AoBc8'
			script.onerror = reject
			document.head.appendChild(script)
		}
		window.initAMap = () => {
			resolve(window.AMap)
		}
	})
}
