import axios, { AxiosHeaders } from "axios";
import type { AxiosResponse } from "axios";
import type { DeviceExportRequest, DeviceManagement } from "../../types/types";

export class DeviceExportService {
  private static dispositivi: DeviceManagement[] = [];

  static setData(dispositivi: DeviceManagement[]) {
    this.dispositivi = dispositivi;
  }

  private static downloadBlob(
    data: Blob,
    rawHeaders: AxiosResponse["headers"]
  ) {
    let disposition: string | null = null;

    if (rawHeaders instanceof AxiosHeaders) {
      disposition = rawHeaders.get("content-disposition") as string | null;
    } else {
      disposition =
        (rawHeaders as Record<string, string>)["content-disposition"] ?? null;
    }

    let fileName = "dispositivi.csv";

    if (disposition?.includes("filename=")) {
      const match = disposition.match(/filename[*]?="?([^";\r\n]+)"?/);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static async exportCsv(filters: DeviceExportRequest = {}): Promise<boolean> {
    const payload = {
      ...filters,
      includeOpen: filters.includeOpen ?? true,
    };

    try {
      const response = await axios.post<Blob>(
        "/api/v1/dispositivo/exportCsv",
        payload,
        {
          responseType: "blob",
          timeout: 30000,
        }
      );

      if (response.data.size === 0) {
        alert(
          "Il server ha restituito un file vuoto. Nessun dato da esportare."
        );
        return false;
      }

      this.downloadBlob(response.data, response.headers);
      return true;
    } catch (error) {
      console.warn("Backend non raggiungibile -> fallback locale", error);
      return this.generateCsvFromLocalData(payload);
    }
  }

  private static generateCsvFromLocalData(
    filters: DeviceExportRequest
  ): boolean {
    if (this.dispositivi.length === 0) {
      alert(
        "Nessun dispositivo caricato in memoria. Impossibile generare il CSV."
      );
      return false;
    }

    let dati = [...this.dispositivi];

    if (filters.includeOpen === false) {
      dati = dati.filter((d) => d.stato !== "Cessato");
    }
    if (filters.ddtInizio) {
      dati = dati.filter((d) => d.inizio >= filters.ddtInizio!);
    }
    if (filters.ddtFine) {
      dati = dati.filter((d) => !d.fine || d.fine <= filters.ddtFine!);
    }

    if (dati.length === 0) {
      alert("Nessun dispositivo corrisponde ai filtri selezionati.");
      return false;
    }

    // === GENERAZIONE CSV ===
    const oggi = new Date().toISOString().split("T")[0];
    const headerRow = [
      "Asset",
      "Dispositivo",
      "Modello",
      "IMEI",
      "Numero Serie",
      "Telefono",
      "Gestore",
      "Stato",
      "Convenzione",
      "Sede",
      "Data Inizio",
      "Data Fine",
      "Note",
      "Fornitore",
      "Servizio",
    ].join(";");

    const dataRows = dati.map((d) =>
      [
        d.asset || "",
        d.dispositivo || "",
        d.modello || "",
        d.imei || "",
        d.numeroSerie || "",
        d.numeroTelefono || "",
        d.gestore || "",
        d.stato || "",
        d.convenzione || "",
        d.sede || "",
        d.inizio || "",
        d.fine || "",
        (d.note || "").replace(/"/g, '""'),
        d.fornitore || "",
        d.servizio || "",
      ].join(";")
    );

    const csvContent = [headerRow, ...dataRows].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const fileName = `dispositivi_export_${oggi}.csv`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  }
}
