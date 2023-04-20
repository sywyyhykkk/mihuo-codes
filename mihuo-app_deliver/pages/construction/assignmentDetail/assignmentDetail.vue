<style lang="scss" scoped>
	// @import '@/style/mixin.scss';

	.right-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.nav-bar-title {
		@include nav-bar-title();
		color: #fff;
	}

	.nav-bar-right {
		padding-right: 40rpx;
		display: flex;
		align-items: center;

		text {
			font-size: 28rpx;
			color: #fff;
		}

		.waiting {
			width: 18rpx;
			height: 18rpx;
			border-radius: 50%;
			background-color: $errorFontColor;
			margin-top: -6rpx;
		}
	}

	.disclose-pending {
		color: #fff;
		font-size: 32rpx;
	}

	.header-container {
		width: 100vw;
		background-color: $themeColor;
		padding: 32rpx 0rpx 52rpx 46rpx;
		display: flex;
		align-items: center;

		text {
			font-family: PingFang SC;
			font-style: normal;
			font-size: 32rpx;
			color: #ffffff;
			margin-right: 16rpx;
		}

		.tag-list {
			display: flex;
			align-items: center;

			.item-tag {
				// background-color: rgba(255, 255, 255, 0.1);
				background-color: rgba(255, 255, 255, 0.3);
				border-radius: 6rpx;
				padding: 4rpx 10rpx;
				margin-right: 8rpx;
			}

			.item-tag-1 {
				background-color: rgba(255, 255, 255, 0.3);
				border-radius: 6rpx;
				padding: 4rpx 10rpx;
			}

			.item-tag-text {
				color: #fff;
				font-size: $smallFontSize;
				transform: scale(0.85);
			}
		}
	}

	.order-user-information-item {
		min-height: 352rpx;
		background-color: #ffffff;
		border-radius: 24rpx 24rpx 16rpx 16rpx;
		margin: -20rpx 0rpx 10rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: center;


		/deep/.order-user-information-contain {
			margin: 0rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			// padding-bottom: 0rpx;
		}

		.order-no-data-list {
			margin-top: 0rpx;
		}

		.task-statistics {
			background: #fff;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-top: 20rpx;
			flex-direction: row;

			.icon-budget {
				width: 40rpx;
				height: 40rpx;
			}


			.item-task {
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;

				.item-num {
					text-align: center;

				}

				&:nth-of-type(5) {
					position: relative;

					.item-num {
						text-decoration: underline;
					}

					.order-angle-sign-default {
						position: absolute;
						top: -12rpx;
						background-color: #FF5B05;
						display: flex;
						align-items: center;
						justify-content: center;

						.order-angle-sign-text {
							color: #fff;
							font-size: 24rpx;
							transform: scale(0.85);
						}
					}

					.medium-order-angle-sign {
						width: 30rpx;
						height: 30rpx;
						border-radius: 30rpx;
						right: -4rpx;
					}

					.large-size-order-angle-sign {
						width: 48rpx;
						height: 30rpx;
						border-radius: 30rpx;
						right: -24rpx;
					}

					.order-angle-sign {
						right: -4rpx;
						width: 28rpx;
						height: 28rpx;
						border-radius: 50%;
					}
				}

				.item-text {
					color: #606166;
					font-size: 26rpx;
				}
			}
		}
	}

	.default-task {
		line-height: 40rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		border-radius: 40rpx;
		font-size: 20rpx;
		margin-left: 16rpx;
		white-space: nowrap;
	}

	.task-status {
		color: #909199;
		background: #efefef;
	}


	.customer-info {
		width: 710rpx;
		height: 450rpx;
		margin: 0 20rpx;
		margin-top: -120rpx;
		border-radius: 20rpx;
		background-color: #fff;

		.customer-header {
			width: 100%;
			height: 100rpx;
			padding: 0 30rpx;
			justify-content: space-between;

			.left {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 28rpx;
				line-height: 100rpx;
				color: #606166;
			}

			.right {
				.icon {
					width: 28rpx;
					height: 35rpx;
					margin-right: 10rpx;
				}

				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 100rpx;
				color: #666666;
			}
		}

		.info {
			width: 650rpx;
			height: 330rpx;
			margin: 0 auto;
			border-top: 2rpx #eeeeee solid;
			align-items: flex-start;
			flex-direction: column;

			.name {
				width: 100%;
				height: 44rpx;
				margin-top: 40rpx;

				.text {
					@include toe();
					width: max-content;
					height: 44rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 32rpx;
					line-height: 44rpx;
					color: $seconFontColor;
				}
			}

			.location {
				width: 600rpx;
				height: 36rpx;
				margin-top: 20rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 36rpx;
				white-space: nowrap;
				color: #999999;

				.icon {
					width: 28rpx;
					height: 28rpx;
					margin-left: 20rpx;
				}
			}

			text {
				width: 100%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #999999;
			}

			.tags {
				width: 100%;
				height: 102rpx;
				margin-top: 20rpx;

				.tag {
					width: 25%;
					height: 100%;
					flex-direction: column;
					padding: 20rpx;

					.text {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 26rpx;
						line-height: 36rpx;
						text-align: center;
						color: #606166;
					}
				}
			}
		}
	}

	.task-toDo-contain {
		border-radius: 20rpx;
		// margin: 0rpx 0rpx 10rpx 0rpx;
		padding-top: 16rpx;

		.list-tab-contain {
			display: flex;
			background: linear-gradient(180deg, #EEF0F7 50%, #fff 50%);
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;
			width: 100%;
			position: -webkit-sticky;
			position: sticky;
			top: calc(88rpx + var(--status-bar-height));
			z-index: 9;
			// border: 2rpx solid gold;

			.item-tab-default {
				display: flex;
				flex: 1;
				justify-content: center;
				color: #606166;
				font-size: 28rpx;
				align-items: center;
				height: 80rpx;
				position: relative;

				&:nth-of-type(1) {
					border-bottom-left-radius: 0rpx;
					border-top-right-radius: 0rpx;
					border-top-left-radius: 0rpx;
				}

				&:nth-of-type(2) {
					border-bottom-right-radius: 0rpx;
					border-top-left-radius: 0rpx;
					border-top-right-radius: 0rpx;
				}



				.item-top {
					position: absolute;
					top: -16rpx;
					width: 100%;
					height: 20rpx;
					background-color: #fff;
					border-top-left-radius: 16rpx;
					border-top-right-radius: 16rpx;
				}

			}

			.item-tab {
				border-radius: 24rpx;
				background-color: #EEF0F7;
			}

			.item-tab-active {
				display: flex;
				justify-content: center;
				flex: 1;
				color: #002FA5;
				font-size: 28rpx;
				background-color: #fff;
				border-radius: 24rpx;
				font-weight: bold;

			}
		}

		.list-contain {
			display: flex;
			padding: 0 120rpx 30rpx 86rpx;
			justify-content: space-between;

			.default-task-toDo {
				font-weight: 700;
				font-size: $middleAddFontSize;
				position: relative;
				display: flex;

				.order-pending-num {
					margin-left: 8rpx;
					font-size: $middleAddFontSize;
					line-height: 1;
					font-weight: 400;
					color: #ff5b05;
					display: flex;
					align-items: center;
					border-radius: 50%;
					justify-content: center;
				}
			}

			.active-task-toDo {
				color: $themeColor;
			}
		}
	}

	.no-data-list {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 72rpx;
		padding-bottom: 20rpx;
		background-color: #fff;
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;

		.no-image {
			width: 234rpx;
			height: 208rpx;
			margin-bottom: 18rpx;
		}

		.no-title {
			font-weight: 400;
			font-size: 13px;
			color: #a9b9de;
		}
	}

	.task-status-list-contain {
		width: 750rpx;
		padding: 40rpx 42rpx;
		background-color: #fff;

		.task-status-list {
			display: flex;
			width: 650rpx;

			.item-task {
				margin-right: 40rpx;
				white-space: nowrap;
				font-size: 24rpx;
				padding: 6rpx 20rpx;


				&:last-child {
					margin-right: 0rpx;
				}
			}

			.item-task-default {
				color: #909199;
			}

			.item-task-active {
				background-color: rgba(0, 47, 165, 0.1);
				color: $themeColor;
				border-radius: 110rpx;
			}
		}
	}

	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
		transform: rotate(90deg)
	}

	.public-none {
		transition: all .2s;
		transform: rotate(0deg);
	}

	.public-block {
		transition: all .2s;
		transform: rotate(90deg);
	}

	.my-sop_contain {
		padding: 26rpx 32rpx;
		background-color: #fff;

		.sop-type {
			display: flex;
			align-items: center;
			justify-content: space-between;


			.item-type {
				background-color: #F7F7F7;
				width: 172rpx;
				height: 62rpx;
				text-align: center;
				border-radius: 70rpx;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					line-height: 62rpx;
					color: #606166;
					font-size: 26rpx;
				}

				&:nth-of-type(4) {
					width: 120rpx;
				}

				.item-type-image {
					width: 24rpx;
					height: 24rpx;
					margin-left: 2rpx;
				}

			}



			.item-type-active {
				background-color: rgba(0, 47, 165, 0.1);

				text {
					color: #002FA5;
				}
			}
		}

		.sop-list {
			margin-top: 30rpx;

			.item-grouping_contain {
				padding-bottom: 34rpx;

				&:last-child {
					padding-bottom: 0rpx;
				}
			}

			.item-grouping {
				padding-left: 10rpx;
				padding-bottom: 28rpx;
				display: flex;
				justify-content: space-between;

				.grouping-left {
					display: flex;
					align-items: center;

					.grouping-name {
						color: #303133;
						font-size: 28rpx;
						font-weight: bold;
						margin-right: 10rpx;
					}
				}

				.grouping-right {
					display: flex;
					align-items: center;
					align-items: center;

					text {
						color: #A7A7A7;
						font-size: 26rpx;
					}
				}
			}

			.children-contian {
				padding: 28rpx;
				background: linear-gradient(270deg, rgba(243, 246, 255, 0.50) 5%, rgba(244, 247, 255, 0.30) 97%);
			}

			.item-grouping-none {
				border-bottom: 2rpx solid #F9F9F9;
			}

			.children {
				padding-bottom: 32rpx;
				margin-bottom: 30rpx;
				border-bottom: 10rpx solid rgba(207, 216, 238, 0.2);

				&:last-child {
					margin-bottom: 0rpx;
					border-bottom: 0rpx;
					padding-bottom: 0rpx;
				}

			}
		}
	}



	.my-assignment {
		height: max-content;
		background-color: #fff;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		padding: 40rpx 42rpx 0 22rpx;

		.custom-card-title {
			width: 100%;
			padding: 40rpx 0rpx 38rpx 28rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 40rpx;
			color: $seconFontColor;

			.icon {
				width: 46rpx;
				height: 46rpx;
				margin-right: 10rpx;
			}
		}

		.assignments {
			height: max-content;
			margin: 0 auto;

			.item-all {
				flex-direction: column;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.item-task-contain {
				display: flex;
				align-items: center;
				max-width: 600rpx;
				overflow: hidden;
			}

			.task-left {
				display: flex;
				align-items: center;
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.task-right {
				display: flex;
				align-items: center;
			}

			.item {
				width: 100%;
				justify-content: space-between;
				margin-bottom: 26rpx;

				&:last-child {

					.public-line {
						border: 0rpx;
					}
				}

				.item-contain {
					width: 100%;
					padding: 0 0 26rpx 0rpx;
				}

				.public-line {
					border-bottom: 2rpx solid #f6f6f6;
					width: 90%;
					margin-left: 54rpx;
				}

				.left {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 400;
					font-size: $middleFontSize;
					line-height: 44rpx;
					color: $mainFontColor;
					margin-left: 20rpx;
					flex: 1;

					.num {
						margin-right: 10rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #909199;
					}

					.beyond-the {
						margin-left: 20rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 26rpx;
						line-height: 36rpx;
						color: $errorColor;
					}

					.item-task-name {
						font-size: 28rpx;
						color: #606166;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.item-task-name-default {
						// max-width: calc(100% - 200rpx);
						// max-width: 258rpx;
					}

					.item-task-name-no-time {
						max-width: 378rpx;
					}

					.default-time {
						margin-left: 20rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 26rpx;
						line-height: 36rpx;
						color: $themeColor;
					}
				}

				.right {
					width: 120rpx;
					height: 50rpx;
					border-radius: 50rpx;
					background-color: $themeColor;
					text-align: center;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 24rpx;
					line-height: 50rpx;
					color: #ffffff;
				}
			}
		}
	}

	.public-bottom-contain {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #a7a7a7;
		padding-bottom: 32rpx;
		padding-top: 26rpx;

		image {
			width: 16rpx;
			height: 14rpx;
			margin-left: 10rpx;
		}

		.public-none {
			transition: all 0.2s;
			transform: rotate(90deg);
		}

		.public-block {
			transition: all 0.2s;
			transform: rotate(-90deg);
		}
	}

	.my-todos {
		height: max-content;
		background-color: #fff;
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		padding: 46rpx 42rpx 10rpx 42rpx;

		.todo-content {
			height: max-content;
			margin: 0 auto;

			.todo-item-contain {
				width: 100%;
			}

			.todo-item-all {
				flex-direction: column;
				margin-bottom: 26rpx;

				&:last-child {
					.public-line {
						border: 0rpx;
					}
				}

				.todo-item-contain {
					padding-bottom: 26rpx;

					.item-status {
						font-size: $smallFontSize;
						color: $mainFontColor;
						transform: scale(0.85);
						transform-origin: left;
						background: #d5ffee;
						border-radius: 25px;
						padding: 4rpx 12rpx;
						color: #10c57d;
					}

					.logo-waiting {
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						background-color: $errorFontColor;
						margin-left: 8rpx;
						margin-top: -6rpx;
					}
				}

				&:last-child {
					// margin-bottom: 0;

					.public-line {
						// border-bottom: 0rpx;
						// width: 0%;
					}
				}
			}

			.todo-item {
				width: 100%;

				.public-line {
					border-bottom: 2rpx solid #f6f6f6;
					width: 90%;
					margin-left: 54rpx;
				}

				.left {
					width: 60%;
					height: 44rpx;

					.num {
						margin-right: 10rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-size: $smallFontSize;
						line-height: 34rpx;
						font-weight: 700;
						color: $viceFontColor;
					}

					.text {
						@include toe;
						// max-width: 420rpx;
						height: 44rpx;
						font-family: PingFang SC;
						font-weight: 400;
						font-style: normal;
						font-size: $middleFontSize;
						line-height: 44rpx;
						color: $mainFontColor;
					}

					.text-active {
						@include toe;
						height: 44rpx;
						font-family: PingFang SC;
						font-weight: 400;
						font-style: normal;
						font-size: $middleFontSize;
						line-height: 44rpx;
						color: $mainFontColor;
					}

					text {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 26rpx;
						line-height: 44rpx;
						color: $themeColor;
					}
				}

				.right {
					width: 40%;
					height: 44rpx;
					justify-content: flex-end;

					.btn {
						width: 104rpx;
						height: 44rpx;
						text-align: center;
						border-radius: 50rpx;
						margin: 0 10rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 24rpx;
						line-height: 44rpx;
					}
				}
			}
		}
	}

	.order-status {
		width: 710rpx;
		height: max-content;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 0rpx 20rpx 10rpx 20rpx;
		padding: 20rpx 40rpx;

		.status-header {
			width: 100%;
			height: 80rpx;
			justify-content: space-between;

			.left {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 80rpx;
				color: $seconFontColor;

				text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 80rpx;
					color: $themeColor;
				}

				.content {
					margin-left: 20rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 26rpx;
					line-height: 80rpx;
					color: $themeColor;
				}
			}

			.right {
				width: 132rpx;
				height: 50rpx;
				border-radius: 50rpx;
				border: 1px solid $themeColor;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 50rpx;
				text-align: center;
				color: $themeColor;
			}
		}
	}

	.work-table {
		height: max-content;
		background-color: #fff;
		border-radius: 20rpx;
		padding-top: 40rpx;

		.card-title {
			padding: 20rpx 34rpx 0 34rpx;
		}

		.card-line {
			height: 4rpx;
			margin: 38rpx 46rpx 26rpx 46rpx;
			background-color: #f0f5fa;
		}

		.title-contain {
			color: $seconFontColor;
			font-weight: bold;
			font-size: $middleFontSize;
			padding-left: 48rpx;
			margin-bottom: 20rpx;
		}

		.table-items {
			height: max-content;
			padding: 0rpx 0rpx 20rpx 0rpx;
			flex-wrap: wrap;
			align-items: flex-start;

			.item {
				width: 25%;
				height: max-content;
				padding: 20rpx;
				flex-direction: column;
				justify-content: space-around;

				.num {
					width: 26rpx;
					height: 26rpx;
					position: relative;
					top: 20rpx;
					left: 30rpx;
					border-radius: 50%;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 18rpx;
					line-height: 26rpx;
					color: #ffffff;
					text-align: center;
					background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
				}

				.icon {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					background: #f5f5f5;
					justify-content: center;

					.img {
						width: 40rpx;
						height: 40rpx;
					}
				}

				text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 400;
					font-size: $smiddleFontSize;
					line-height: 40rpx;
					text-align: center;
					color: $mainFontColor;
					margin-top: 20rpx;
				}
			}
		}
	}

	.card-title {
		width: 100%;
		height: 80rpx;
		padding: 0 30rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 30rpx;
		line-height: 80rpx;
		color: $seconFontColor;

		.icon {
			width: 46rpx;
			height: 46rpx;
			margin-right: 10rpx;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}


	.task-toDo-contain_margin {
		margin: 0rpx;
	}

	.my-sop_contain_view {
		padding: 26rpx 0rpx 20rpx 0rpx;
		display: flex;


		/deep/ .sop-top {
			padding: 0 10rpx;
		}

		/deep/ .sop-bottom {
			padding: 0 10rpx;
		}

		.sop-right_scroll {
			height: 100%;
		}
	}

	.sop-left {
		width: 200rpx;
		border-right: 2rpx solid #f5f5f5;


		.sop-left_item {
			height: 126rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 0 20rpx;
		}

		.sop-left_item_active {
			background-color: #F5F7FC;

			.stage-name {
				color: #002FA5;
			}

			.item-num text {
				color: #002FA5;
			}
		}

		.stage-name {
			color: #606166;
			font-size: 26rpx;
			line-height: 36rpx;
			@include bov(2);
		}

		.stage-image {
			width: 24rpx;
			height: 24rpx;
		}

		.stage-num {
			display: flex;
			align-items: center;
			width: 120rpx;

			.stage-image {
				margin-right: 10rpx;
			}
		}

		.item-num {

			text {
				font-size: 24rpx;
				color: #909199;
			}
		}
	}



	.sop-right {
		flex: 1;

		.sop-information {
			padding: 16rpx 0rpx;
			margin: 0rpx 16rpx 16rpx 16rpx;
			border-bottom: 5px solid rgba(207, 216, 238, 0.2);

			&:last-child {
				border-bottom: 0rpx;
				padding: 16rpx 0rpx 16rpx 0rpx;
				margin: 0rpx 16rpx 0rpx 16rpx;
			}


		}
	}

	.sop-status_name {
		// line-height: 34rpx;
		padding: 2rpx 8rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		margin-right: 2rpx;
		white-space: nowrap;
		margin-left: -8rpx;

		transform: scale(0.85);
		display: inline-block;
		transform-origin: center;
	}

	.task-status2 {
		background: rgba(250, 208, 160, 0.3);
		color: #ff5d35;
	}

	.task-waiting {
		background: rgba(218, 218, 218, 0.3);
		color: #909199;
	}


	.task-status3 {
		background: #d5ffee;
		color: #10c57d;
	}


	.task-check {
		background: rgba(0, 47, 165, 0.1);
		color: #002FA5;
	}

	.task-status4 {
		background: linear-gradient(180deg, rgba(253, 131, 139, 0.1) -5%, rgba(252, 103, 101, 0.1) 100%);
		color: #EB3D32;
	}
</style>

<template>
	<view class="assignment-detail_page">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#002FA5" fontColor="#fff">
			<view slot="default" class="nav-bar-title">
				任务详情
			</view>
			<view slot="right" class="nav-bar-right"
				@click="toPage(`/pages/disclosePending/disclosePending?disclosePendingShow=${disclosePendingShow}`)">
				<text>待处理</text>
				<view v-if="disclosePendingStatus || unfinishedOrderPending.length > 0" class="waiting"></view>
			</view>
		</z-nav-bar>
		<view class="header-container">
			<text>装修订单</text>
			<view class="tag-list">
				<view class="item-tag">
					<view class="item-tag-text">
						周末施工
					</view>
				</view>
				<view class="item-tag-1">
					<view class="item-tag-text">
						节假日不施工
					</view>
				</view>
			</view>
		</view>
		<view class="order-user-information-item">
			<order-user-information :projectId="projectId" :bottomType="true">
				<view class="task-statistics">
					<view class="item-task" v-for="(item,index) in taskStatisticsList" :key="index">
						<view class="item-num" :style="{color:item.color}">
							{{item.value || '--'}}
						</view>

						<view class="item-text">
							{{item.label}}
						</view>
					</view>
				</view>
			</order-user-information>
		</view>
		<view class="task-toDo-contain" :class="[!viewShow && 'task-toDo-contain_margin']">
			<view class="list-tab-contain">
				<view class="item-tab-default" :class="[taskToDoActiveIndex === index ? 'item-tab-active':'item-tab']"
					@click="getTaskToDo(index)" v-for="(item,index) in taskToDoList" :key="index">
					{{ item.label }}
					<view class="item-top" v-if="taskToDoActiveIndex === index">
					</view>
				</view>
			</view>
			<view v-if="taskToDoActiveIndex == 0 " class="my-sop_contain" :class="[viewShow ? '':'my-sop_contain_view']"
				:style="{'height':modularHeight > 0 ? modularHeight + 'rpx':''}">
				<!-- 项目管家视角 -->
				<view class="sop-left" v-if="groupTaskDataList.length >0 && !viewShow">
					<scroll-view class="sop-right_scroll" :scroll-y="true">
						<view v-for="(item,index) in groupTaskDataList" class="sop-left_item"
							:class="[groupTaskIndex == index? 'sop-left_item_active':'' ]"
							@click="getGroupTaskIndex(index)">
							<text class="stage-name">{{item.stageName}}</text>
							<view class="stage-num">
								<image v-if="item.finishNumber !== 0 && item.finishNumber == item.totalNumber"
									class="stage-image" src="@/static/images/icon_process/process_1.png" mode="">
								</image>
								<image v-if="item.finishNumber !== 0  && item.totalNumber > item.finishNumber"
									class="stage-image" src="@/static/images/icon_process/process_2.png" mode="">
								</image>
								<image v-if="item.finishNumber == 0" class="stage-image"
									src="@/static/images/icon_process/process_3.png" mode="">
								</image>
								<text class="item-num">
									<text>{{item.finishNumber}}/</text>
									<text>{{item.totalNumber}}</text>
								</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="sop-right" v-if="groupTaskDataList.length >0 && !viewShow">
					<scroll-view class="sop-right_scroll" :scroll-y="true" @scrolltolower="scrolltolowe"
						@scrolltoupper="scrolltoupper" @scroll="scroll">
						<sop-information v-for="(item,index) in setGroupTaskDataList" :info="item" :show="viewShow"
							:key="index" @click="handleAssigenment(item)">
						</sop-information>
					</scroll-view>
				</view>

				<!-- 其他角色视角 -->
				<view v-if="viewShow" class="sop-type">
					<view class="item-type" v-for="(item,index) in sopTypeList" :key="index"
						:class="[item.activeStatus ? 'item-type-active':'']" @click="getSopType(index,item)">
						<text>{{item.name}}</text>
						<image v-if="index == 3" class="item-type-image"
							src="@/static/images/icon_arrow/icon_arrow_2.png" mode="">
						</image>
					</view>
				</view>
				<view v-if="groupTaskList.length > 0 && viewShow" class="sop-list">
					<view class="item-grouping_contain" v-for="(item,index) in  groupTaskList" :key="item.id">
						<view class="item-grouping" :class="[item.show ? '':'item-grouping-none']">
							<view class="grouping-left">
								<text class="grouping-name">{{item.stageName}}</text>
								<text v-if="getGroupingName(item).name" class="sop-status_name"
									:class="getGroupingName(item).class">
									{{getGroupingName(item).name}}
								</text>
							</view>
							<view class="grouping-right" @click="getGroupTaskShow(item)">
								<text>{{item.show ? '收起':'展开'}}</text>
								<image :class="[item.show ? 'public-block':'public-none']"
									src="/static/images/bottom-icon.png" class="public-arrow"></image>
							</view>
						</view>
						<view class="children-contian" v-if="item.show">
							<view class="children" v-for="(ev,num) in item.nodes" :key="ev.nodeId">
								<sop-information :info="ev" @click="handleAssigenment(ev)"></sop-information>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-data-list"
				v-if="taskToDoActiveIndex == 0 && (groupTaskList.length == 0 || groupTaskDataList.length == 0)  ">
				<image class="no-image" src="@/static/images/no_recommend.png" mode=""></image>
				<view class="no-title">暂无待处理任务，休息一下吧~</view>
			</view>
		</view>
		<view v-if="taskToDoActiveIndex == 1" class="work-table">
			<view class="commonly-used-tools">
				<view class="title-contain">常用工具</view>
				<view class="table-items flex-center">
					<view @click="clickTableItem(item)" class="item flex-center"
						v-for="(item, index) in setCommonlyUsedTools()" :key="index">
						<view class="icon flex-center">
							<image :src="item.icon" class="img"></image>
						</view>
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
			<view class="work-table-items">
				<view class="title-contain">其他工具</view>
				<view class="table-items flex-center">
					<view @click="clickTableItem(item)" class="item flex-center"
						v-for="(item, index) in setWorkTableItems()" :key="index">
						<view class="icon flex-center">
							<image :src="item.icon" class="img"></image>
						</view>
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- sop筛选弹框 -->
		<sop-pop-up v-model="sopShow" @close="sopShow = false" @submit="getSubmit" ref="sopPopUp"
			:sopList="groupTaskDataList">
		</sop-pop-up>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	import {
		mapState
	} from 'vuex'
	import {
		getUnique
	} from '@/plugins/utils.js'
	export default {
		data() {
			return {
				date: new Date().format('yyyy-MM-dd'),
				groupTaskIndex: 0,
				groupTaskBackIndex: -1,
				// orderInfo: {},
				// userRole: uni.getStorageSync('userRole'),
				taskToDoList: [{
						label: '我的任务',
						activeIndex: 0
					},
					{
						label: '工作台',
						activeIndex: 1
					}
				],
				taskStatusActiveIndex: 0,
				taskStatisticsList: [{
						label: '风险',
						value: 0,
						color: '#FE4444'
					},
					{
						label: '未完成',
						value: 0,
						color: '#FF9B26'
					},
					{
						label: '已完成',
						value: 0,
						color: '#10BF78'
					},
					{
						label: '全部',
						value: 0,
						color: '#002FA5'
					}
				],
				sopTypeList: [{
						name: '进行中',
						value: 2,
						activeStatus: true,
						checkStatus: 0
					},
					{
						name: '等待中',
						value: 1,
						activeStatus: false
					},
					{
						name: '已完成',
						value: 3,
						activeStatus: false,
						checkStatus: 3
					}, {
						name: '筛选',
						value: -1,
						activeStatus: false
					}
				],

				taskStatusList: [{
						label: '全部',
						value: -1
					}, {
						label: '可验收',
						value: 1,
						businessType: 1005
					},
					{
						label: '待整改',
						value: 2,
						businessType: 1005
					}, {
						label: '已开始',
						value: 2
					},
					{
						label: '等待中',
						value: 1
					},
					{
						label: '未开始',
						value: 0
					},
					{
						label: '已完成',
						value: 3
					}
				],
				taskToDoActiveIndex: 0,
				// 常用工具
				commonlyUsedTools: [{
						name: '打卡',
						icon: '/static/icon/assignment_detail/icon1.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					},
					{
						name: '施工计划',
						icon: '/static/icon/assignment_detail/icon13.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					},
					{
						name: '服务团队',
						icon: '/static/icon/assignment_detail/icon15.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					},
					{
						name: '服务日志',
						icon: '/static/icon/assignment_detail/icon3.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					}
				],
				// 其他工具
				workTableItems: [
					// {
					// 	name: '材料管理',
					// 	icon: '/static/icon/assignment_detail/icon11.png',
					// 	role: ['R_PROJECT_MANAGER']
					// },
					{
						name: '巡检',
						icon: '/static/icon/assignment_detail/icon9.png',
						role: ['R_PROJECT_MANAGER', 'R_PROJECT_SUPERVISION']
					},
					{
						name: '施工文件',
						icon: '/static/icon/assignment_detail/icon7.png',
						role: ['R_WORKER', 'R_PROJECT_MANAGER', 'R_DESGINER']
					},
					{
						name: '变更',
						icon: '/static/icon/assignment_detail/icon2.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					},
					{
						name: '预算',
						icon: '/static/icon/assignment_detail/icon8.png',
						role: ['R_PROJECT_MANAGER', 'R_PROJECT_SUPERVISION']
					},
					{
						name: '停工复工',
						icon: '/static/icon/assignment_detail/icon10.png',
						role: ['R_PROJECT_MANAGER', 'R_PROJECT_SUPERVISION', 'R_DESGINER']
					},
					{
						name: '申请',
						icon: '/static/icon/assignment_detail/icon5.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					},
					{
						name: '罚款',
						icon: '/static/icon/assignment_detail/icon12.png',
						role: ['R_PROJECT_MANAGER', 'R_PROJECT_SUPERVISION']
					},
					{
						name: '申述',
						icon: '/static/icon/assignment_detail/icon4.png',
						role: [
							'R_WORKER',
							'R_PROJECT_MANAGER',
							'R_PROJECT_SUPERVISION',
							'R_DESGINER'
						]
					},
					// {
					// 	name: '工人工费',
					// 	icon: '/static/icon/assignment_detail/icon14.png',
					// 	role: ['R_PROJECT_MANAGER']
					// },
					{
						name: '整改',
						icon: '/static/icon/assignment_detail/icon18.png',
						role: ['R_WORKER', 'R_PROJECT_MANAGER', 'R_PROJECT_SUPERVISION']
					},
					{
						name: '材料清单',
						icon: '/static/icon/assignment_detail/icon19.png',
						role: ['R_WORKER']
					},
					{
						name: '工序清单',
						icon: '/static/icon/assignment_detail/icon20.png',
						role: ['R_WORKER']
					},
					{
						name: '罚款情况',
						icon: '/static/icon/assignment_detail/icon12.png',
						role: ['R_WORKER', 'R_DESGINER']
					},
					{
						name: '工地协作',
						icon: '/static/icon/assignment_detail/icon21.png',
						role: ['R_PROJECT_MANAGER']
					}
				],
				projectId: 0,
				taskList: [],
				taskListResult: [],
				orderPending: [],
				unfinishedOrderPending: [], //  未完成的待办任务
				orderPendingFalse: false,
				orderPendingBottomShow: false,
				openListFalse: false,
				bottomContainShow: false,
				beforeList: [],
				afterList: [],
				pendingBeforeList: [],
				pendingAfterList: [],
				nodeListData: [],
				groupTaskList: [],
				groupTaskDataList: [],
				sopShow: false,
				disclosePendingShow: false,
				disclosePendingStatus: false,
				preNodeList: [], // 前置节点
				rectificationList: [], // 整改
				examineList: [], // 待审核、审核失败
				viewShow: true,
				modularHeight: 0,
				options: {},
				filterList: [{
						name: '阶段',
						list: []
					},
					{
						name: '节点',
						list: []
					},
					{
						name: '六线管控',
						list: []
					}
				]
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'userRole', 'userPersonInfo']),
			setGroupTaskDataList() {
				return this.groupTaskDataList[this.groupTaskIndex] && this.groupTaskDataList[this.groupTaskIndex].nodes
			}
		},
		onLoad(options) {
			this.options = options
			this.viewShow = this.userRole == 'R_PROJECT_MANAGER' ? false : true
		},
		onShow() {
			this.projectId = this.projectInfo.projectId || 0
			this.getOrderNode()
			this.getOriginator()
			this.initSopGroup()
		},
		onPageScroll(e) {

		},
		methods: {
			getTask(item) {
				if (item.label == '待处理') {
					this.toPage('/pages/construction/pendingList/list')
				}
			},

			scroll(e) {

			},
			scrolltolowe(e) {

			},
			scrolltoupper(e) {

			},
			/**
			 * @description c端发起的单子，新增订单详情、查看详情/开单 ，隐藏材料申请
			 * source 来源：0=无；1=推广渠道 2=订单自动生成的项目 3=商城订单
			 * */
			setWorkTableItems() {
				// return this.workTableItems.filter(
				// 	(item) => item.role.indexOf(this.userRole) !== -1
				// )
				if ([2, 3].includes(this.projectInfo.source)) {
					let tempList = this.workTableItems.filter(
						(item) => item.role.indexOf(this.userRole) !== -1
					)
					tempList.push({
						name: '开单',
						icon: '/static/icon/assignment_detail/Group.png',
						role: ['R_PROJECT_MANAGER']
					})
					tempList.unshift({
						name: '订单详情',
						icon: '/static/icon/assignment_detail/Group.png',
						role: ['R_PROJECT_MANAGER']
					})

					tempList = tempList.filter(item => item.name !== '材料申请')
					return tempList
				} else {
					return this.workTableItems.filter(
						(item) => item.role.indexOf(this.userRole) !== -1
					)
				}
			},
			setCommonlyUsedTools() {
				return this.commonlyUsedTools.filter(
					(item) => item.role.indexOf(this.userRole) !== -1
				)
			},
			getOriginator() {
				this.$getOriginator((res) => {
					this.getToDo()
				})
			},
			openList(type) {
				if (type === '任务') {
					this.openListFalse = !this.openListFalse
					if (this.openListFalse) {
						this.taskList = [...this.beforeList, ...this.afterList]
					} else {
						this.taskList = [...this.beforeList]
					}
					// this.taskListResult = [...this.beforeList, ...this.afterList]
				} else {
					this.orderPendingFalse = !this.orderPendingFalse
					if (this.orderPendingFalse) {
						this.orderPending = [...this.pendingBeforeList, ...this.pendingAfterList]
					} else {
						this.orderPending = [...this.pendingBeforeList]
					}
				}
			},
			//查询任务
			getOrderNode() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}
				return
				//优先根据状态进行排序：可验收——需整改——未开始——等待中——已完成。同状态的根据阶段排序，同阶段的根据模板顺序排序
				this.$http
					.get(`order/biz_order/selfTask?orderId=${this.orderInfo.orderId}`)
					.then((res) => {
						if (res) {
							this.nodeListData = res
							res.map(item => {
								// 若节点预计完成时间为空则取项目预计完成时间
								if (!item.expectFinishTime) {
									item.expectFinishTime = this.projectInfo.expectFinishTime
								}
							})

							this.afterList = []
							this.beforeList = []
							this.taskList = this.setSorting(res)
							this.taskListResult = this.setSorting(res)
							this.getTaskStatu(this.taskStatusActiveIndex)
						}
					})
			},
			initSopGroup() {
				if (this.options.type == 1) {
					this.sopGroup()
				} else {
					this.getGroupTask()
				}
			},
			/**
			 * 
			 * @description 工地管理员进入时调用的接口 
			 * 
			 * */
			sopGroup() {
				if (!this.projectInfo.projectId) {
					console.error('projectId不能为空')
					return
				}
				this.$httpApi.sopGroup({
					projectId: this.projectInfo.projectId,
					groupType: 0 // 分组方式 0-阶段模式 1-分组模式 2-状态模式 3-岗位模式
				}).then(res => {
					if(res){
						res.groups.forEach(item =>{
							item.stageName = item.groupName
						})
						let resutlList = this.initGroupData(res.groups)
						this.groupTaskDataList = resutlList
						this.groupTaskList = resutlList
						this.getFilter('init')
						this.getDisclosePending()
						this.setTaskStatisticsList()
						if (this.userRole == 'R_PROJECT_MANAGER') {
							this.initGroupTask()
							this.positioningStage()
							this.getHeight()
						}
					}
				})
			},
			getGroupTask() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}
				this.$httpApi.selfGroupTask({
					orderId: this.orderInfo.orderId,
					projectId: this.projectInfo.projectId,
					groupType: 0
				}).then((res) => {
					if (res) {
						let resutlList = this.initGroupData(res)
						this.groupTaskDataList = resutlList
						this.groupTaskList = resutlList
						this.getFilter('init')
						this.getDisclosePending()
						this.setTaskStatisticsList()
						if (this.userRole == 'R_PROJECT_MANAGER') {
							this.initGroupTask()
							this.positioningStage()
							this.getHeight()
						}
					}
				})
			},
			initGroupData(list){
				if(list.length == 0){
					return []
				}
				list.forEach(el => {
					el['show'] = true
					el['filterShow'] = false
					if (this.userRole == 'R_PROJECT_MANAGER') {
						el['finishNumber'] = 0
						el['unfinishNumber'] = 0
					}
					el.nodes.forEach(item => {
						item['filterShow'] = false
						item['groupShow'] = false
				
						// 预计完工时间
						item['expectFinishTimeTemp'] = moment(item.expectFinishTime)
							.format(
								'MMMDo')
						//	预计开工时间
						item['expectStartTimeTemp'] = moment(item.expectStartTime).format(
							'MMMDo')
						// 预计需要花费的时间
						item['diffTime'] = moment(item.expectFinishTime).diff(item
							.expectStartTime, 'day')
				
						// 实际开工时间	
						item['realStartTimeTemp'] = item.realStartTime && moment(item
							.realStartTime).format(
							'MMMDo')
				
						// 实际完工时间
						item['realEndTimeTemp'] = moment(item.realEndTime).format(
							'MMMDo')
					})
				})
				list.forEach(item => {
					item.nodes = this.setSorting(item.nodes)
				})
				return list
			},
			/**
			 * @description 统计各个阶段已完成的节点数量，并定位当前节点
			 * */
			initGroupTask() {
				this.groupTaskDataList.forEach(item => {
					item.totalNumber = item.nodes.length
					item.nodes.forEach(item2 => {
						if (item2.status == 3) {
							item.finishNumber++
						}
					})
				})
			},
			/**
			 * @description 定位当前阶段
			 * @param {string} realEndTime 实际完工时间
			 * */
			positioningStage() {
				// 根据阶段是否完成进行定位
				try {
					this.groupTaskDataList.forEach((item, index) => {
						if (item.finishNumber !== item.totalNumber) {
							throw index
						}
					})
				} catch (e) {
					this.groupTaskIndex = e
					if (this.groupTaskBackIndex !== -1) {
						this.groupTaskIndex = this.groupTaskBackIndex
					}
				}
				return

				// 根据最后完成节点的时间进行定位
				let resultList = []
				this.groupTaskDataList.forEach(item => {
					item.nodes.forEach(item2 => {
						resultList.push({
							stageId: item.stageId,
							nodeId: item2.nodeId,
							realEndTime: item2.realEndTime,
							times: item2.realEndTime && moment(item2.realEndTime).unix(),
							nodeName: item2.nodeName
						})
					})
				})
				let list = resultList.sort(this.compare('times'))
				let current = list[0]
				if (current) {
					this.groupTaskDataList.forEach((item, index) => {
						if (current.stageId == item.stageId) {
							this.groupTaskIndex = index
							if (this.groupTaskBackIndex !== -1) {
								this.groupTaskIndex = this.groupTaskBackIndex
							}
						}
					})
				}
			},
			getGroupTaskIndex(index) {
				this.groupTaskIndex = index
				this.groupTaskBackIndex = index
			},
			getHeight() {
				if (this.modularHeight) {
					return
				}
				if (this.groupTaskDataList.length == 0) {
					return
				}
				let screenHeight = uni.getSystemInfoSync().screenHeight
				let offest = 4 // tab + (padding、margin)

				this.$nextTick(() => {
					// 导航栏高度
					uni.createSelectorQuery().selectAll(
							".header_fixed, .header-container, .order-user-information-item, .list-tab-contain")
						.boundingClientRect(res => {
							if (res) {
								let total = 0
								res.forEach(el => {
									total += el.height
								})
								let result = screenHeight - total - offest
								this.modularHeight = this.$util.pxToRpx(result)
							}
						}).exec()
				})

			},
			compare(prop) {
				return function(obj1, obj2) {
					let val1 = obj1[prop];
					let val2 = obj2[prop];
					if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
						val1 = Number(val1);
						val2 = Number(val2);
					}
					if (val1 > val2) {
						return -1;
					} else if (val1 < val2) {
						return 1;
					} else {
						return 0;
					}
				}
			},
			getGroupingName(item) {
				// 任务状态 0=未开始；1=等待中 2=执行中 3=执行结束（完工）4=异常 5=待审查 6=审核失败
				// 未开始 、进行中 、等待中 已完成
				let resultList = [{
					status: 0,
					num: 0,
					name: '未开始',
					class: 'task-waiting'
				}, {
					status: 2,
					num: 0,
					name: '已开始',
					class: 'task-status2'
				}, {
					status: 1,
					num: 0,
					name: '等待中',
					class: 'task-waiting'
				}, {
					status: 3,
					num: 0,
					name: '已完成',
					class: 'task-status3'
				}]

				let tempResult = {
					name: '已开始',
					class: 'task-status2'
				}
				item.nodes.forEach(el => {
					resultList.forEach(ev => {
						if (el.status == ev.status) {
							ev.num++
						}
					})
				})
				resultList.forEach(ev => {
					if (ev.num == item.nodes.length) {
						tempResult.name = ev.name
						tempResult.class = ev.class
					}
				})

				if (item.nodes.length == 0) {
					tempResult.name = ''
				}

				// console.log('resultList', resultList, item.nodes.length);
				return tempResult
			},
			/**
			 * @description sop常用状态筛选
			 * */
			getSopType(index, item) {
				if (item.name == '筛选') {
					this.sopShow = !this.sopShow
					this.$refs.sopPopUp && this.$refs.sopPopUp.syncStatus(this.sopTypeList)
				} else {
					item.activeStatus = !item.activeStatus
					this.sopTypeList.forEach(el => {
						if (el.activeStatus) {
							this.filterList.forEach(even => {
								if (even.name == '节点') {
									even.list.push(el)
								}
							})
						} else {
							this.filterList.forEach(even => {
								if (even.name == '节点') {
									even.list = even.list.filter(es => es.name !== el.name)
									even.list = getUnique(even.list, 'name')
								}
							})
						}
					})
					this.getFilter()
				}
			},
			syncStatus(result) {
				result.forEach(item2 => {
					if (item2.name == '节点') {
						item2.list.forEach(item3 => {
							this.sopTypeList.forEach(item => {
								if (item.name == item3.name) {
									item.activeStatus = item3.activeStatus
								}
							})
						})
					}

				})
			},
			/**
			 * 
			 * @description sop弹框状态筛选
			 * 
			 * */
			getSubmit(result) {
				this.syncStatus(result)
				result.forEach(ev1 => {
					ev1.list.forEach(ev2 => {
						// 如果选中了，则添加数据
						if (ev2.activeStatus) {
							this.filterList.forEach(ev3 => {
								// 分组名称相同
								if (ev1.name == ev3.name) {
									ev3.list.push(ev2)
								}
							})
						} else {
							// 如果未选中，则看之前是否添加过该数据，有，则删除该数据
							this.filterList.forEach(ev3 => {
								// 分组名称相同
								if (ev1.name == ev3.name) {
									ev3.list = ev3.list.filter(ev4 => ev4.name !== ev2.name)
									ev3.list = getUnique(ev3.list, 'name')
								}
							})
						}
					})
				})
				this.getFilter()
			},
			/**
			 * @description  筛选数据
			 * */
			getFilter(type) {
				let resultList = [],
					resultGroupTask = []
				let groupTaskDataListClone = JSON.parse(JSON.stringify(this.groupTaskDataList))
				// console.log('this.filterList', this.filterList);
				if (type) { // 初始化
					this.sopTypeList.forEach(el => {
						if (el.activeStatus) {
							this.filterList.forEach(even => {
								if (even.name == '节点') {
									even.list.push(el)
								}
							})
						} else {
							this.filterList.forEach(even => {
								if (even.name == '节点') {
									even.list = even.list.filter(es => es.name !== el.name)
									even.list = getUnique(even.list, 'name')
								}
							})
						}
					})
				}

				this.filterList.forEach(ev => {
					switch (ev.name) {
						case '阶段':
							groupTaskDataListClone.forEach(en => {
								if (ev.list.length > 0) {
									ev.list.forEach(item => {
										if (en.stageId == item.stageId) {
											en['filterShow'] = true
										}
									})
								} else {
									en['filterShow'] = true
								}
							})
							break
						case '节点':
							groupTaskDataListClone.forEach(item => {
								item.nodes.forEach(es => {
									if (ev.list.length > 0) {
										ev.list.forEach(even => {
											// 验收节点特殊处理
											if (es.businessType == 1005) {
												// 施工类节点：0-未完工 1-待验收 2-待整改 3-已验收通过
												// 验收类节点：0-未验收 1-待验收 2-验收不通过 3-验收通过 
												if (es.checkStatus) {
													if (es.checkStatus == even
														.checkStatus) {
														if (![1, 2].includes(Number(even
																.checkStatus))) {
															if (es.status == even.value) {
																es['filterShow'] = true
															}
														} else {
															es['filterShow'] = true
														}
													}
												} else {
													if (even.value == 1) {
														if ([10].includes(es.status)) {
															es['filterShow'] = true
														}
													} else if (even.value ==
														2) { // 验收节点处于进行中
														if ([0].includes(es.status)) {
															es['filterShow'] = true
														}
													}
												}
											} else {
												// if (es.status == even.value) {
												// 	es['filterShow'] = true
												// }
												// 见tfs 29127
												if (even.value == 2) {
													// 进行中包含已开始、未开始(没有前置节点)
													if ([2, 0].includes(es.status)) {
														if (es.status == 0) {
															if (!es.preNodes) {
																es['filterShow'] = true
															}
														} else {
															es['filterShow'] = true
														}
													}
												} else if (even.value == 1) {
													// 等待中包含等待中，未开始(有前置节点)
													if ([1, 10].includes(es.status)) {
														if (es.status == 1) {
															if (!es.preNodes) {
																es['filterShow'] = true
															}
														} else {
															es['filterShow'] = true
														}
													}
												} else {
													if (es.status == even.value) {
														es['filterShow'] = true
													}
												}
											}
										})
									} else {
										es['filterShow'] = true
									}
								})
							})
							break
						case '六线管控':
							groupTaskDataListClone.forEach(en => {
								en.nodes.forEach(el => {
									if (ev.list.length > 0) {
										ev.list.forEach(item => {
											en.nodes.forEach(el => {
												if (el.groupNo == item.value) {
													el['groupShow'] = true
												}
											})
										})
									} else {
										el['groupShow'] = true
									}
								})
							})
							break
					}
				})
				// 过滤阶段
				groupTaskDataListClone = groupTaskDataListClone.filter(item => item.filterShow)
				// 过滤节点
				groupTaskDataListClone.forEach(item => {
					item.nodes = item.nodes.filter(item => item.filterShow)
				})
				// 过滤六线管控
				groupTaskDataListClone.forEach(item => {
					item.nodes = item.nodes.filter(item => item.groupShow)
				})
				// 过滤阶段
				groupTaskDataListClone.forEach(el => {
					if (el.nodes.length > 0) {
						resultGroupTask.push(el)
					}
				})
				this.groupTaskList = resultGroupTask
			},
			getGroupTaskShow(item) {
				item.show = !item.show
			},
			setTaskStatisticsList() {
				if (this.projectInfo.projectId && this.orderInfo.skillId) {
					this.$httpApi.getNodeStatistics({
						id: this.projectInfo.projectId,
						skillId: this.orderInfo.skillId
					}).then(res => {
						if (res) {
							this.taskStatisticsList.map(item => {
								switch (item.label) {
									case '风险':
										item.value = res.dangerNum
										break
									case '未完成':
										item.value = res.unfinishNum
										break
									case '已完成':
										item.value = res.finishNum
										break
									case '全部':
										item.value = res.allNum
										break
								}
							})
						}
					})
				}
			},
			setSorting(list) {
				// 新排序标记 1=已开始（进行中）  5=可验收，6=待审查 10=审核失败 15=已验收，待整改 20待审核 25=未开始  30=等待中  35=已完成 
				// 任务状态 0=未开始；1=(保留状态，未使用) 2=执行中 3=执行结束（完工）4=异常 5=待审查  10=等待中
				if (list.length === 0) {
					return []
				}

				function sortStatus(item) {
					switch (item.status) {
						case 0: // 未开始
							item['sorting'] = 25
							break;
						case 1: // 等待中
							item['sorting'] = 30
							break;
						case 2: // 已开始（进行中） 
							item['sorting'] = 1
							break;
						case 3: // 已完成
							item['sorting'] = 35
							break;
						case 5: // 已完成
							item['sorting'] = 6
							break;
						case 6: // 审核失败
							item['sorting'] = 10
							break;
						case 10: // 等待中
							item['sorting'] = 30
							break;
					}
				}


				list.map(item => {
					if (item.businessType == 1005) {
						// 施工类节点checkStatus：0-未完工 1-待验收 2-待整改 3-已验收通过\n验收类节点：0-未验收 1-待验收 2-验收不通过 3-验收通过\n其它类节点无效
						switch (item.checkStatus) {
							case 0:
								sortStatus(item)
								break;
							case 1:
								item['sorting'] = 5
								break;
							case 2:
								item['sorting'] = 15
								break;
							case 3:
								sortStatus(item)
								break;
							default:
								sortStatus(item)
								break
						}
					} else {
						sortStatus(item)
					}
				})
				return list.sort(this.sortArr('sorting'))
			},
			sortArr(attr) {
				return function(a, b) {
					return a[attr] - b[attr]
				}
			},
			//查询代办事项
			getToDo() {
				this.$http.get(`order/bizpending/myPending`, {
					projectId: this.projectId,
					personId: this.userPersonInfo.personId,
					size: 99,
				}).then((res) => {
					if (res) {
						this.pendingAfterList = []
						this.pendingBeforeList = []
						this.unfinishedOrderPending = []
						this.orderPending = this.setPendingSort(res.records)
						if (this.orderPending.length > 0) {
							this.orderPending.map((item, index) => {
								if (index > 4) {
									this.pendingAfterList.push(item)
								} else {
									this.pendingBeforeList.push(item)
								}
							})

							if (!this.orderPendingFalse) {
								if (this.orderPending.length > 5) {
									this.orderPending = this.pendingBeforeList
									this.orderPendingBottomShow = true
									this.orderPendingFalse = false
								} else {
									this.orderPendingBottomShow = false
								}
							}
						}
					}
				})
			},
			setPendingSort(list) {
				if (!list) {
					return []
				}
				if (list.length === 0) {
					return []
				}
				list.map(item => {
					if (Number(item.detailStatus) > 0) {
						item['sorting'] = 2
					} else {
						item['sorting'] = 1
						this.unfinishedOrderPending.push(item)
					}
				})
				return list.sort(this.sortArr('sorting'))
			},
			handleAssigenment(item, type) {
				this.$store.commit('setNodeInfo', item)
				// 距离该节点完成时间还剩多少天
				this.$remainingDays()
				// 从sop节点进入的默认为发起方
				if (!type) {
					this.$store.commit('setExamineType', '发起方')
				}
				switch (item.businessType) {
					case '1001':
						this.toPage('/pages/construction/selectMaterial/selectMaterialPage')
						break
					case '1002': // 指派工人或发布抢单
						this.toPage(`/pages/construction/middleOrder?nodeId=${item.nodeId}`)
						break
					case '1003':
						this.toPage(`/pages/construction/budget/budgetPage`)
						break
					case '1004': //施工
						this.toPage(`/pages/construction/middleConstruction`)
						break
					case '1005':
						this.toPage(`/pages/construction/middleExternalAccept`)
						break
					case '1006':
						this.toPage(
							`/pages/construction/drawings/uploadDrawings?nodeId=${item.nodeId}`
						)
						break
					case '1009':
						this.toPage('/pages/construction/evaluation/evaluationPage')
						break
					case '1010':
						this.toPage('/pages/construction/disclosure/disclosurePage')
						break
					case '1011':
						this.toPage('/pages/construction/measuringRoom/measuringRoomPage')
						break
					case '1012':
						this.toPage('/pages/construction/collection/collectionPage')
						break
					case '1015':
						// return
						uni.setStorageSync('clientBilling', 'sop开单')
						this.toPage('/pages/construction/clientBilling/clientBilling')
						break
					case '1000': // 无
						// 从sop节点进入的默认为发起方
						this.toPage(`/pages/construction/customNodes/customNodesPage`)
						break
				}
			},
			getTodoItem(el) {
				if (!el) {
					return
				}
				if (el.businessCode) {
					let parameter = el.businessCode.split('_')
					if (parameter.length > 0) {
						let typeName = parameter[0]
						let businessId = parameter[1]
						let detailsId = parameter[1]
						if (['disclose', 'discloseNotify', 'check', 'nodeReview', 'custom', 'nodeReviewFail'].includes(
								typeName)) {
							if (typeName == 'custom') {
								this.toPage(
									`/pages/construction/assignForm?toDoType=待办事项&detailId=${el.id}&status=${el.status}&pendingDetailId=${el.pendingDetailId}`
								)
								return
							}
							if (!businessId) {
								return
							}
							if (['nodeReview', 'disclose', 'nodeReviewFail', 'check'].includes(typeName)) {
								businessId = el.businessParams !== '' && JSON.parse(el.businessParams).nodeId || 0
							}
							this.$httpApi.sopNodeTemplate({
								nodeId: businessId
							}).then(res => {
								if (res) {
									this.$store.commit('setNodeInfo', res)
									switch (typeName) {
										case 'disclose':
											this.toPage(
												`/pages/construction/disclosure/viewDisclosureText?toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}&detailsId=${detailsId}`
											)
											break
										case 'discloseNotify':
											this.toPage(
												`/pages/construction/disclosure/viewDisclosureNotice?toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
											)
											break
										case 'check':
											this.$store.commit('setExamineType', '审查方')
											this.$store.commit('setTodo', {
												toDoType: '待办事项',
												bizPendingDetailId: el.pendingDetailId,
											})
											this.toPage(`/pages/construction/middleExternalAccept`)
											break
										case 'nodeReview':
											// 因为收到的待处理项需要跳转到对应的sop节点  见tfs 27794
											this.$store.commit('setExamineType', '审查方')
											let tempNode = this.nodeListData.find(item => item.nodeId ==
												businessId)
											if (tempNode) {
												this.handleAssigenment(tempNode, '审查方')
											} else {
												this.toPage(`/pages/construction/customNodes/customNodesPage`)
											}
											break
										case 'nodeReviewFail':
											// 因为收到的待处理项需要跳转到对应的sop节点  见tfs 27794
											this.$store.commit('setExamineType', '审查方')
											this.$store.commit('setBusinessCode', el.businessCode)
											let tempNodeError = this.nodeListData.find(item => item.nodeId ==
												businessId)
											if (tempNodeError) {
												this.handleAssigenment(tempNodeError, '审查方')
											} else {
												this.toPage(`/pages/construction/customNodes/customNodesPage`)
											}
											break

									}
								}
							})
						} else {
							if (['apply', 'appeal'].includes(typeName)) {
								switch (typeName) {
									case 'apply':
										uni.setStorageSync('typeName', '申请')
										break
									case 'appeal':
										uni.setStorageSync('typeName', '申述')
										break
								}
								this.toPage(
									`/pages/construction/complaint/complaintDetails?id=${businessId}&pageType=发送给我的&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
								)
							} else if (['acceptanceCorrection', 'inspectCorrection'].includes(typeName)) {
								this.toPage(
									`/pages/construction/rectification/rectificationDetails?id=${businessId}&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
								)
							}
						}
					}
				}
			},
			clickTableItem(item) {
				// 工作台进入时重置节点信息
				this.$store.commit('setNodeInfo', {})
				switch (item.name) {
					case '打卡':
						this.toPage('/pages/construction/kqAnddk/attendance')
						break
					case '服务团队':
						this.toPage('/pages/construction/assignmentDetail/common/serviceTeam')
						break
					case '施工计划':
						this.toPage('/pages/construction/constructionPlan')
						break
					case '服务日志':
						this.toPage('/pages/construction/constructionLog')
						break
					case '巡检':
						this.toPage('/pages/construction/patrolInspection/patrolIndex')
						break
					case '罚款':
					case '罚款情况':
						this.toPage('/pages/construction/punish/punishIndex')
						break
					case '变更':
						this.toPage('/pages/construction/changeRecord/changeIndex')
						break
					case '整改':
						this.toPage('/pages/construction/rectification/rectificationList')
						break
					case '工序清单':
						this.toPage('/pages/construction/processList/processList')
						break
					case '施工文件':
						this.toPage('/pages/construction/drawings/drawings')
						break
					case '申述':
						uni.setStorageSync('typeName', item.name)
						this.toPage(`/pages/construction/complaint/complaintList`)
						break
					case '申请':
						uni.setStorageSync('typeName', item.name)
						this.toPage(`/pages/construction/complaint/complaintList`)
						break
					case '停工复工':
						this.toPage(`/pages/construction/shutdownReturnWork/shutDownDetails`)
						break
					case '材料申请':
						this.toPage(`/pages/construction/bill/billPage`)
						break
					case '材料管理':
						this.toPage(
							`/pages/construction/materialManagement/materialManagementPage`
						)
						break
					case '开单':
						this.toPage('/pages/construction/clientBilling/clientBilling')
						break
					case '订单详情':
						if (this.orderInfo.orderId) {
							this.toPage(
								`/pages/orderReceiving/releaseOrderDetails?id=${this.orderInfo.orderId}&noticeType=工作台`
							)
						}
						break
					case '预算':
						this.toPage('/pages/construction/budget/budgetPage?pageType=1')
						break
					case '工地协作':
						this.toPage('/pages/construction/siteCollaboration/list')
						break
					default:
						this.$util.toast(`${item.name}`)
						break
				}
			},
			getTaskStatu(index) {
				this.taskStatusActiveIndex = index
				let tempStatus = this.taskStatusList[index].value
				let tempObject = this.taskStatusList[index]
				this.afterList = []
				this.beforeList = []
				let tempResult = JSON.parse(JSON.stringify(this.taskListResult))
				if (tempObject.businessType == 1005) {
					tempResult = tempResult.filter(item => item.businessType == 1005)
					tempResult = tempResult.filter(item => item.checkStatus == tempStatus)
					if (tempResult.length > 0) {
						this.taskList = tempResult
					} else {
						this.taskList = []
					}
				} else {
					if (tempStatus == -1) {
						this.taskList = tempResult
					} else {
						this.taskList = tempResult.filter(item => Number(item.businessType) !== 1005 && item.status ==
							tempStatus)
					}
				}

				if (this.taskList.length > 0) {
					this.taskList.map((item, index) => {
						if (index > 4) {
							this.afterList.push(item)
						} else {
							this.beforeList.push(item)
						}
					})
				}

				if (this.openListFalse) {
					this.taskList = [...this.beforeList, ...this.afterList]
					if (this.taskList.length > 5) {
						this.bottomContainShow = true
					} else {
						this.bottomContainShow = false
					}
					if (this.taskList.length > 5) {
						this.taskList = this.beforeList
						this.bottomContainShow = true
						this.openListFalse = false
					} else {
						this.bottomContainShow = false
					}
				}
			},
			getTaskToDo(index) {
				this.taskToDoActiveIndex = index
			},
			getDisclosePending() {
				this.$httpApi.todoDiscloseList({
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						// 有交底节点
						this.groupTaskDataList.forEach(el => {
							el.nodes.forEach(item => {
								if (item.businessType == '1010') {
									this.disclosePendingShow = true
								}
							})
						})
						if (res.length > 0) {
							//status 状态：1=待办，2=已办
							res.forEach(el => {
								if (el.status == 1) {
									this.disclosePendingStatus = true
								}
							})
						} else {
							this.disclosePendingStatus = false
						}
					}
				})
			}
		}
	}
</script>
