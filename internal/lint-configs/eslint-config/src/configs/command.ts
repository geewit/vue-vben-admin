import createCommand from 'eslint-plugin-command/config';

export async function command() {
  return [
    {
      /**
       * @ts-expect-error - 类型未定义，但运行时有效
       */
      ...createCommand()
    }
  ];
}
