import type { Assegnatario, Convention, Device, DeviceManagement, DeviceModel, DeviceStatus, DeviceType, MobileProvider, ServiceType } from "../../types/types";

export const devices: DeviceModel[] = [
  { id: 1, desModello: "Router AC1200" },
  { id: 2, desModello: "Switch 24 porte" },
  { id: 3, desModello: "Modem VDSL2" },
  { id: 4, desModello: "Modem VDSL1" },
  { id: 5, desModello: "Modem ADSL" },
  { id: 6, desModello: "Modem ADSL2" },
  { id: 7, desModello: "Modem ADSL3" },
  { id: 8, desModello: "Modem ADSL4" },
];

export const deviceTypes: DeviceType[] = [
  { id: 1, desTipoDispositivo: "Smartphone" },
  { id: 2, desTipoDispositivo: "Tablet" },
  { id: 3, desTipoDispositivo: "PC" },
  { id: 4, desTipoDispositivo: "Laptop" },
  { id: 5, desTipoDispositivo: "Monitor" },
  { id: 6, desTipoDispositivo: "Router" },
  { id: 7, desTipoDispositivo: "Switch" },
  { id: 8, desTipoDispositivo: "Modem" },
  { id: 9, desTipoDispositivo: "Scanner" }  

];

export const mobileProviders: MobileProvider[] = [
  { id: 1,desGestore: "TIM" },
  { id: 2,desGestore: "Vodafone" },
  { id: 3,desGestore: "WindTre" },
  { id: 4,desGestore: "Iliad" },
  { id: 5,desGestore: "Fastweb" },
  { id: 6,desGestore: "Movistar" },

];

export const deviceStatuses: DeviceStatus[] = [
  { id: 1, desStato: "Assegnato", alias: "AS" },
  { id: 2, desStato: "Riconsegnato", alias: "RI" },
  { id: 3, desStato: "Smarrito/Rubato", alias: "SR" },
  { id: 4, desStato: "In Riparazione", alias: "IR" },
  { id: 5, desStato: "Fuori Uso", alias: "FU" },
  { id: 6, desStato: "Sostituzione", alias: "SO" },
  { id: 7, desStato: "Portabilità > Utenza Personale", alias: "PUP" },
  { id: 8, desStato: "Portabilità > Altra Amministrazione", alias: "PAM" },
  { id: 9, desStato: "Cessato (riconsegnato al fornitore)", alias: "CRF" },
];

export const assegnatari: Assegnatario[] = [
  {
    id: 1,
    nome: "Mario",
    cognome: "Rossi",
    tipoUtente: "Dipendente",
    unitaOrganizzativa: "IT - Sistemi Informativi",
    note: "Responsabile tecnico",
  },
  {
    id: 2,
    nome: "Luca",
    cognome: "Bianchi",
    tipoUtente: "Consulente",
    unitaOrganizzativa: "Ufficio Acquisti",
    note: "Supporto temporaneo",
  },
  {
    id: 3,
    nome: "Anna",
    cognome: "Verdi",
    tipoUtente: "Dipendente",
    unitaOrganizzativa: "IT - Sistemi Informativi",
    note: "Responsabile tecnico",
  },
  {
    id: 4,
    nome: "Giovanni",
    cognome: "Neri",
    tipoUtente: "Consulente",
    unitaOrganizzativa: "Ufficio Acquisti",
    note: "Supporto temporaneo",
  },
  {
    id: 5,
    nome: "Laura",
    cognome: "Gialli",
    tipoUtente: "Dipendente", 
    unitaOrganizzativa: "IT - Sistemi Informativi",
    note: "Responsabile tecnico",
  },
  {
    id: 6,
    nome: "Marco",
    cognome: "Esposito",
    tipoUtente: "Consulente", 
    unitaOrganizzativa: "Ufficio Acquisti",
    note: "Supporto temporaneo",
  },

];

export const assegnazioni: Device[] = [
  {
    id: 1,
    asset: "ASSET-1001",
    tipo: "Smartphone",
    utenza: "TIM 3451234567",
    imei: "352099101234567",
    seriale: "SN001",
    modello: "iPhone 14",
    stato: "AS",
    dataInizio: "2024-03-15",
    dataFine: "",
    note: "Telefono principale",
    utenteId: 1,
  },
  {
    id: 2,
    asset: "ASSET-2001",
    tipo: "Tablet",
    utenza: "Vodafone 3497654321",
    imei: "353511102345678",
    seriale: "SN002",
    modello: "iPad Air",
    stato: "RI",
    dataInizio: "2023-11-10",
    dataFine: "2024-05-22",
    note: "Riconsegnato per cambio modello",
    utenteId: 2,
  },
  {
    id: 3,
    asset: "ASSET-3001",
    tipo: "Smartphone",
    utenza: "TIM 3451234567",
    imei: "35209  9101234567",
    seriale: "SN003",
    modello: "iPhone 14",
    stato: "AS",
    dataInizio: "2024-03-15",
    dataFine: "",
    note: "Telefono principale",
    utenteId: 3,
  }
];

export const deviceManagement: DeviceManagement[] = [
  {
    id: 1,
    asset: "ASSET-1001",
    imei: "352099101234567",
    numeroSerie: "SN001",
    idInventario: "INV-1001",
    dispositivo: "Smartphone",
    modello: "iPhone 14",
    numeroTelefono: "3451234567",
    sede: "Sede Office",
    fornitore: "TIM",
    gestore: "Mario Rossi",
    servizio: "Fonia e dati",
    convenzione: "CONV_1002",
    note: "Telefono principale",
    inizio: "2024-03-15",
    fine: "",
    stato: "AS",
  },
  {
    id: 2,
    asset: "ASSET-2001",
    imei: "353511102345678",
    numeroSerie: "SN002", 
    idInventario: "INV-2001",
    dispositivo: "Tablet",
    modello: "iPad Air",
    numeroTelefono: "3497654321",
    sede: "Sede Office",
    fornitore: "Vodafone",
    gestore: "Luca Bianchi",
    servizio: "Accesso Internet",
    convenzione: "CONV_1001",
    note: "Riconsegnato per cambio modello",
    inizio: "2023-11-10",
    fine: "2024-05-22",
    stato: "RI",  
  }

];

export const serviceType: ServiceType[] = [
  { id: 1,codTipoServizio:"F", descrizione: "Fonia" },
  { id: 2,codTipoServizio:"D", descrizione: "Dati" },
  { id: 3,codTipoServizio:"FD", descrizione: "Fonia e dati" },
];

export const convention : Convention[] = [
  { id: 1, convenzione: "CONV_1001", descrizioneConvenzione: "Convenzione per dispositivi mobili" },
  { id: 2, convenzione: "CONV_1002", descrizioneConvenzione: "Convenzione per accessori IT" },
  { id: 3, convenzione: "CONV_1003", descrizioneConvenzione: "Convenzione per servizi di rete" },
  { id: 4, convenzione: "CONV_1004", descrizioneConvenzione: "Convenzione per software aziendale" },
  { id: 5, convenzione: "CONV_1005", descrizioneConvenzione: "Convenzione per hardware IT" },
  { id: 6, convenzione: "CONV_1006", descrizioneConvenzione: "Convenzione per servizi cloud" },
];
