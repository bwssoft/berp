import countries from 'i18n-iso-countries';
import ptLocale from 'i18n-iso-countries/langs/pt.json';

countries.registerLocale(ptLocale);

export class GetCountryNameByCode {
	public static execute(code: number) {
		const countryName = countries.getName(code.toString(), 'pt');
    return countryName;
	}
}
