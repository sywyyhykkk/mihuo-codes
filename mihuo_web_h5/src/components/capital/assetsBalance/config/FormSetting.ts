export declare class FormSetting{
    prop: string;
    label: string;
    //指定输入框类型 checkbox必须指定选择对象的length
    //可增加类型，在formSet组件中维护
    type: 'text'|'switch'|'radio'|'date'|'select'|'checkbox'
    |'textarea'|'selectTree'|'startDate'|'endDate'|'file'
    |any;
    //可以指定日期格式
    formatter?: string;
    clearable?: boolean;
    //可以通过指定enumkey，从枚举中获取待选数据
    enumKey?: string;
    disabled?: boolean;
    multiple?: boolean;
    maxlength?: number;//字段长度
    dateProp?: string;//比较日期 字段名称
    className?: string;
    rows?: number;//文本框多行输入，rows
    width?: string;//宽度，用于一行独占100%
}