export class GetCountryNameByCode {
	public static execute(code: number) {
		const countriCodes = {
			"1058": "Brasil"
		}
		
    return countriCodes[code.toString() as keyof typeof countriCodes] || "Desconhecido";
	}
}
