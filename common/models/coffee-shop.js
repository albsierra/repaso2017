'use strict';

var _ = require('lodash');

module.exports = function(Coffeeshop) {
	Coffeeshop.status = function(cb) {
		var currentDate = new Date();
		var currentHour = currentDate.getHours();
		var OPEN_HOUR = 6;
		var CLOSE_HOUR = 20;
		console.log('Current hour is %d', currentHour);
		var response;
		if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
			response = 'We are open for business.';
		} else {
			response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
		}
		cb(null, response);
	};

	/**
	 * Mostrar el nombre de una cafetería
	 * @param {number} id Identificador de la cafetería
	 * @param {Function(Error, string)} callback
	 */

	Coffeeshop.getName = function(shopId, cb) {
		var name;
		Coffeeshop.findById(shopId, function(err, instance) {
			var response = "Name of coffee shop is " + instance.name;
			cb(null, response);
			console.log(response);
		});
	};

	/**
	 * Cafeterías en una ciudad
	 * @param {string} ciudad Nombre de la ciudad
	 * @param {Function(Error, array)} callback
	 */

	Coffeeshop.enCiudad = function(ciudad, callback) {
		Coffeeshop.find({
			where: {
				city: ciudad
			}
		}, function(err, cafeterias) {
			if (err) {
				callback(err)
			}
			callback(null, _.map(cafeterias, 'name'));
		})
	};

	/**
	 * Devuelve la ciudad de la cafetería
	 * @param {Function(Error, string)} callback
	 */

	Coffeeshop.prototype.getCity = function(callback) {
		callback(null, this.city);
	};


	/**
	 * Buscar todas las cafeterías que están en la misma ciudad que una dada
	 * @param {string} nombre El nombre de la cafetería de la que queremos saber su competencia
	 * @param {Function(Error, array)} callback
	 */

	Coffeeshop.competencia = function(nombre, callback) {
		Coffeeshop.find({
			where: {
				name: nombre
			},
			fields: ['city']
		}, function(err, ciudades) {
			if (err) callback(err);
			console.log(ciudades);
			var misCiudades = _.map(ciudades, 'city');
			console.log(misCiudades);
			Coffeeshop.find({
				where: {
					and: [{
						city: {
							inq: misCiudades
						}
					}, {
						name: {
							neq: nombre
						}
					}]
				},
				order: 'city'
			}, function(err, cafeterias) {
				if (err) {
					callback(err)
				}
				callback(null, cafeterias)
			})
		})
	};

};