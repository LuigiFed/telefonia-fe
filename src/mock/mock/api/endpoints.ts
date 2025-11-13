import { RestService } from "../RestService";


const { ACTION, ENTITY } = RestService;

export const API = {
  deviceModels: {
    list: `${RestService.MODELS}/${ACTION.ALL}` as const,
    create: `${RestService.MODELS}/${ENTITY.MODELS}${ACTION.INSERT}` as const,
    update: `${RestService.MODELS}/${ENTITY.MODELS}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.MODELS}/${ACTION.DELETE.toLowerCase()}/:id` as const,
  },
  serviceTypes: {
    list: `${RestService.SERVICE_TYPES}/${ACTION.ALL}` as const,
    create: `${RestService.SERVICE_TYPES}/${ENTITY.SERVICE_TYPES}${ACTION.INSERT}` as const,
    update: `${RestService.SERVICE_TYPES}/${ENTITY.SERVICE_TYPES}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.SERVICE_TYPES}/${ENTITY.SERVICE_TYPES}${ACTION.DELETE}/:id` as const,
  },
  deviceTypes: {
    list: `${RestService.DEVICE_TYPES}/${ACTION.ALL}` as const,
    create: `${RestService.DEVICE_TYPES}/${ENTITY.DEVICE_TYPES}${ACTION.INSERT}` as const,
    update: `${RestService.DEVICE_TYPES}/${ENTITY.DEVICE_TYPES}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.DEVICE_TYPES}/${ENTITY.DEVICE_TYPES}${ACTION.DELETE}/:id` as const,
  },
  mobileProviders: {
    list: `${RestService.MOBILE_PROVIDERS}/${ACTION.ALL}` as const,
    create: `${RestService.MOBILE_PROVIDERS}/${ENTITY.MOBILE_PROVIDERS}${ACTION.INSERT}` as const,
    update: `${RestService.MOBILE_PROVIDERS}/${ENTITY.MOBILE_PROVIDERS}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.MOBILE_PROVIDERS}/${ENTITY.MOBILE_PROVIDERS}${ACTION.DELETE}/:id` as const,
  },
  deviceStatuses: {
    list: `${RestService.DEVICE_STATUSES}/${ACTION.ALL}` as const,
    create: `${RestService.DEVICE_STATUSES}/${ENTITY.DEVICE_STATUSES}${ACTION.INSERT}` as const,
    update: `${RestService.DEVICE_STATUSES}/${ENTITY.DEVICE_STATUSES}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.DEVICE_STATUSES}/${ENTITY.DEVICE_STATUSES}${ACTION.DELETE}/:id` as const,
  },
  assegnazioni: {
    list: `${RestService.ASSEGNAZIONI}/${ACTION.ALL}` as const,
    create: `${RestService.ASSEGNAZIONI}/${ENTITY.ASSEGNAZIONI}${ACTION.INSERT}` as const,
    update: `${RestService.ASSEGNAZIONI}/${ENTITY.ASSEGNAZIONI}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.ASSEGNAZIONI}/${ENTITY.ASSEGNAZIONI}${ACTION.DELETE}/:id` as const,
  },
  assegnatari: {
    list: `${RestService.ASSEGNATARI}/${ACTION.ALL}` as const,
    create: `${RestService.ASSEGNATARI}/${ENTITY.ASSEGNATARI}${ACTION.INSERT}` as const,
    update: `${RestService.ASSEGNATARI}/${ENTITY.ASSEGNATARI}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.ASSEGNATARI}/${ENTITY.ASSEGNATARI}${ACTION.DELETE}/:id` as const,
  } as const,
  deviceManagement: {
      list: `${RestService.DEVICE_MANAGEMENT}/${ACTION.ALL}` as const,
    create: `${RestService.DEVICE_MANAGEMENT}/${ENTITY.DEVICE_MANAGEMENT}${ACTION.INSERT}` as const,
    update: `${RestService.DEVICE_MANAGEMENT}/${ENTITY.DEVICE_MANAGEMENT}${ACTION.UPDATE}/:id` as const,
    delete: `${RestService.DEVICE_MANAGEMENT}/${ENTITY.DEVICE_MANAGEMENT}${ACTION.DELETE}/:id` as const,
  },
  riferimento: {
       list: `${RestService.RIFERIMENTO}/${ACTION.ALL}` as const,
  } as const,


} as const;