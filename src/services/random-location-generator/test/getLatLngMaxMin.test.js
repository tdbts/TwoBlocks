import { expect } from 'chai'; 
import getLatLngMaxMin from '../getLatLngMaxMin'; 

describe("getLatLngMaxMin()", () => {
	
	describe("Interface", () => {
		
		it("Should be a function.", () => {
			
			expect(getLatLngMaxMin).to.be.a('function'); 
		
		});
	
	});

	describe("Signature", () => {
		
		it("Should accept a single argument.", () => {
			
			expect(getLatLngMaxMin.length).to.equal(1); 
		
		});
	
	});

	describe("Functionality", () => {
		
		it("Should return an object describing the maximum and minimum values for both latitude and longitude.", () => {
			
			const MIN = 1; 
			const MED = 10; 
			const MAX = 100; 

			const testLatLng1 = [MIN, MED]; 
			const testLatLng2 = [MAX, MIN]; 
			const testLatLng3 = [MED, MAX]; 

			const testLatLngs = [
				testLatLng1, 
				testLatLng2, 
				testLatLng3
			]; 

			const latLngMaxMin = getLatLngMaxMin(testLatLngs); 

			expect(latLngMaxMin).to.be.an('object'); 
			expect(latLngMaxMin).to.have.keys('lat', 'lng'); 

			const { lat, lng } = latLngMaxMin; 

			expect(lat.min).to.equal(MIN); 
			expect(lat.max).to.equal(MAX); 
			expect(lng.min).to.equal(MIN); 
			expect(lng.max).to.equal(MAX); 
		
		});
	
	});

});
