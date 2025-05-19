const EVENT_RESOURCE = 'event';

export enum EventPermission {
  READ = `${EVENT_RESOURCE}:read`,
  WRITE = `${EVENT_RESOURCE}:write`,
  DELETE = `${EVENT_RESOURCE}:delete`,
}
