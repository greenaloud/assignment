import { RpcException } from '@nestjs/microservices/exceptions';

export const ToRpcException = () => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
      try {
        return await originMethod.apply(this, args);
      } catch (err: any) {
        throw new RpcException(err);
      }
    };

    return descriptor;
  };
};
