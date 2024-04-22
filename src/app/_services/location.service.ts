import { Injectable } from '@angular/core';
import * as countrycitystatejson from 'countrycitystatejson';

@Injectable()
export class LocationService {
  private countryData = countrycitystatejson;

  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShortName: string | undefined) {
    return this.countryData.getStatesByShort(countryShortName);
  }

  getCitiesByState(country: string | undefined, state: string | undefined) {
    return this.countryData.getCities(country, state);
  }

  getCountryByShort(country: string | undefined){
    return this.countryData.getCountryByShort(country);
  }

}
