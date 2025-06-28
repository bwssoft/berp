export interface INominatimInterface {
    display_name: string;
    lat: string;
    lon: string;
    address: {
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
}
