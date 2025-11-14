export interface DeviceModel {
  id: number;
  desModello: string;
}

export interface DeviceType {
  id: number;
  codice: string;
  descrizione: string;
}

export interface MobileProvider {
  id: number;
  codice: string;
  descrizione: string;
}

export interface DeviceStatus {
  id: number;
  codice: string;
  descrizione: string;
  alias: string;
}

export interface Device {
  id: number ;
  asset: string;
  tipo: string;
  utenza: string;
  imei: string;
  seriale: string;
  modello: string;
  stato: string;
  dataInizio: string;
  dataFine?: string | null;
  note?: string;
  utenteId: number;
  deviceManagementId?: number;
}
export type DeviceForm = Omit<Device, "id" | "utenteId"> & {
  id: number | null;
  utenteId: number | null;
};
export interface Assegnatario {
  id: number ;
  nome: string;
  cognome: string;
  tipoUtente: string;
  unitaOrganizzativa: string;
  note: string;
}

export interface DeviceManagement {
  id: number ;
  asset: string;
  imei: string;
  numeroSerie: string;
  idInventario: string;
  dispositivo: string;
  modello: string;
  numeroTelefono: string;
  sede: string;
  fornitore: string;
  gestore: string;
  servizio: string;
  note: string;
  inizio: string;
  fine: string;
  stato: string;
};
export type DeviceFormManagement = Omit<DeviceManagement, "id"> & {
  id: number | null;
};

export type ServiceType = {
  id: number;
  descrizione: string;
}

export type Method = "get" | "post" | "put" | "delete";

export interface BaseEndpoint {
  method: Method;
  path: string;
  delay?: number;
}

export interface ListEndpoint extends BaseEndpoint {
  method: "get";
  data?: string;
  filterBy?: string;
}

export interface CreateEndpoint extends BaseEndpoint {
  method: "post";
}

export interface UpdateEndpoint extends BaseEndpoint {
  method: "put";
}

export interface DeleteEndpoint extends BaseEndpoint {
  method: "delete";
  validateReference?: {
    entity: string;
    field: string;
    match: string;
  };
}
