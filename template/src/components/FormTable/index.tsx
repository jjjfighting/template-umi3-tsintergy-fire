import type { CommonEnum } from '@/hooks/useEnumHook';
import useEnumHook from '@/hooks/useEnumHook';
import { accCalc, toZero } from '@/utils/calc.legacy';
import { findEnum } from '@/utils/enum';
import { Y, YM, YMD } from '@/utils/timeUtils';
import { Cascader, Checkbox, DatePicker, Form, Input, Select, Table } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { TableProps } from 'antd/lib/table';
import moment from 'moment';
import type { CSSProperties } from 'react';
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { addIndex2DataSource, cellColumns, dataSource2Obj, excelPaste } from './utils';

const EditableContext = React.createContext<any>('light');
const datesPickerType = ['datePicker', 'monthPicker', 'yearPicker'];
const specialType = [
  'datePicker',
  'monthPicker',
  'yearPicker',
  'select',
  'checkbox',
  'cascader',
  'input',
];

interface SelectEnumItem {
  key: string;
  value: string;
}
const BIG_CELL_NUM = 100;
let isBigCell = false; // 是否大量input，如果是，就用点击聚焦的方式，如果不是，就用input框

type FormType =
  | 'text'
  | 'number'
  | 'input'
  | 'select'
  | 'datePicker'
  | 'monthPicker'
  | 'yearPicker'
  | 'checkbox'
  | 'cascader';

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editable: (record: any, dataIndex: string | number, index: string | number) => boolean | boolean;
  dataIndex: string;
  title: any;
  // 'datePicker' | 'monthPicker' | 'yearPicker' 格式要format后的String格式
  formType: (record: any, dataIndex: string | number, index: number) => FormType | FormType;
  nodeProps?: any; // 控件方法
  formStyle?: (record: any, dataIndex: string | number) => CSSProperties | CSSProperties;
  placeholder: string;
  rowKey?: string;
  useEnumHookData?: boolean;
  selectEnumKey?: keyof CommonEnum;
  selectEnum?: (record: any) => any[] | any[];
  onValuesChange?: (record: any) => void;
  record: any;
  index: number;
  required: boolean;
  cascaderEnumList?: any[];
  cascaderDisplayRender?: (record: any) => any;
  rules: (record: any, dataIndex: string | number, index: number) => [] | [];
  children: React.ReactNode;
  render: (value: any, item: any, index: number) => React.ReactNode;
  onInputPaste: (e: MouseEvent, xDataIndex: string, yIndex: number) => void;
}

export const EditableRow = ({ index, ...props }: any) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} key={index} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell: React.FC<EditableCellProps> = (props) => {
  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    rules,
    required,
    formType,
    nodeProps = {},
    formStyle,
    rowKey,
    placeholder,
    useEnumHookData,
    selectEnumKey,
    selectEnum,
    onValuesChange,
    render,
    onInputPaste,
    cascaderEnumList,
    cascaderDisplayRender,
    ...restProps
  } = props;
  const key = `${record?.index}_${dataIndex}`;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>();
  const numberInputRef = useRef<any>();
  let visible = true;
  const form: FormInstance = useContext(EditableContext);

  useEffect(() => {
    if (!isBigCell) {
      return;
    }
    if (editing && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    if (editing && numberInputRef && numberInputRef.current) {
      numberInputRef.current.focus();
    }
  }, [editing]);

  // 判断formType
  const tableFormType: FormType = useMemo(() => {
    return typeof formType === 'function' ? formType(record, dataIndex, record.index) : formType;
  }, [formType, record, dataIndex]);

  // 判断rules
  const tabRules: [] = useMemo(() => {
    return typeof rules === 'function' ? rules(record, dataIndex, record.index) : rules;
  }, [rules, record, dataIndex]);

  // 判断是否能够编辑
  const tabEditale: boolean = useMemo(() => {
    const canEdit =
      typeof editable === 'function' ? editable(record, dataIndex, record.index) : editable;
    // 如果能编辑，及时转换日期类型form表单
    if (datesPickerType.includes(tableFormType) && canEdit) {
      record[dataIndex] = !record?.[dataIndex] ? null : moment(record?.[dataIndex]);
    }
    form.setFieldsValue(record);
    return canEdit;
  }, [editable, record, dataIndex, tableFormType, form]);

  // form样式
  const formStyleFinal = useMemo(() => {
    return typeof formStyle === 'function' ? formStyle(record, dataIndex) : formStyle;
  }, [dataIndex, formStyle, record]);

  const toggleEdit = (e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields([dataIndex]);
      // console.log('🚀 ~ file: index.tsx ~ line 142 ~ save ~ values', values);
      const dateValues = { ...values }; // 日期选择器的选择value
      if (tableFormType === 'datePicker') {
        dateValues[dataIndex] = dateValues?.[dataIndex]
          ? moment(dateValues?.[dataIndex])?.format(YMD)
          : null;
      }
      if (tableFormType === 'monthPicker') {
        dateValues[dataIndex] = dateValues?.[dataIndex]
          ? moment(dateValues?.[dataIndex])?.format(YM)
          : null;
      }
      if (tableFormType === 'yearPicker') {
        dateValues[dataIndex] = dateValues?.[dataIndex]
          ? moment(dateValues?.[dataIndex])?.format(Y)
          : null;
      }

      toggleEdit();
      onValuesChange?.({ ...record, ...values, ...dateValues, dataIndex });

      // 修复 select 选择没有立即更新
      form.setFieldsValue(values);
    } catch (errInfo) {
      // 验证错误，清除数据 为undefined
      if (onValuesChange) {
        const value = {
          [dataIndex]: undefined,
        };
        console.log('🚀 ~ file: index.tsx ~ line 168 ~ save ~ value', value);
        onValuesChange({ ...record, ...value, dataIndex });
      }
      console.log('Save failed:', errInfo);
    }
  };

  const enums = useEnumHook();
  // 不能编辑，或者没有在编辑状态 返回一个可点击item 选择器直接渲染
  if ((!tabEditale || !editing) && !specialType.includes(tableFormType) && isBigCell) {
    let staticClassName = 'uneditable-cell-value-wrap';
    if (tabEditale) {
      staticClassName = 'editable-cell-value-wrap';
    }
    const needPlaceholder =
      tabEditale &&
      placeholder &&
      !record[dataIndex] &&
      record[dataIndex] !== 0 &&
      record[dataIndex] !== '0'; // 是否应该显示placeholder

    if (needPlaceholder) {
      staticClassName = 'editable-cell-value-wrap-placeholder';
    }
    return (
      <td {...restProps}>
        <div
          style={formStyleFinal}
          className={staticClassName}
          onClick={
            tabEditale
              ? toggleEdit
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }
          }
        >
          {needPlaceholder ? placeholder : children}
        </div>
      </td>
    );
  }
  let childNode = children;
  // 如果是选择器 而且是不可编辑的情况 直接找出对应的枚举
  if (tableFormType === 'select' && !tabEditale) {
    const id = record[dataIndex];
    if (selectEnum) {
      childNode =
        typeof selectEnum === 'function'
          ? findEnum(selectEnum(record), id)
          : findEnum(selectEnum, id);
    }
    if (selectEnumKey) {
      childNode = findEnum(enums[selectEnumKey], id);
    }
  }

  if (tableFormType === 'number' && tabEditale) {
    childNode = (
      <Input
        type="number"
        style={formStyleFinal}
        key={key}
        placeholder={placeholder}
        className="-p-components-input-number-box"
        ref={numberInputRef}
        onPaste={(e: MouseEvent) => {
          if (onInputPaste) {
            visible = false;
            onInputPaste(e, dataIndex, record.index);
            numberInputRef.current.blur();
            e.stopPropagation();
          }
        }}
        onFocus={() => {
          setEditing(true);
        }}
        onBlur={() => {
          if (!visible) {
            visible = true;
            toggleEdit();
            return;
          }
          save();
        }}
        {...nodeProps}
      />
    );
  }
  if (tableFormType === 'input' && tabEditale) {
    childNode = (
      <Input
        key={key}
        ref={inputRef}
        placeholder={placeholder}
        style={{ padding: '4px', textAlign: 'left', ...formStyleFinal }}
        onPaste={(e: MouseEvent) => {
          if (onInputPaste) {
            onInputPaste(e, dataIndex, record.index);
          }
        }}
        onFocus={() => {
          setEditing(true);
        }}
        onBlur={() => {
          save();
        }}
        {...nodeProps}
      />
    );
  }
  if (tableFormType === 'checkbox' && tabEditale) {
    childNode = (
      <Checkbox
        key={key}
        onChange={() => {
          save();
        }}
        {...nodeProps}
      />
    );
  }
  if (tableFormType === 'datePicker' && tabEditale) {
    childNode = (
      <DatePicker
        allowClear={false}
        key={key}
        onChange={() => {
          save();
        }}
        {...nodeProps}
      />
    );
  }
  if (tableFormType === 'monthPicker' && tabEditale) {
    childNode = (
      <DatePicker.MonthPicker
        allowClear={false}
        key={key}
        onChange={() => {
          save();
        }}
        {...nodeProps}
      />
    );
  }
  if (tableFormType === 'yearPicker' && tabEditale) {
    childNode = (
      <DatePicker.YearPicker
        allowClear={false}
        key={key}
        onChange={() => {
          save();
        }}
        {...nodeProps}
      />
    );
  }

  if (tableFormType === 'select' && tabEditale) {
    let options = [];
    if (selectEnum) {
      const selectEnumList = typeof selectEnum === 'function' ? selectEnum(record) : selectEnum;
      options = selectEnumList?.map((item) => (
        <Select.Option key={item.id} value={item.id} disabled={item.disabled}>
          {item.name}
        </Select.Option>
      ));
    } else if (selectEnumKey) {
      if (useEnumHookData) {
        options = (enums[selectEnumKey] || [])?.map((p: any) => (
          <Select.Option key={p.id} value={p.id}>
            {p.name}
          </Select.Option>
        ));
      } else {
        options = record[selectEnumKey]?.map((p: SelectEnumItem) => (
          <Select.Option key={p.value} value={p.value}>
            {p.value}
          </Select.Option>
        ));
      }
    } else {
      options = [];
    }
    childNode = (
      <Select
        key={key}
        placeholder={placeholder || `请选择${title}`}
        onChange={() => {
          save();
        }}
        style={{ width: 130, ...formStyleFinal }}
        disabled={!tabEditale}
        {...nodeProps}
      >
        {options}
      </Select>
    );
  }

  if (tableFormType === 'cascader') {
    if (tabEditale) {
      childNode = (
        <Cascader
          style={formStyleFinal}
          options={cascaderEnumList}
          placeholder={placeholder || `请选择${title}`}
          expandTrigger="hover"
          displayRender={cascaderDisplayRender}
          defaultValue={record[dataIndex]}
          onChange={() => {
            save();
          }}
          {...nodeProps}
        />
      );
    } else if (selectEnumKey) {
      childNode = findEnum(enums[selectEnumKey], record?.subType) ?? '';
    }
  }

  return (
    <td {...restProps} key={key}>
      <Form.Item
        key={key}
        valuePropName={tableFormType === 'checkbox' ? 'checked' : 'value'} // checkbox 的赋值是checked
        style={{
          margin: 0,
          ...formStyleFinal,
        }}
        name={dataIndex}
        rules={[...(tabRules || [])]}
      >
        {childNode}
      </Form.Item>
    </td>
  );
};

export interface FormTableProps extends TableProps<any> {
  columns: any;
  isBigCell?: boolean;
  defaultWidth?: number;
  dataSource?: any[];
  size?: any;
  onPaste?: (pasteResultData: any[], columnsDataSource: any) => void;
  showPasteColumnsList?: boolean; // 粘贴的时候 是否展示 竖向的列表对象返回
}

const Index = memo((props: FormTableProps) => {
  const {
    columns,
    dataSource,
    defaultWidth = 150,
    onPaste,
    isBigCell: isBigCellTmp,
    showPasteColumnsList = false,
    ...rest
  } = props;

  isBigCell = useMemo(() => {
    if (isBigCellTmp) {
      return isBigCellTmp;
    }
    // 获取横向长度
    const columnsLength =
      columns?.length +
        columns?.reduce((total: number, item: any) => {
          if (item.children && item.children.length) {
            return accCalc.add(total, item.children.length);
          }
          return total;
        }, 0) || 0;
    const totalCell = accCalc.multiply(toZero(dataSource?.length), columnsLength);
    return totalCell > BIG_CELL_NUM;
  }, [dataSource, columns, isBigCellTmp]);
  return (
    <Table
      bordered
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      size="small"
      dataSource={addIndex2DataSource(dataSource || [])}
      columns={cellColumns({
        columns,
        defaultWidth,
        onInputPaste: (e: MouseEvent, xDataIndex: string, yIndex: number) => {
          // TODO 设置第一个值
          const pasteResultData = excelPaste({
            e,
            xDataIndex,
            yIndex,
            columns,
            dataSource: addIndex2DataSource(dataSource || []),
          });
          if (onPaste && pasteResultData) {
            let columnsDataSource = {};
            if (showPasteColumnsList) {
              columnsDataSource = dataSource2Obj({
                columns,
                dataSource: pasteResultData,
              });
            }
            onPaste(pasteResultData, columnsDataSource);
          }
        },
      })}
      pagination={false}
      scroll={{ x: 'max-content' }}
      {...rest}
    />
  );
});

export default Index;
