import axios from "axios";
import type { AssegnazioneDispositivoSearchRequest } from "../../types/types";
import type { Device } from "../../types/types"; 
import type { Assegnatario } from "../../types/types";

export class ExportService {
  private static assegnazioni: Device[] = [];
  private static assegnatarioSelezionato: Assegnatario | null = null;

  static setData(
    assegnazioni: Device[],
    assegnatario: Assegnatario | null
  ) {
    this.assegnazioni = assegnazioni;
    this.assegnatarioSelezionato = assegnatario;
  }

  static async exportCsv(filters: AssegnazioneDispositivoSearchRequest = {}) {
    const payload = {
      ...filters,
      dataRiferimento: filters.dataRiferimento || new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "/api/v1/assegnazioneDispositivo/exportCsv",
        payload,
        { responseType: "blob", timeout: 15000 }
      );

      return ExportService.downloadBlob(response.data, response.headers);
    } catch (error) {
  console.error("Backend non disponibile → genero CSV dai dati locali", error);
  return ExportService.generateDynamicCsv(payload);
}
  }

  private static downloadBlob(data: BlobPart, headers: any) {
    const disposition = headers["content-disposition"];
    let fileName = `assegnazioni_${new Date().toISOString().split("T")[0]}.csv`;
    if (disposition?.includes("filename=")) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) fileName = match[1];
    }

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  private static generateDynamicCsv(payload: any) {
    if (!this.assegnatarioSelezionato) {
      alert("Nessun assegnatario selezionato.");
      return;
    }


    let dati = this.assegnazioni;

    if (payload.dataInizio) {
      dati = dati.filter((a) => a.dataInizio >= payload.dataInizio);
    }
    if (payload.dataFine) {
      dati = dati.filter((a) => a.dataFine ? a.dataFine <= payload.dataFine : true);
    }

    const nominativo = `${this.assegnatarioSelezionato.nome} ${this.assegnatarioSelezionato.cognome}`;
    const oggi = new Date().toISOString().split("T")[0];

    const intestazioni = [
      "Asset",
      "Tipo",
      "Modello",
      "Utenza",
      "IMEI",
      "Seriale",
      "Stato",
      "Data Inizio",
      "Data Fine",
      "Note",
      "Assegnatario",
      "Unità Organizzativa",
    ].join(";");

    const righe = dati.map((a) => [
      a.asset || "",
      a.tipo || "",
      a.modello || "",
      a.utenza || "",
      a.imei || "",
      a.seriale || "",
      a.stato || "",
      a.dataInizio || "",
      a.dataFine || "",
      (a.note || "").replace(/"/g, '""'), 
      nominativo,
      this.assegnatarioSelezionato?.unitaOrganizzativa || "",
    ].join(";"));

    const csvContent = [intestazioni, ...righe].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileName = `assegnazioni_${nominativo.replace(/ /g, "_")}_${payload.dataRiferimento || oggi}.csv`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}