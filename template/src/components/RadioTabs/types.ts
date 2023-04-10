export type ITabRadioItemType = (Record<'label' | 'value', string> & {
  children?: ITabRadioItemType;
})[];
