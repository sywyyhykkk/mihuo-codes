export declare class Enum {
    name: string;
    value: number | string;
    [key:string]:any;
}

export declare class AccountFunds {
    allAmount: number;
    payerAmount: number;
    receiverAmount: number;
    phone: number | string
}

export declare class Page {
    size: number | string;
    currentPage: number | string;
    total: number | string;
}


export type LabelDirection='center'|'left'|'right'
export declare class TableSetting{
    prop: string;
    label: string;
    width?: number;
    align?: LabelDirection;
    header_align?: LabelDirection;
    show_overflow?: boolean;
    min_width?: number;
    fixed?: 'left'|'right';
    children?: Array<TableSetting>;
    formatter?: Function;
    type?: 'checkBox';
}