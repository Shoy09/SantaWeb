export interface ImporteDetalle {
  id:            number;
  idempresa:     null;
  tipo_envio:    string;
  idresponsable: string;
  idplanilla:    string;
  idemisor:      string;
  idturno:       string;
  fecha:         string;
  hora:          string;
  idsucursal:    string;
  idespecie:     string;
  detalle:       Detalle[];
}

export interface Detalle {
  item:            number;
  idcodigogeneral: string;
  idactividad:     string;
  idlabor:         string;
  idconsumidor:    string;
  cantidad:        string;
}
