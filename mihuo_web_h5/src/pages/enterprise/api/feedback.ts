import { fetch } from '_@/axios-config/axios'


/**
 * @description 分页查询
 * */
export const bizOrderFeedbackPage = (params:any) => {
  return fetch({ url: `/order/bizorderfeedback/page`, method: 'get',params})
}


