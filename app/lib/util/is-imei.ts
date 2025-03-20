const sum = (base: string) => {
  let sum = 0,
    mul = 2,
    l = 14;
  for (let i = 0; i < l; i++) {
    let digit = base.substring(l - i - 1, l - i);
    let tp = parseInt(digit, 10) * mul;
    if (tp >= 10) sum += (tp % 10) + 1;
    else sum += tp;
    if (mul == 1) mul++;
    else mul--;
  }
  return sum;
};

function isImei(imei: string) {
  var etal = /^[0-9]{15}$/;
  if (!etal.test(imei)) return false;
  const _sum = sum(imei);
  let chk = (10 - (_sum % 10)) % 10;
  if (chk != parseInt(imei.substring(14, 15), 10)) return false;
  return true;
}

interface IGenerateImei {
  tac: number;
  snr: number;
}
function generateImei(input: IGenerateImei) {
  const { tac, snr } = input;
  const base = tac + snr.toString().padStart(6, "0");
  const _sum = sum(base);
  let chk = (10 - (_sum % 10)) % 10;
  return base + chk;
}

export { isImei, generateImei };
