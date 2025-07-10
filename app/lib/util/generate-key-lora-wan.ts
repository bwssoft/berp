/**
 * Converte string decimal ou hex ("0x…") em U32
 */
function parseU32(str: string): number {
  const num = str.startsWith("0x")
    ? parseInt(str.slice(2), 16)
    : parseInt(str, 10);
  if (isNaN(num) || num < 0 || num > 0xffffffff) {
    throw new Error(`Valor inválido para U32: "${str}"`);
  }
  return num >>> 0;
}

/**
 * Converte um array de bytes em string hex (uppercase, sem prefixo)
 */
function hexlify(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

const COMPANY_ID = 0x01;

interface LorawanCredentials {
  device_eui: string;
  application_eui: string;
  device_address: string;
  network_session_key: string;
  application_session_key: string;
  application_key: string;
}

/**
 * Gera as credenciais LoRaWAN a partir de serial e timestamp
 * @param dwNSstr Numero de serie (decimal ou hex)
 * @param dwTSstr Timestamp (decimal ou hex)
 * @returns Objeto com device_eui, application_eui, device_address (hex), network_session_key, application_session_key e application_key (todos hex string)
 * @throws Error se dwNS ou dwTS for invalido ou igual a 0xFFFFFFFF
 */
export function genKeyLorawan(
  dwNSstr: string,
  dwTSstr: string
): LorawanCredentials {
  const dwNS = parseU32(dwNSstr);
  const dwTS = parseU32(dwTSstr);

  if (dwNS === 0xffffffff || dwTS === 0xffffffff) {
    throw new Error("dwNS ou dwTS invalido para geracao de chaves");
  }

  // Buffers
  const byDevEUI = new Uint8Array(8);
  const byAppEUI = new Uint8Array(8);
  const byAppKey = new Uint8Array(16);
  const byNwkSKey = new Uint8Array(16);
  const byAppSKey = new Uint8Array(16);

  // Constantes fixas
  const KeyIEEE = new Uint8Array([
    0x4c, 0xfa, 0xc9, 0x4c, 0xfa, 0xc9, 0x4c, 0xfa, 0xc9, 0x4c, 0xfa, 0xc9,
    0x4c, 0xfa, 0xc9, 0x4c,
  ]);
  let FixNwk = new Uint8Array([
    0xaa, 0x2c, 0x00, 0x00, 0x87, 0x60, 0x00, 0x00, 0x00, 0x00, 0x23, 0x9d,
    0xb1, 0xf5, 0x00, 0x00,
  ]);
  let FixApp = new Uint8Array([
    0x55, 0x35, 0x00, 0x00, 0xcc, 0x27, 0x00, 0x00, 0x00, 0x00, 0x84, 0x51,
    0xe3, 0x8b, 0x00, 0x00,
  ]);
  let FixAppKey = new Uint8Array([
    0x76, 0x2d, 0x00, 0x00, 0x41, 0xe7, 0x00, 0x00, 0x00, 0x00, 0x9e, 0xf2,
    0x53, 0x1c, 0x00, 0x00,
  ]);

  // DEV EUI
  let i = 0;
  byDevEUI[i++] = 0x4c;
  byDevEUI[i++] = 0xfa;
  byDevEUI[i++] = 0xc9;
  byDevEUI[i++] = COMPANY_ID;
  byDevEUI[i++] = (dwNS >>> 24) & 0xff;
  byDevEUI[i++] = (dwNS >>> 16) & 0xff;
  byDevEUI[i++] = (dwNS >>> 8) & 0xff;
  byDevEUI[i++] = dwNS & 0xff;

  // APP EUI (primeiros 8 bytes de device_eui)
  byAppEUI.set(byDevEUI.subarray(0, 8));

  // DEV ADDR
  const device_addressNum = dwNS;

  // NWK SKEY
  FixNwk[2] = (dwNS >>> 24) & 0xff;
  FixNwk[3] = (dwNS >>> 16) & 0xff;
  FixNwk[14] = (dwNS >>> 8) & 0xff;
  FixNwk[15] = dwNS & 0xff;
  FixNwk[6] = (dwTS >>> 16) & 0xff;
  FixNwk[7] = (dwTS >>> 8) & 0xff;
  FixNwk[8] = (dwTS >>> 16) & 0xff;
  FixNwk[9] = (dwTS >>> 8) & 0xff;
  for (i = 0; i < 16; i++) {
    byNwkSKey[i] = KeyIEEE[i] ^ FixNwk[i];
  }

  // APP SKEY
  FixApp[2] = (dwNS >>> 24) & 0xff;
  FixApp[3] = (dwNS >>> 16) & 0xff;
  FixApp[14] = (dwNS >>> 8) & 0xff;
  FixApp[15] = dwNS & 0xff;
  FixApp[6] = (dwTS >>> 16) & 0xff;
  FixApp[7] = (dwTS >>> 8) & 0xff;
  FixApp[8] = (dwTS >>> 16) & 0xff;
  FixApp[9] = (dwTS >>> 8) & 0xff;
  for (i = 0; i < 16; i++) {
    byAppSKey[i] = KeyIEEE[i] ^ FixApp[i];
  }

  // APP KEY
  FixAppKey[2] = (dwNS >>> 24) & 0xff;
  FixAppKey[3] = (dwNS >>> 16) & 0xff;
  FixAppKey[14] = (dwNS >>> 8) & 0xff;
  FixAppKey[15] = dwNS & 0xff;
  FixAppKey[6] = (dwTS >>> 16) & 0xff;
  FixAppKey[7] = (dwTS >>> 8) & 0xff;
  FixAppKey[8] = (dwTS >>> 16) & 0xff;
  FixAppKey[9] = (dwTS >>> 8) & 0xff;
  for (i = 0; i < 16; i++) {
    byAppKey[i] = KeyIEEE[i] ^ FixAppKey[i];
  }

  return {
    device_eui: hexlify(byDevEUI),
    application_eui: hexlify(byAppEUI),
    device_address: device_addressNum
      .toString(16)
      .padStart(8, "0")
      .toUpperCase(),
    network_session_key: hexlify(byNwkSKey),
    application_session_key: hexlify(byAppSKey),
    application_key: hexlify(byAppKey),
  };
}
