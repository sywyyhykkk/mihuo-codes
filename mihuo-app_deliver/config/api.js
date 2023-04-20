import OrderApi from './api/orderApi.js';
import MallApi from './api/mallApi.js'
import AdminApi from './api/adminApi.js';
import BasicApi from './api/basicApi.js';
import PayApi from './api/payApi.js';

const aggregation = (baseClass, ...mixins) => {
	class base extends baseClass {
		constructor(...args) {
			super(...args);
			mixins.forEach((mixin) => {
				copyProps(this, (new mixin));
			});
		}
	}
	
	const copyProps = (target, source) => {
		Object.getOwnPropertyNames(source)
			.concat(Object.getOwnPropertySymbols(source))
			.forEach((prop) => {
				if (!prop.match(
						/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
						))
					Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
			})
	}
	
	mixins.forEach((mixin) => {
		copyProps(base.prototype, mixin.prototype);
		copyProps(base, mixin);
	});
	
	return base;
}

export default class Api extends aggregation(OrderApi, MallApi, AdminApi, BasicApi, PayApi) {}
