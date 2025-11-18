import type { RequestHandler } from "msw";
import { AssignmentsService } from "./AssignmentsService";
import { DeviceManagementService } from "./DeviceManagementService";
import { MobileProvidersService } from "./MobileProvidersService.ts";
import { DeviceStatusesService } from "./DeviceStatusService.ts";
import { DeviceTypesService } from "./DeviceTypeService.ts";
import { ModelsService } from "./ModelsService.ts";
import { AssigneesService } from "./AssigneesService.ts";
import { ServiceTypeService } from "./ServiceTypeService.ts";
import { ConventionService } from "./ConventionService.ts";



const services = [
  new ModelsService(),
  new DeviceTypesService(),
  new MobileProvidersService(),
  new DeviceStatusesService(),
  new AssignmentsService(),
  new AssigneesService(),
  new DeviceManagementService(),
  new ServiceTypeService(),
  new ConventionService(),
];

export const handlers: RequestHandler[] = services.flatMap((s) => s.getHandlers());
export default handlers;