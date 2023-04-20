export function toDoPage(data){
    switch (data.nodeType) {
        case "1000":	//无类型
                this.toPage(
                            `/pages-myHome/otherForm/otherForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}`
                        )
            break;
        case "1002":	//派单
                this.toPage(
                            `/pages-myHome/distributeForm/distributeForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}`
                        )
            break;
        case "1003":	//预算
            this.toPage(
                        `/pages-myHome/estimated-cost?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}`
                    )
            break;
        case "1004":	//施工
            this.toPage(
                        `/pages-myHome/reviewNode/constructionCheck?nodeId=${data.nodeId}&reviewId=${data.reviewId}`
                    )
            break;
        case "1005":	//验收
            this.toPage(
                `/pages-myHome/reviewNode/checkReport?nodeId=${data.nodeId}&reviewId=${data.reviewId}&isDo=${true}`
                    )
            break;
        case "1006":	//上传
            this.toPage(
                        `/pages-myHome/houseUploadView?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}`
                    )
            break;
        case "1010":	//交底
            this.toPage(
                        `/pages-myHome/reviewNode/discloseReport?nodeId=${data.nodeId}&reviewId=${data.reviewId}`
                    )
            break;
        case "1011":	//量房
            this.toPage(
                        `/pages-myHome/measureForm/measureForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}`
                    )
            break;
        default:
            this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${data.reviewId}&status=2`)
            break;
    }
}