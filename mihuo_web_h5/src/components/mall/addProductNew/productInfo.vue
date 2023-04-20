<template>
  <div class="product-info">
    <el-form
      ref="ruleForms"
      :model="state.form"
      :rules="rules"
      label-width="17rem"
      :scroll-to-error="true"
    >
      <div class="product-form">
        <div class="product-form-title">基本信息</div>
        <el-form-item label="封面图" prop="coverImg">
          <uploadImage
            v-model="state.form.coverImg"
            :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item
          v-if="state.form.materialFlag == 0"
          label="商品相册"
          prop="albumPics"
        >
          <uploadProduct
            v-model="state.form.albumPics"
            :max-count="5"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item label="是否商城材料">
          <el-switch
            v-model="state.form.materialFlag"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="state.form.name" placeholder="请输入商品(服务/套餐/优惠券/预付款)名称" />
        </el-form-item>
        <el-form-item label="分享名称" prop="subTitle">
          <el-input v-model="state.form.subTitle" maxlength="20" placeholder="请输入商品(服务/套餐/优惠券/预付款)分享名称" />
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
          <el-select
            v-model="state.form.brandId"
            filterable
            placeholder="请选择品牌"
            @change="handleProductChange('选择品牌')"
          >
            <el-option
              v-for="(item, index) in state.brandList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产地" prop="">
          <el-input v-model="state.form.site" />
        </el-form-item>
        <el-form-item label="商品介绍" prop="description">
          <el-input
            v-model="state.form.description"
            :auto-size="true"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="商品分类(平台)" prop="platformCategoryId">
          <el-cascader
            v-model="state.form.platformCategoryId"
            :options="state.platformCategoryList"
            :props="state.defaultProps"
            @change="handleProductChange('平台分类')"
          />
        </el-form-item>
        <el-form-item
          v-if="protType == 2"
          label="商品分类(企业)"
          prop="productCategoryId"
        >
          <el-cascader
            v-model="state.form.productCategoryId"
            :options="state.productCategoryList"
            :props="state.defaultProps"
            @change="handleProductChange('企业分类')"
          />
        </el-form-item>
        <el-form-item label="分类" prop="customCategory">
          <el-select
            v-model="state.form.customCategory"
            placeholder="请选择分类"
            @change="handleProductChange('分类',$event)"
          >
            <el-option
              v-for="(item, index) in state.typeList"
              :key="index"
              :label="item.typeName"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <!-- type=1001商品，type=1002服务、type=1003服务包 -->
        <el-form-item
          v-if="state.form.customCategory === '1001'"
          label="运费模版"
          prop="freightTemplateId"
        >
          <el-select v-model="state.form.freightTemplateId">
            <el-option
              v-for="item in state.freightTemplateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="state.form.customCategory === '1001'"
          label="入户/安装费模版"
          prop="freightInstallationTemplateId"
        >
          <el-select v-model="state.form.freightInstallationTemplateId">
            <el-option
              v-for="item in state.installationTemplateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId"
            />
          </el-select>
        </el-form-item>
        <!-- 服务的交付方式 -->
        <el-form-item
          v-if="state.form.customCategory === '1002'"
          label="交付方式"
          prop="deliveryType"
        >
          <el-select
            v-model="state.form.deliveryType"
            filterable
            placeholder="请选择交付方式"
          >
            <el-option
              v-for="(item, index) in state.deliveryTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 套餐的交付方式 -->
        <el-form-item
          v-if="state.form.customCategory == '1003'"
          label="交付方式"
          prop="deliveryType"
        >
          <el-select
            v-model="state.form.deliveryType"
            filterable
            placeholder="请选择交付方式"
          >
            <el-option
              v-for="(item, index) in state.metMealTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="state.form.customCategory == '1002' || state.form.customCategory == '1003' ||
            (state.form.deliveryType === 0 &&
              state.form.customCategory == '1003')"
          label="所需工种"
          prop="skillType"
        >
          <el-select
            v-model="state.form.skillType"
            placeholder="请选择工种"
            @change="handleProductChange('选择工种')"
          >
            <el-option
              v-for="(item, index) in state.skillTypeList"
              :key="index"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="state.form.customCategory == '1002'"
          label="抽佣比率"
          prop="periodRatio"
        >
          <el-input
            v-model="state.form.periodRatio"
            placeholder="抽佣比率最大为1，既100%"
            type="number"
            :min="0"
            :max="1"
          />
        </el-form-item>
        <el-form-item
          v-if="state.form.deliveryType === 1 && state.form.customCategory != '1001'"
          label="sop模板"
          prop="sopTemplateId"
        >
          <el-select
            v-model="state.form.sopTemplateId"
            placeholder="请选择sop模板"
          >
            <el-option
              v-for="(item, index) in state.sopTemplateList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="state.form.sort" />
        </el-form-item>
      </div>
      <div class="product-form">
        <div class="product-form-title">价格信息</div>
        <el-form-item label="商品货号" prop="productSn">
          <el-input v-model="state.form.productSn" />
        </el-form-item>
        <el-form-item label="采购价" prop="price">
          <el-input
            v-model="state.form.purchasePrice"
            disabled
            type="number"
            style="width: 19rem"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="price">
          <el-input
            v-model="state.form.price"
            type="number"
            style="width: 19rem"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="内部价" prop="innerPrice">
          <el-input
            v-model="state.form.innerPrice"
            type="number"
            style="width: 19rem"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低价格" prop="minAmount">
          <el-input
            v-model="state.form.minAmount"
            type="number"
            style="width: 19rem"
            @change="changeAmount"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低价格说明" prop="minAmountDescription">
          <el-input
            v-model="state.form.minAmountDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory === '1001'" label="定额说明" prop="quoteDescription">
          <el-input
            v-model="state.form.quoteDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory === '1001'" label="发货说明" prop="deliveryDescription">
          <el-input
            v-model="state.form.deliveryDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory === '1001'" label="退货说明" prop="refundDescription">
          <el-input
            v-model="state.form.refundDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory === '1001'" label="配置说明" prop="configuration">
          <el-input
            v-model="state.form.configuration"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory !== '1001'" label="适用说明" prop="applicable">
          <el-input
            v-model="state.form.applicable"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory !== '1001'" label="发包说明" prop="issueDescription">
          <el-input
            v-model="state.form.issueDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory !== '1001'" label="工时说明" prop="hoursDescription">
          <el-input
            v-model="state.form.hoursDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory !== '1001'" label="计费说明" prop="billingDescription">
          <el-input
            v-model="state.form.billingDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item v-if="state.form.customCategory !== '1001'" label="结算说明" prop="settlementDescription">
          <el-input
            v-model="state.form.settlementDescription"
            type="textarea"
            autosize
            :row="5"
          />
        </el-form-item>
        <el-form-item label="市场价">
          <el-input
            v-model="state.form.originalPrice"
            type="number"
            style="width: 19rem"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input
            v-model="state.form.stock"
            disabled
            type="number"
            style="width: 19rem"
          />
        </el-form-item>
        <el-form-item label="商品销量">
          <el-input
            v-model="state.form.sale"
            type="number"
            style="width: 19rem"
          />
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model="state.form.unit" style="width: 19rem" />
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input
            v-model="state.form.weight"
            type="number"
            style="width: 19rem"
          >
            <template #append>kg</template>
          </el-input>
          <!--        <span style="margin-left: 20px">克</span>-->
        </el-form-item>
        <!--        <el-form-item v-if="protType == 2" label="是否需要测量">-->
        <!--          <el-switch-->
        <!--            v-model="state.form.measureFlag"-->
        <!--            :active-value="1"-->
        <!--            :inactive-value="0"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <!--        <div v-if="state.form.measureFlag == 1">-->
        <!--          <div v-for="(item, index) in state.form.templateJson" :key="item.id">-->
        <!--            <el-form-item-->
        <!--              :label="`第${index + 1}次测量问卷`"-->
        <!--              :prop="`templateJson.${index}.templateId`"-->
        <!--              :rules="[-->
        <!--                {-->
        <!--                  required: true,-->
        <!--                  message: `请选择第${index + 1}次测量问卷`,-->
        <!--                  trigger: 'blur'-->
        <!--                }-->
        <!--              ]"-->
        <!--            >-->
        <!--              <ques-select-->
        <!--                v-model="item.templateId"-->
        <!--                @change="changeQues(`templateJson.${index}.templateId`)"-->
        <!--              />-->
        <!--              <el-button-->
        <!--                v-if="state.form.templateJson.length > 1"-->
        <!--                icon="delete"-->
        <!--                style="margin-left: 1rem"-->
        <!--                type="text"-->
        <!--                class="danger"-->
        <!--                @click="deleteTemplateItem(index)"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--            <el-form-item v-if="index + 1 == state.form.templateJson.length">-->
        <!--              <el-button-->
        <!--                icon="plus"-->
        <!--                type="text"-->
        <!--                @click="addTemplateList"-->
        <!--              >添加-->
        <!--              </el-button>-->
        <!--            </el-form-item>-->
        <!--          </div>-->
        <!--        </div>-->
        <el-form-item label="是否需要安装">
          <el-switch
            v-model="state.form.installFlag"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item v-if="protType == 2" label="默认供应商">
          <el-select
            v-model="state.form.supplierId"
            filterable
            @change="handleProductChange('选择供应商')"
          >
            <el-option
              v-for="(item, index) in state.supplierList"
              :key="index"
              :label="item.supplierName"
              :value="item.supplierCompanyId"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="product-form">
        <div class="product-form-title">分期付款</div>
        <el-form-item label="是否分期付款">
          <el-switch
            v-model="state.form.payStagesEnable"
            :active-value="1"
            :inactive-value="0"
          />
          <el-button
            v-if="state.form.payStagesEnable === 1"
            type="primary"
            icon="plus"
            style="margin-left: 1rem;"
            @click="addPayStage"
          >
            新增阶段
          </el-button>
        </el-form-item>
        <el-table
          v-if="state.form.payStagesEnable === 1 && state.form.payStages.length > 0"
          border
          :data="state.form.payStages"
          style="width: 70vw; margin-top: 1rem; margin-left: 4rem;"
        >
          <el-table-column
            label="名称"
            prop="name"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-form-item
                label-width="0"
                prop="name"
              >
                <el-input
                  v-model="scope.row.name"
                  placeholder="请输入阶段名称"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="分期方式"
            prop="type"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-form-item v-if="scope.row.finalType !== 1" label-width="0" prop="type">
                <el-select
                  v-model="scope.row.type"
                  placeholder="请选择阶段类型"
                >
                  <el-option
                    label="定额"
                    :value="0"
                  />
                  <el-option
                    label="百分比"
                    :value="1"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="金额"
            prop="amount"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-form-item
                v-if="scope.row.type === 0 && scope.row.finalType !== 1"
                label-width="0"
                prop="amount"
              >
                <el-input
                  v-model="scope.row.amount"
                  type="number"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="比例"
            prop="ratio"
            align="center"
            width="300"
          >
            <template #default="scope">
              <el-form-item
                v-if="scope.row.type === 1"
                label-width="0"
                prop="ratio"
              >
                <el-input
                  v-model="scope.row.ratio"
                  type="number"
                  placeholder="请输入0～100范围内的数字"
                >
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="是否是尾款"
            prop="finalType"
            align="center"
            width="100"
          >
            <template #default="scope">
              <el-form-item prop="finalType" label-width="2.5rem">
                <el-switch
                  v-model="scope.row.finalType"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="text"
                size="mini"
                class="danger"
                icon="delete"
                @click="deletePayStage(scope.$index, scope.row.id)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="product-form">
        <div class="product-form-title">规格型号</div>
        <el-form-item label="属性类型" prop="productAttributeCategoryId">
          <el-select
            v-model="state.form.productAttributeCategoryId"
            placeholder="请选择属性类型"
            filterable
            @change="handleProductChange('选择属性')"
          >
            <el-option
              v-for="item in state.commodityTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="state.form.productAttributeCategoryId"
          label="商品规格"
          prop="skuStockList"
        >
          <div style="padding-top: 1rem">
            <div
              v-for="(productAttr, idx) in state.selectProductAttr"
              :key="idx"
            >
              <span>{{ productAttr.name }}：</span>
              <el-checkbox-group
                v-if="productAttr.handAddStatus === 0"
                v-model="state.selectProductAttr[idx].values"
              >
                <el-checkbox
                  v-for="item in getInputListArr(productAttr.inputList)"
                  :key="item"
                  :label="item"
                  class="littleMarginLeft"
                />
              </el-checkbox-group>
              <div v-else>
                <el-checkbox-group
                  v-model="state.selectProductAttr[idx].values"
                >
                  <div
                    style="
                      width: auto;
                      display: flex;
                      flex-wrap: wrap;
                      align-items: center;
                    "
                  >
                    <div
                      v-for="(item, index) in state.selectProductAttr[idx]
                        .options"
                      :key="index"
                      style="
                        display: flex;
                        align-items: center;
                        margin-left: 1rem;
                        margin-bottom: 1rem;
                      "
                    >
                      <el-checkbox :key="item" :label="item" />
                      <el-button
                        type="text"
                        class="danger"
                        icon="delete"
                        style="margin-left: 1rem; margin-top: 0"
                        @click="handleRemoveProductAttrValue(idx, index)"
                      />
                    </div>
                  </div>
                </el-checkbox-group>
                <el-input
                  v-model="state.selectProductAttr[idx].addProductAttrValue"
                  style="width: 19rem; margin-left: 10px"
                  clearable
                />
                <el-button
                  class="littleMarginLeft"
                  @click="handleAddProductAttrValue(idx)"
                >增加</el-button>
              </div>
            </div>
          </div>

          <div style="width: 100%; display: flex">
            <div style="width: 100%; flex: 1; text-align: right">
              <el-button
                type="primary"
                style="margin-top: 20px"
                @click="handleRefreshProductSkuList"
              >刷新列表
              </el-button>
              <el-button
                type="primary"
                style="margin-top: 20px"
                @click="handleSyncProductSkuPrice"
              >同步价格
              </el-button>
              <el-button
                type="primary"
                style="margin-top: 20px"
                @click="handleSyncProductSkuStock"
              >同步库存
              </el-button>
            </div>
          </div>

          <el-table
            stripe
            style="
              width: 100vw;
              margin-top: 20px;
              height: 40rem !important;
              max-height: 50rem !important;
            "
            :data="state.form.skuStockList"
            height="auto"
            border
          >
            <el-table-column
              v-for="(item, index) in state.selectProductAttr"
              :key="item.id"
              :label="item.name"
              align="center"
              width="200"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row['key' + (index + 1)]"
                  style="max-width: 15rem"
                  readonly
                />
              </template>
            </el-table-column>
            <el-table-column label="内部价" width="180" align="center">
              <template #default="scope">
                <el-form-item
                  :prop="`skuStockList[${scope.$index}].innerPrice`"
                  :rules="[{ required: true, message: '', trigger: 'blur' }]"
                  style="margin: 0 !important"
                >
                  <el-input
                    v-model="scope.row.innerPrice"
                    type="tel"
                    oninput="value=value.replace(/[^0-9.]/g, '')"
                    style="max-width: 14rem"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="销售价格" width="180" align="center">
              <template #default="scope">
                <el-form-item
                  :prop="`skuStockList[${scope.$index}].price`"
                  :rules="[{ required: true, message: '', trigger: 'blur' }]"
                  style="margin: 0 !important"
                >
                  <el-input
                    v-model="scope.row.price"
                    type="tel"
                    oninput="value=value.replace(/[^0-9.]/g, '')"
                    style="max-width: 14rem"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="结算价" width="180" align="center">
              <template #default="scope">
                <el-form-item
                  :prop="`skuStockList[${scope.$index}].billPrice`"
                  :rules="[{ required: false, message: '', trigger: 'blur' }]"
                  style="margin: 0 !important"
                >
                  <el-input
                    v-model="scope.row.billPrice"
                    type="tel"
                    oninput="value=value.replace(/[^0-9.]/g, '')"
                    style="max-width: 14rem"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="商品库存" width="180" align="center">
              <template #default="scope">
                <input
                  v-model="scope.row.stock"
                  type="tel"
                  oninput="value=value.replace(/[^0-9.]/g, '')"
                  class="inputStyle"
                >
              </template>
            </el-table-column>
            <el-table-column label="库存预警值" width="180" align="center">
              <template #default="scope">
                <input
                  v-model="scope.row.lowStock"
                  type="tel"
                  oninput="value=value.replace(/[^0-9.]/g, '')"
                  class="inputStyle"
                >
              </template>
            </el-table-column>
            <el-table-column label="转换系数" align="center" width="180">
              <template #default="scope">
                <input
                  v-model="scope.row.convertValue"
                  type="number"
                  class="inputStyle"
                >
              </template>
            </el-table-column>
            <el-table-column label="SKU编号" width="180" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.skuCode"
                  disabled
                  style="max-width: 15rem"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-if="scope.$index !== state.form.skuStockList.length - 1"
                  icon="Bottom"
                  type="text"
                  @click="bubbleSku(scope.$index, scope.row, 1)"
                />
                <el-button
                  v-if="scope.$index !== 0"
                  icon="Top"
                  type="text"
                  @click="bubbleSku(scope.$index, scope.row, 2)"
                />
                <el-button
                  type="text"
                  icon="delete"
                  class="danger"
                  @click="handleRemoveProductSku(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>

      <div v-if="state.form.pmsProductAttributeParam?.length" class="product-form">
        <div class="product-form-title">商品参数</div>
        <div v-for="(item,index) in state.form.pmsProductAttributeParam" :key="index">
          <div v-if="item.inputType===1">
            <el-form-item v-if="item.selectType===1" :label="item.name" prop="">
              <el-select v-model="state.form.pmsProductAttributeParam[index].value">
                <el-option
                  v-for="item in getParamInputList(item.inputList)"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.selectType===2" :label="item.name" prop="">
              <el-select
                v-model="state.form.pmsProductAttributeParam[index].value"
                :multiple="true"
              >
                <el-option
                  v-for="item in getParamInputList(item.inputList)"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item v-else :label="item.name" prop="">
            <el-input v-model="state.form.pmsProductAttributeParam[index].value" />
          </el-form-item>
        </div>
      </div>

      <div class="product-form">
        <div class="product-form-title">商品促销</div>
        <el-form-item label="赠送积分">
          <el-input v-model="state.form.giftPoint" />
        </el-form-item>
        <el-form-item label="赠送成长值">
          <el-input v-model="state.form.giftGrowth" />
        </el-form-item>
        <el-form-item label="积分购买限制">
          <el-input v-model="state.form.usePointLimit" />
        </el-form-item>

        <el-form-item label="预告商品">
          <el-switch
            v-model="state.form.previewStatus"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item label="商品推荐">
          <span style="margin-right: 10px">新品</span>
          <el-switch
            v-model="state.form.newStatus"
            :active-value="1"
            :inactive-value="0"
          />
          <span style="margin-left: 4rem; margin-right: 1rem">推荐</span>
          <el-switch
            v-model="state.form.recommandStatus"
            :active-value="1"
            :inactive-value="0"
          />
          <span style="margin-left: 4rem; margin-right: 1rem">热卖</span>
          <el-switch
            v-model="state.form.hotsaleStatus"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item label="商品标签名称">
          <el-select
            v-model="state.form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入商品标签名称"
            @change="changeTag"
          >
            <el-option
              v-for="item in state.tagOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品关键字">
          <el-select
            v-model="state.form.keywords"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入可选关键字"
            @remove-tag="removeKeywordTag"
          >
            <el-option
              v-for="item in state.inputOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品备注">
          <el-input
            v-model="state.form.note"
            type="textarea"
            :auto-size="true"
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- 视频预览 -->
    <videoPlay
      :props-src="state.option.src"
      :dialog-status="state.videoPlayStatus"
      @getClose="state.videoPlayStatus = false"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  defineProps,
  defineEmits,
  defineExpose,
  watchEffect,
  watch,
  inject
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { templateGetList } from '_@/api/basicConfig'
import { FlagManager } from '@antv/x6/lib/view/flag'

const props = defineProps({
  modelValue: {
    type: Object,
    default: {}
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['getData'])

const ruleForms = ref<any>('')
const route = useRoute()
const protType = inject('protType')

// 新增分期支付阶段
const addPayStage = () => {
  state.form.payStages.push({
    type: 0, // 0 = 定额 1 = 百分比
    ratio: null, // 比例
    amount: null, // 金额
    finalType: 0, // 是否尾款 0 = 否 1 = 是
    name: '' // 阶段名称
  })
}

// 删除分期付款阶段
const deletePayStage = (index: number, id: any) => {
  state.form.payStages.splice(index, 1)
}

const state = reactive({
  originalKeyWords: [],
  originalTags: [],
  list: [] as any,
  tagOptions: [],
  inputOptions: [] as any,
  option: {} as any,
  videoPlayStatus: false,
  sopTemplateList: [],
  // 编辑模式时是否初始化成功
  hasEditCreated: false,
  selectProductParam: [], // 选中的商品参数
  selectProductAttrPics: [], // 选中的商品属性图片
  addProductAttrValue: '', // 可手动添加的商品属性
  selectProductAttr: [
    // 选中的商品属性
    {
      id: '',
      name: '',
      handAddStatus: '',
      inputList: [],
      values: [],
      options: [] as any,
      addProductAttrValue: ''
    }
  ] as any,
  productAttrStatus: true, // 商品属性
  surveyTemplateList: [], // 问卷模板list
  commodityTypeList: [], // 商品属性类型
  supplierList: [] as any, // 供应商list
  brandList: [] as any, // 品牌list
  platformCategoryList: [], // 商品平台分类list
  productCategoryList: [], // 商品企业分类list
  skillTypeList: [] as any, // 工种list
  typeList: inject('productType'), // 材料类型
  defaultProps: {
    children: 'children',
    label: 'name',
    value: 'id'
  },
  form: props.modelValue as any,
  deliveryTypeList: inject('deliveryType'), // 交互方式
  metMealTypeList: [
    { name: 'sop交付', id: 1 }
  ],
  installationTemplateList: [], // 入户/安装费模版列表
  freightTemplateList: [] // 运费模版列表
})

// 如果用户输入空值则给后端传个默认值0
const changeAmount = (val:any) => {
  if (!val) {
    state.form.minAmount = 0
  }
}

const changeTag = (val:any) => {
  state.tagOptions = val
  state.list = [] as any
  state.list = [...state.originalKeyWords, ...val.slice(state.originalTags.length, val.length)]
  state.form.keywords = state.inputOptions = [...new Set(state.list)]
}

// 点击不可移除标签里添加的
const removeKeywordTag = (val:any) => {
  state.form.tags.forEach((item:any) => {
    if (val == item) {
      let list = [] as any
      list = [...state.list, ...state.originalKeyWords]
      state.form.keywords = state.inputOptions = [...new Set(list)]
    }
  })
}

const getTemplates = async () => {
  await fetch({
    url: '/mall/pmsFreightTemplate/page',
    method: 'get',
    params: {
      size: 99
    }
  }).then((res: any) => {
    state.freightTemplateList = res.data && res.data.records
  })

  await fetch({
    url: '/mall/pmsFreightInstallationTemplate/page',
    method: 'get',
    params: {
      size: 99
    }
  }).then((res: any) => {
    state.installationTemplateList = res.data && res.data.records
  })
}

const rules = reactive({
  productAttributeCategoryId: [
    { required: true, message: '请选择商品属性', trigger: 'change' }
  ],
  skuStockList: [
    { required: true, message: '请选择或输入商品sku', trigger: 'change' }
  ],
  productCategoryId: [
    { required: true, message: '请选择商品企业分类', trigger: 'change' }
  ],
  albumPics: [{ required: true, message: '请添加商品相册', trigger: 'blur' }],
  bannerImg: [{ required: true, message: '请添加banner图', trigger: 'blur' }],
  coverImg: [{ required: true, message: '请添加封面图', trigger: 'blur' }],
  detailDesc: [{ required: true, message: '详细页描述必填', trigger: 'blur' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  customCategory: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  platformCategoryId: [
    { required: true, message: '请选择商品平台分类', trigger: 'change' }
  ],
  servicePackList: [
    { required: true, message: '请选择商品及sku', trigger: 'blur' }
  ],
  deliveryType: [
    { required: true, message: '请选择交付方式', trigger: 'blur' }
  ],
  periodRatio: [
    { required: true, message: '请输入抽佣比率', trigger: 'blur' }
  ],
  sopTemplateId: [
    { required: true, message: '请选择sop模板', trigger: 'blur' }
  ],
  skillType: [{ required: true, message: '请选择工种', trigger: 'blur' }],
  brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }],
  description: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
  productSn: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  price: [{ required: true, message: '售价必填', trigger: 'blur' }],
  innerPrice: [{ required: true, message: '内部价必填', trigger: 'blur' }],
  unit: [{ required: true, message: '单位必填', trigger: 'blur' }]
  // freightTemplateId: [
  //   { required: true, message: '请选择运费模版', trigger: 'blur' }
  // ],
  // freightInstallationTemplateId: [
  //   { required: true, message: '请选择入户/安装费模版', trigger: 'blur' }
  // ]
})

watch(
  () => state.form.coverImg,
  () => {
    ruleForms.value.validateField('coverImg')
  }
)
watch(
  () => state.form.albumPics,
  () => {
    ruleForms.value.validateField('albumPics')
  }
)
watch(
  () => state.form.skuStockList,
  () => {
    ruleForms.value.validateField('skuStockList')
  }
)

const changeQues = (data: any) => {
  ruleForms.value.validateField(data, (valid: boolean) => {})
}

// 商品change事件
const handleProductChange = (val: any, e: any = '') => {
  switch (val) {
    case '平台分类':
      state.platformCategoryList.forEach((item: any) => {
        if (item.id === state.form.platformCategoryId[0]) {
          state.form.type = item.treeCode.split('-')[0]
        }
      })
      state.form.platformCategoryId =
        state.form.platformCategoryId[state.form.platformCategoryId.length - 1]
      getCateNameById(
        state.form.platformCategoryId,
        state.platformCategoryList,
        'platformCategoryName',
        'platformTreeCode'
      )
      break
    case '企业分类':
      state.form.productCategoryId =
        state.form.productCategoryId[state.form.productCategoryId.length - 1]
      getCateNameById(
        state.form.productCategoryId,
        state.productCategoryList,
        'productCategoryName',
        'treeCode'
      )
      break
    case '选择品牌':
      for (let i = 0; i < state.brandList.length; i++) {
        if (state.brandList[i].id == state.form.brandId) {
          state.form.brandName = state.brandList[i].name
          break
        }
      }
      break
    case '选择工种':
      for (let i = 0; i < state.skillTypeList.length; i++) {
        if (state.skillTypeList[i].skillId == state.form.skillType) {
          state.form.skillTypeName = state.skillTypeList[i].skillName
          break
        }
      }
      break
    case '选择供应商':
      for (let i = 0; i < state.supplierList.length; i++) {
        if (state.supplierList[i].supplierCompanyId == state.form.supplierId) {
          state.form.supplierName = state.supplierList[i].name
          break
        }
      }
      break
    case '选择属性':
      state.productAttrStatus = false
      getProductAttrList(0)
      getProductAttrList(1)
      state.form.skuStockList = [] as any
      break
    case '分类':
      // 套餐模式下，支付方式只能选择sop交互
      if (e == 1003) {
        state.form.deliveryType = 1
      } else {
        state.form.deliveryType = null
      }
  }
}

// 添加测量问卷
const addTemplateList = () => {
  state.form.templateJson.push({
    templateId: '' as any
  })
}

// 删除测量问卷
const deleteTemplateItem = (index: any) => {
  state.form.templateJson.splice(index, 1)
}

// 冒泡排序
const bubbleSku = (index: any, row: any, type: any) => {
  if (type === 1) {
    state.form.skuStockList[index]['sort']++
    state.form.skuStockList[index + 1]['sort']--
  }
  if (type === 2) {
    state.form.skuStockList[index]['sort']--
    state.form.skuStockList[index - 1]['sort']++
  }
  const arr: any = state.form.skuStockList
  let l: any = arr.length
  while (l) {
    for (let j = 0; j < l; j++) {
      var left = arr[j]['sort'] as any
      var right = arr[j + 1]['sort'] as any
      var leftData = arr[j]
      var rightData = arr[j + 1]
      if (left > right) {
        arr[j] = rightData
        arr[j + 1] = leftData
      }
    }
    l--
  }
  state.form.skuStockList = JSON.parse(JSON.stringify(arr))
}

const hasAttrPic = () => {
  return state.selectProductAttrPics.length >= 1
}

// 添加属性值
const handleAddProductAttrValue = (idx: any) => {
  // state.selectProductAttr.forEach((res: any) => {
  //   res.values = []
  // })
  const options: any = state.selectProductAttr[idx].options
  state.selectProductAttr[idx].addProductAttrValue = state.selectProductAttr[
    idx
  ].addProductAttrValue?.replaceAll(/[\t]*/g, '')
  if (!state.selectProductAttr[idx].addProductAttrValue) {
    ElMessage.warning({
      message: '属性值不能为空',
      type: 'warning'
    })
    return
  }
  if (
    options.indexOf(state.selectProductAttr[idx].addProductAttrValue) !== -1
  ) {
    ElMessage.warning({
      message: '属性值不能重复',
      type: 'warning'
    })
    return
  }
  state.selectProductAttr[idx].options.push(
    state.selectProductAttr[idx].addProductAttrValue
  )

  state.selectProductAttr[idx].addProductAttrValue = ''
}

// 删除属性值
const handleRemoveProductAttrValue = (idx: number, index: number) => {
  state.selectProductAttr[idx].options.splice(index, 1)
  // 选中的值value数组，存在的值option数组， 两个数组对比，去掉其中一个数组中没有的元素
  state.selectProductAttr[idx].values = state.selectProductAttr[
    idx
  ].values.filter((item: any) =>
    state.selectProductAttr[idx].options.includes(item)
  )
}

// 删除sku
const handleRemoveProductSku = (index: any, row: any) => {
  const list = state.form.skuStockList
  if (list.length === 1) {
    list.pop()
  } else {
    list.splice(index, 1)
  }
}

// 完成保存的事件
const handleFinishCommit = (callback: any) => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      var skuStockList: any = state.form.skuStockList
      skuStockList.forEach((res: any) => {
        var spData: any = JSON.parse(res.spData).spData
          ? JSON.parse(res.spData).spData
          : JSON.parse(res.spData)
        spData.forEach((res2: any, index: any) => {
          if (index + 1 <= state.selectProductAttr.length) {
            res2['value'] = res['key' + (index + 1)]
          } else {
            spData.splice(index, spData.length)
          }
        })
        res.spData = JSON.stringify(spData)
      })
      mergeProductAttrValue()
      setTimeout(() => {
        callback(true)
      }, 300)
    } else {
      callback(false)
    }
  })
}

const getInputListArr = (inputList: any) => {
  return inputList ? inputList.split(',') : inputList
}

const getParamInputList = (inputList: any) => {
  return inputList.split(',')
}

// 合并商品属性
const mergeProductAttrValue = () => {
  state.form.productAttributeValueList = []
  state.form.pmsProductAttributeParam = []
  for (let i = 0; i < state.selectProductAttr.length; i++) {
    const attr: any = state.selectProductAttr[i]
    if (
      attr.handAddStatus === 1 &&
      attr.options != null &&
      attr.options.length > 0
    ) {
      const list = {
        productAttributeId: attr.id,
        value: getOptionStr(attr.options)
      }
      state.form.productAttributeValueList.push(list)
    }
  }
  for (let i = 0; i < state.selectProductParam.length; i++) {
    const param: any = state.selectProductParam[i]
    const list2 = {
      productAttributeId: param.id,
      value: param.value?.toString()
    }
    state.form.productAttributeValueList.push(list2)
    state.form.pmsProductAttributeParam.push(param)
  }
}

const getOptionStr = (arr: any) => {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += arr[i]
    if (i != arr.length - 1) {
      str += ','
    }
  }
  return str
}

// 设置sku相关
const getProductAttrList = async (type: number) => {
  await fetch({
    url: `/mall/productattribute/list/${state.form.productAttributeCategoryId}/${type}`,
    method: 'get'
  }).then((res: any) => {
    const list = res.data
    if (type === 0) {
      var selectProductAttr = []
      for (let i = 0; i < list.length; i++) {
        var options = []
        var values = []
        if (
          (props.isEdit && state.productAttrStatus) ||
          state.form.skuStockList?.length > 0
        ) {
          if (list[i].handAddStatus === 1) {
            // console.log(getEditAttrOptions(list[i].id))
            // 编辑状态下获取手动添加编辑属性
            options = getEditAttrOptions(list[i].id) as any
          }
          // 编辑状态下获取选中属性
          values = getEditAttrValues(i) as any
        }

        selectProductAttr.push({
          id: list[i].id,
          name: list[i].name,
          handAddStatus: list[i].handAddStatus,
          inputList: list[i].inputList,
          // values: Array.from(new Set([...options,...values])),
          values: values,
          options: Array.from(new Set([...options, ...values])) as any
        })
      }
      state.selectProductAttr = selectProductAttr as any
    } else {
      var selectProductParam = []
      for (let i = 0; i < list.length; i++) {
        let value = []
        if (props.isEdit) {
          // 编辑模式下获取参数属性
          value = getEditParamValue(list[i].id)
        }
        selectProductParam.push({
          id: list[i].id,
          name: list[i].name,
          value: list[i].selectType == 2 ? value?.split(',') : value,
          inputType: list[i].inputType,
          inputList: list[i].inputList,
          searchType: list[i].searchType,
          selectType: list[i].selectType,
          filterType: list[i].filterType,
          handAddStatus: list[i].handAddStatus,
          relatedStatus: list[i].relatedStatus,
          showStatus: list[i].showStatus,
          sort: list[i].sort,
          type: list[i].type,
          productAttributeCategoryId: list[i].productAttributeCategoryId
        })
      }
      state.form.pmsProductAttributeParam = state.selectProductParam = selectProductParam as any
    }
  })
}

// 获取属性的值
const getEditParamValue = (id: any) => {
  for (let i = 0; i < state.form.productAttributeValueList.length; i++) {
    if (id === state.form.productAttributeValueList[i].productAttributeId) {
      return state.form.productAttributeValueList[i].value
    }
  }
}

// 获取设置的可手动添加属性值
const getEditAttrOptions = (id: any) => {
  const options = []
  for (let i = 0; i < state.form.productAttributeValueList.length; i++) {
    const attrValue = state.form.productAttributeValueList[i]
    if (attrValue.productAttributeId === id) {
      const strArr = attrValue.value.split(',')
      for (let j = 0; j < strArr.length; j++) {
        options.push(strArr[j].replaceAll(/[\t]*/g, ''))
      }
      break
    }
  }
  return options
}

// 获取选中的属性值
const getEditAttrValues = (index: any) => {
  var values = new Set()
  if (index === 0) {
    for (let i = 0; i < state.form.skuStockList.length; i++) {
      var sku = state.form.skuStockList[i]
      var spData = JSON.parse(sku.spData)
      if (spData != null && spData.length >= 1) {
        values.add(spData[0].value.replaceAll(/[\t]*/g, ''))
      }
    }
  } else if (index === 1) {
    for (let i = 0; i < state.form.skuStockList.length; i++) {
      var sku = state.form.skuStockList[i]
      var spData = JSON.parse(sku.spData)
      if (spData != null && spData.length >= 2) {
        values.add(spData[1].value.replaceAll(/[\t]*/g, ''))
      }
    }
  } else {
    for (let i = 0; i < state.form.skuStockList.length; i++) {
      var sku = state.form.skuStockList[i]
      var spData = JSON.parse(sku.spData)
      if (spData != null && spData.length >= 3) {
        values.add(spData[2].value.replaceAll(/[\t]*/g, ''))
      }
    }
  }
  return Array.from(values)
}

const handleRefreshProductSkuList = () => {
  ElMessageBox.confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    refreshProductSkuList()
  })
}

const handleSyncProductSkuPrice = () => {
  ElMessageBox.confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (
      state.form.skuStockList !== null &&
      state.form.skuStockList.length > 0
    ) {
      const tempSkuList = state.form.skuStockList
      const price = state.form.skuStockList[0].price
      for (let i = 0; i < tempSkuList.length; i++) {
        tempSkuList[i].price = price
        tempSkuList[i].innerPrice = state.form.skuStockList[0].innerPrice
      }
      state.form.skuStockList = []
      state.form.skuStockList = state.form.skuStockList.concat(
        state.form.skuStockList,
        tempSkuList
      )
    }
  })
}

const handleSyncProductSkuStock = () => {
  ElMessageBox.confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (
      state.form.skuStockList !== null &&
      state.form.skuStockList.length > 0
    ) {
      // let tempSkuList = []
      const tempSkuList = state.form.skuStockList
      const stock = state.form.skuStockList[0].stock
      const lowStock = state.form.skuStockList[0].lowStock
      for (let i = 0; i < tempSkuList.length; i++) {
        tempSkuList[i].stock = stock
        tempSkuList[i].lowStock = lowStock
      }
      state.form.skuStockList = []
      state.form.skuStockList = state.form.skuStockList.concat(
        state.form.skuStockList,
        tempSkuList
      )
    }
  })
}

const getProductSkuSp = (row: any, index: number) => {
  const spData = JSON.parse(row.spData)
  if (spData != null && index < spData.length) {
    return spData[index].value
  } else {
    return null
  }
}

// 和原sku数据做比较 data:原数据，val:比较的值
const compareData = (val: any, data: any) => {
  let a: any = { spData: JSON.stringify(val), convertValue: 1 }
  val.forEach((res: any, index: any) => {
    a[`key${index + 1}`] = res.value
  })
  data.some((res: any) => {
    if (res.spData == JSON.stringify(val)) {
      a = res
      return
    }
  })
  return a
}

// 笛卡尔积
const calcDescartes = (array: any) => {
  const res: any = []
  if (array.length < 1) return []
  if (array.length == 1) {
    array[0].forEach((item: any) => {
      res.push([item])
    })
    return res
  }
  return array.reduce((total: any, currentValue: any) => {
    console.log('aa', total, currentValue)
    total.forEach((t: any) => {
      currentValue.forEach((cv: any) => {
        if (t instanceof Array) {
          // 或者使用 Array.isArray(t)
          res.push([...t, cv])
        } else {
          res.push([t, cv])
        }
      })
    })
    return res
  })
}

// 重写刷新列表的方法，使用笛卡尔积算法,之前的demo是个什么鬼
const refreshProductSkuList = () => {
  console.log(state.selectProductAttr, '======')
  // 先根据所选属性生成笛卡尔初始值
  const list: any = []
  state.selectProductAttr.forEach((res: any) => {
    const data: any = []
    res.values.forEach((res2: any) => {
      data.push({
        key: res.name,
        value: res2
      })
    })
    if (data.length == 0) {
      setTimeout(() => {
        ElMessage.warning(`请选择"${res.name}"`)
      }, 200)
    }
    list.push(data)
  })
  if (list.length < state.selectProductAttr.length) {
    state.form.skuStockList = JSON.parse(JSON.stringify([]))
    return
  }
  console.log('list', list)
  const val: any = calcDescartes(list)
  const sku: any = []
  console.log('val', val)
  val.forEach((res: any, index: any) => {
    if (res.length == list.length) {
      sku.push({
        ...compareData(res, state.form.skuStockList),
        sort: index + 1
      })
    }
  })
  state.form.skuStockList = JSON.parse(JSON.stringify(sku))
  console.log(state.form.skuStockList)
}

const handleProductAttrChange = () => {
  state.productAttrStatus = true
  getProductAttrList(0)
  getProductAttrList(1)
}

const handleEditCreated = () => {
  // 根据商品属性分类id获取属性和参数
  if (state.form.productAttributeCategoryId != null) {
    handleProductAttrChange()
  }
  // state.hasEditCreated = true
}

// 根据商品分类id获取商品信息
const getCateNameById = (id: any, data: any, name: any, code: any) => {
  data.forEach((item: any) => {
    if (item.id === id) {
      state.form[name] = item.name
      state.form[code] = item.treeCode
    } else {
      setName(item, id, name, code)
    }
  })
}

const setName = (datas: any, id: any, name: any, code: any) => {
  if (datas.id === id) {
    state.form[name] = datas.name
    state.form[code] = datas.treeCode
  } else if (datas.children && datas.children.length > 0) {
    datas.children.forEach((item: any) => {
      setName(item, id, name, code)
    })
  }
}

// 查询商品属性类型
const getcommodityType = async () => {
  await fetch({
    url: `/mall/productattributecategory/list/${protType}`,
    method: 'get'
  }).then((res: any) => {
    state.commodityTypeList = res.data
  })
}

// 查询供应商
const getSupplierList = async () => {
  await fetch({
    url: '/admin/companysupplier/page',
    method: 'get',
    params: {
      size: 999,
      current: 1
    }
  }).then((res: any) => {
    state.supplierList = res.data?.records
  })
}

// 查询商品品牌
const getBrandList = async () => {
  await fetch({
    url: `/mall/brand/list`,
    method: 'get'
  }).then((res: any) => {
    state.brandList = res.data
  })
}

// 查询平台分类
const getProductcategoryPlat = async () => {
  await fetch({
    url: `/mall/platformcategory/tree`,
    method: 'get'
  }).then((res: any) => {
    state.platformCategoryList = res.data
  })
}

// 查询商品企业分类
const getProductcategory = async () => {
  await fetch({
    url: `/mall/productcategory/tree`,
    method: 'get'
  }).then((res: any) => {
    state.productCategoryList = res.data
  })
}

// 查询工种
const getSkillType = async () => {
  await fetch({
    url: '/admin/sysjobskill/getJobSkillList',
    method: 'get'
  }).then((res: any) => {
    state.skillTypeList = res.data
  })
}

// 查询sop模板
const getTemplateDataList = () => {
  // 页面初始化时调用
  templateGetList({ size: 9999 }).then((res) => {
    state.sopTemplateList = res.data || []
    state.sopTemplateList = state.sopTemplateList.filter((item: any) => {
      if (item.defaultFlag === 0 && item.showStatus === 1) {
        return true
      }
    })
  })
}

defineExpose({ handleFinishCommit })

onMounted(() => {
  state.form = props.modelValue
  // 把分期支付阶段方式为百分比的ratio乘以100
  state.form.payStages?.forEach((item: any) => {
    if (item.type === 1) {
      item.ratio = item.ratio * 100
    }
  })
  getProductcategoryPlat() // 查询商品平台分类
  getProductcategory() // 查询商品企业分类
  getBrandList() // 查询商品品牌
  getSupplierList() // 查询供应商
  getcommodityType() // 查询商品属性类型
  getSkillType() // 查询工种
  if (state.form.platformType == 2) {
    // 企业端
    getTemplates() // 获取运费模版和入户/安装费模版
  }
  if (state.form.platformType == 3) {
    // 运营端
    getTemplateDataList() // 查询sop模板
  }

  if (state.form.skuStockList) {
    var skuStockList: any = state.form.skuStockList
    skuStockList.map((res: any, index: any) => {
      if (typeof JSON.parse(res.spData) === 'string') {
        res.spData = JSON.parse(res.spData)
      }
      if (JSON.parse(res.spData).spData) {
        res.spData = JSON.stringify(JSON.parse(res.spData).spData)
      }
      res.sort = index + 1
      JSON.parse(res.spData).map((res2: any, index2: any) => {
        res['key' + (index2 + 1)] = res2.value
      })
    })
    // console.log(state.dataValue.skuStockList)
  }
  if (
    props.isEdit ||
    route.query.isEdit == '3' ||
    state.form.skuStockList?.length > 0
  ) {
    handleEditCreated()
  }

  // 商品关键字选项
  state.inputOptions = state.form.keywords
  // 存个原始数据
  state.originalKeyWords = state.form.keywords
  state.originalTags = state.form.tags
  // 商品标签选项
  state.tagOptions = state.form.tags
})
</script>

<style scoped lang="less">
.product-info {
  //background: #FFFFFF;
  //border-radius: 4px;
  position: absolute;
  top: 8.6rem;
  bottom: 8.6rem;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 0 2rem;

  .product-form {
    background: #ffffff;
    border-radius: 4px;
    padding: 2rem;
    margin: 2rem 0;

    .product-form-title {
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
    }
  }
}

.inputStyle {
  height: 3.6rem;
  border: 0.1rem solid #e4e7ed;
  padding-left: 0.5rem;
  background: #ffffff;
  border-radius: 0.4rem;
  max-width: 14rem;
}

input:focus-visible {
  border: solid 0.1rem @mainColor !important;
  border-radius: 0.4rem;
  outline: none;
}

.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
