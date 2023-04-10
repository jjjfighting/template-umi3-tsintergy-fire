import useSysParameter from '@/hooks/useSysParameter';
import { algorithmStatus } from '@/utils/enum';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Space, Tooltip } from 'antd';
import type { ButtonProps, ButtonType } from 'antd/lib/button';
import type { FC, ReactElement } from 'react';
import React, { memo, useImperativeHandle, useMemo, useState } from 'react';
import { request, useRequest } from 'umi';

export interface AccessBoxInt extends ButtonProps {
  text?: any;
  templateKey: string;
  icon?: any;
  useUrl?: boolean; // 模板格式是否object 使用url为key
  useName?: boolean;
}
const Index: React.FC<AccessBoxInt> = (props) => {
  const {
    text = '导出',
    icon = <i className={`ppsfont icon-xingzhuangjiehe`} />,
    templateKey,
    useUrl,
    useName,
    ...rest
  } = props;
  const { template } = useSysParameter();
  const name = useMemo(() => {
    try {
      const templateObj = JSON.parse(template);
      return useName ? templateObj?.[templateKey]?.url : text;
    } catch (error) {
      return text;
    }
  }, [template, useName, templateKey, text]);

  return (
    <Button
      icon={icon}
      type="link"
      size="small"
      onClick={() => {
        try {
          const templateObj = JSON.parse(template);
          if (!templateObj?.[templateKey]) {
            message.warn('找不到附件');
            return;
          }
          const templateUrl = useUrl ? templateObj?.[templateKey]?.url : templateObj?.[templateKey];
          window.open(`${API_PREFIX}/api/store/template?templateUrl=${templateUrl}`);
        } catch (error) {
          message.warn('打开附件失败');
        }
      }}
      {...rest}
    >
      {name}
    </Button>
  );
};

export default Index;

interface Props extends ButtonProps {
  params: object;
  url: string;
  disabled?: boolean;
  onError?: (onError: any) => void;
  children?: string;
}

export const DownLoadButton: FC<Props> = memo(
  ({
    params,
    url,
    disabled,
    children = '下载当前计算结果的算法文件',
    onError,
    ...rest
  }: Props): ReactElement => {
    const [loading, setLoading] = useState<boolean>(false);
    return (
      <Button
        type="link"
        loading={loading}
        size="small"
        // disabled={disabled}
        {...rest}
        onClick={() => {
          setLoading(true);
          request(`${API_PREFIX}${url}`, {
            method: 'get',
            responseType: 'blob',
            skipErrorHandler: true,
            Accept: 'application/octet-stream',
            getResponse: true,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            params,
          } as any)
            .then(({ data, response }: { data: Blob; response: any }) => {
              setLoading(false);
              try {
                const filename = response?.headers?.get?.('content-disposition').split('=')?.[1];
                // setDownLoading(false);
                const objectURL = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.download = filename;
                a.href = objectURL;
                a?.click();
                // document?.body?.removeChild(a);
              } catch (error) {
                setLoading(false);
                onError?.(error);
                console.log('error->', error);
              }
            })
            .catch((error) => {
              setLoading(false);
              onError?.(error);
            });
        }}
      >
        {children}
      </Button>
    );
  },
);

interface downLoadButtonListProps {
  downParams: any; // 下载文件的参数
  checkParams: any; // 查询算法执行状态 的 参数
  downUrl: string; // 下载文件的url
  checkUrl: string; // 查询文件的 api /api/price/algorithm
  pollingTime?: number; // 轮询的间隙时间 默认为 2500
  myRef: React.RefObject<any>;
  noDownButton1?: boolean;
  noDownButton0?: boolean;
  isDropMenu?: boolean;
  type?: [ButtonType, ButtonType];
  icon?: [React.ReactNode, React.ReactNode];
  noText?: boolean;
  success?: (update: string) => void; // 当轮询到状态为 2 的时候，算法执行成功 的回调函数
  algorithmStausChange?: (stauts: string | undefined) => void; // 状态更改
  error?: () => void; // 算法执行 失败/异常 等错误的情况的 回调函数
}

type ResDataProps = {
  createTime: string; // 创建时间 YYYY-MM-DD hh:mm:ss
  currentStep: string; // 算法当前的步骤 1~9
  id: string;
  inputName: string; // 入参文件名 一般为 "IN.zip"
  inputPath: string; // 入参文件在 文件服务器上的 路径
  mode: string;
  outputName: string; // 出参文件名 一般为 "OUT.zip"
  outputPath: string; //  出参文件名 一般为 "OUT.zip"
  status: '1' | '2' | '3' | '4'; // 当前的 算法 执行状态 1: 执行中，2：执行成果 3 ：执行失败 4 算法异常
  type: string;
  uniqueIndex: string;
  updateTime: string; // 算法更新时间 / 最新执行时间 YYYY-MM-DD hh:mm:ss
};

export const DownLoadButtonList: FC<downLoadButtonListProps> = memo(
  ({
    downParams,
    checkParams,
    downUrl,
    checkUrl,
    pollingTime = 2500,
    myRef,
    noDownButton1,
    noDownButton0,
    isDropMenu = false,
    type = ['primary', 'primary'],
    icon = [null, null],
    noText,
    success,
    algorithmStausChange,
    error,
  }: downLoadButtonListProps): ReactElement => {
    const [inButton, setInButton] = useState<boolean>(true);
    const [outButton, setOutButton] = useState<boolean>(true);
    const [status, setStatus] = useState<string | undefined>();
    const [update, setUpdate] = useState<string>('');

    const { run: runAlgorithm, cancel } = useRequest(
      (params: any) =>
        request(`${API_PREFIX}${checkUrl}`, {
          params,
        }),
      {
        manual: true,
        onSuccess: (resData?: ResDataProps) => {
          // mode === 0 ,currentStep > 2 : 可以下载入参
          // mode === 1 ,currentStep > 3 : 可以下载入参
          // status === 2 : 可以下载出入参
          if (!resData) {
            setStatus(undefined);
            algorithmStausChange?.(undefined);
            setInButton(true);
            setOutButton(true);
            cancel();
            return;
          }
          setUpdate(resData.updateTime);
          if (resData?.status !== '1') {
            cancel();
          }
          if (resData?.mode === '1' && Number(resData?.currentStep) > 3) {
            setInButton(false);
          } else if (resData?.mode === '0' && Number(resData?.currentStep) > 2) {
            setInButton(false);
          }
          if (resData?.status === '2') {
            setInButton(false);
            setOutButton(false);
          }

          // 算法异常码的
          switch (resData?.status) {
            case '1':
              break;
            case '2':
              // 成功了，执行 成功的回调并停止轮询
              cancel();
              success?.(resData?.updateTime);
              break;
            case '3':
              // 异常了，执行 失败的回调并停止轮询
              error?.();
              cancel();
              break;
            case '4':
              // 成功了，执行 失败的回调并停止轮询
              error?.();
              cancel();
              break;
            default:
              // 停止轮询
              cancel();
              break;
          }
          algorithmStausChange?.(resData?.status);
          setStatus(resData?.status);
        },
        onError: () => {
          cancel();
          setStatus('4');
          error?.();
        },
        pollingInterval: pollingTime,
        pollingWhenHidden: false,
      },
    );

    useImperativeHandle(myRef, () => ({
      checkAlgorithmStatus: (newCheckParams?: any) => {
        setStatus(undefined);
        cancel();
        runAlgorithm(newCheckParams || checkParams);
      },
    }));

    // 下拉类型菜单
    const DropMenu = () => {
      // 菜单项点击事件完全复制上方的DownLoadButton内的方法
      const clickToDown = async ({
        params,
        url,
        onError,
      }: {
        params: any;
        url: string;
        onError?: Function;
      }) =>
        request(`${API_PREFIX}${url}`, {
          method: 'get',
          responseType: 'blob',
          skipErrorHandler: true,
          Accept: 'application/octet-stream',
          getResponse: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params,
        } as any)
          .then(({ data, response }: { data: Blob; response: any }) => {
            try {
              const filename = response?.headers?.get?.('content-disposition').split('=')?.[1];
              // setDownLoading(false);
              const objectURL = window.URL.createObjectURL(data);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.download = filename;
              a.href = objectURL;
              a?.click();
              // document?.body?.removeChild(a);
            } catch (error) {
              onError?.(error);
              console.log('error->', error);
            }
          })
          .catch((error) => {
            onError?.(error);
          });

      const menu = (
        <Menu>
          {!noDownButton0 && (
            <Menu.Item key={0}>
              <span
                onClick={() =>
                  clickToDown({
                    params: { ...downParams, downloadType: '0' },
                    url: downUrl,
                    onError: () => message.warn('暂无入参文件'),
                  })
                }
              >
                入参文件下载
              </span>
            </Menu.Item>
          )}
          {!noDownButton1 && (
            <Menu.Item key={1}>
              <span
                onClick={() =>
                  clickToDown({
                    params: { ...downParams, downloadType: '1' },
                    url: downUrl,
                    onError: () => message.warn('暂无入参文件'),
                  })
                }
              >
                出参文件下载
              </span>
            </Menu.Item>
          )}
        </Menu>
      );
      return (
        <Dropdown overlay={menu}>
          <Button style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
            下载 <DownOutlined />
          </Button>
        </Dropdown>
      );
    };

    return (
      <Space>
        {!isDropMenu && !noDownButton0 && (
          <DownLoadButton
            disabled={inButton}
            params={{ ...downParams, downloadType: '0' }}
            url={downUrl}
            onError={() => {
              message.warn('暂无入参文件');
            }}
            type={type[0]}
            icon={icon[0]}
          >
            入参文件下载
          </DownLoadButton>
        )}
        {!isDropMenu && !noDownButton1 && (
          <DownLoadButton
            disabled={outButton}
            params={{ ...downParams, downloadType: '1' }}
            url={downUrl}
            onError={() => {
              message.warn('暂无出参文件');
            }}
            type={type[1]}
            icon={icon[1]}
          >
            出参文件下载
          </DownLoadButton>
        )}
        {isDropMenu && <DropMenu />}
        {!noText && (
          <Tooltip title={`更新时间为${update}`}>
            <span style={{ color: 'var(--neutral-color7)', fontSize: '15px' }}>
              {algorithmStatus[status]}
            </span>
          </Tooltip>
        )}
      </Space>
    );
  },
);
